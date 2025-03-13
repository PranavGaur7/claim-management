const express = require('express');
const multer = require('multer');
const path = require('path');
const Claim = require('../models/Claim');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images and PDFs only!');
        }
    }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Submit a claim - Patient only
router.post('/', protect, authorize('patient'), upload.single('document'), async (req, res) => {
    try {
        const { name, email, claimAmount, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a document' });
        }

        const claim = new Claim({
            patientId: req.user._id,
            name,
            email,
            claimAmount,
            description,
            document: req.file.path
        });

        await claim.save();
        res.status(201).json(claim);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all claims - Insurer only
router.get('/all', protect, authorize('insurer'), async (req, res) => {
    try {
        const { status, startDate, endDate, minAmount, maxAmount } = req.query;

        let query = {};

        // Filter by status
        if (status) {
            query.status = status;
        }

        // Filter by date range
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Filter by amount range
        if (minAmount || maxAmount) {
            query.claimAmount = {};
            if (minAmount) query.claimAmount.$gte = Number(minAmount);
            if (maxAmount) query.claimAmount.$lte = Number(maxAmount);
        }

        const claims = await Claim.find(query).sort({ createdAt: -1 });
        res.json(claims);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get patient's claims - Patient only
router.get('/my-claims', protect, authorize('patient'), async (req, res) => {
    try {
        const claims = await Claim.find({ patientId: req.user._id }).sort({ createdAt: -1 });
        res.json(claims);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get claim by ID - Both patient and insurer
router.get('/:id', protect, async (req, res) => {
    try {
        console.log("Fetching claim with ID:", req.params.id);
        const claim = await Claim.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        // Patients can only view their own claims
        if (req.user.role === 'patient' && claim.patientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this claim' });
        }

        res.json(claim);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Update claim status - Insurer only
router.put('/:id', protect, authorize('insurer'), async (req, res) => {
    try {
        const { status, approvedAmount, insurerComments } = req.body;

        const claim = await Claim.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        claim.status = status || claim.status;
        claim.approvedAmount = approvedAmount || claim.approvedAmount;
        claim.insurerComments = insurerComments || claim.insurerComments;
        claim.reviewedBy = req.user._id;

        await claim.save();
        res.json(claim);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
