import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClaimDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [claim, setClaim] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClaim = async () => {
            try {
                console.log("Fetching claim details for ID:", id);
                const res = await axios.get(`https://claim-management-lmev.onrender.com/api/claims/${id}`);
                setClaim(res.data);
            } catch (err) {
                setError('Failed to fetch claim details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
    
        if (id) fetchClaim();  // Ensure ID is not undefined
    }, [id]);
    

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
                <button
                    onClick={() => navigate('/patient/dashboard')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    if (!claim) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    Claim not found
                </div>
                <button
                    onClick={() => navigate('/patient/dashboard')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Claim Details</h1>
                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(claim.status)}`}>
                            {claim.status}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Claim Information</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Claim ID</p>
                                    <p>{claim._id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Submission Date</p>
                                    <p>{new Date(claim.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Requested Amount</p>
                                    <p className="font-semibold">${claim.claimAmount.toFixed(2)}</p>
                                </div>
                                {claim.status === 'Approved' && (
                                    <div>
                                        <p className="text-sm text-gray-500">Approved Amount</p>
                                        <p className="font-semibold text-green-600">${claim.approvedAmount.toFixed(2)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p>{claim.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p>{claim.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-4">Claim Description</h2>
                        <p className="bg-gray-50 p-4 rounded">{claim.description}</p>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-4">Supporting Document</h2>
                        <a
                            href={`https://claim-management-lmev.onrender.com/${claim.document}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            View Document
                        </a>
                    </div>

                    {claim.status !== 'Pending' && (
                        <div className="mt-8">
                            <h2 className="text-lg font-semibold mb-4">Insurer Comments</h2>
                            <p className="bg-gray-50 p-4 rounded">
                                {claim.insurerComments || 'No comments provided'}
                            </p>
                        </div>
                    )}

                    <div className="mt-8 text-right">
                        <button
                            onClick={() => navigate('/patient/dashboard')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaimDetails;
