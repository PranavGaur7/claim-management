import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClaimReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [claim, setClaim] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        status: '',
        approvedAmount: 0,
        insurerComments: ''
    });

    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        const fetchClaim = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/claims/${id}`);
                setClaim(res.data);

                // Initialize form with current values
                setFormData({
                    status: res.data.status,
                    approvedAmount: res.data.approvedAmount,
                    insurerComments: res.data.insurerComments
                });
            } catch (err) {
                setError('Failed to fetch claim details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchClaim();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateSuccess(false);

        try {
            const res = await axios.put(`http://localhost:5000/api/claims/${id}`, formData);
            setClaim(res.data);
            setUpdateSuccess(true);

            // Scroll to top to show success message
            window.scrollTo(0, 0);
        } catch (err) {
            setError('Failed to update claim. Please try again.');
            console.error(err);
        } finally {
            setUpdateLoading(false);
        }
    };

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
                    onClick={() => navigate('/insurer/dashboard')}
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
                    onClick={() => navigate('/insurer/dashboard')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {updateSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Claim updated successfully
                </div>
            )}

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Review Claim</h1>
                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(claim.status)}`}>
                            {claim.status}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-4">Patient Information</h2>
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

                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Claim Description</h2>
                        <p className="bg-gray-50 p-4 rounded">{claim.description}</p>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Supporting Document</h2>
                        <a
                            href={`http://localhost:5000/${claim.document}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            View Document
                        </a>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="border-t pt-6">
                            <h2 className="text-lg font-semibold mb-4">Review Decision</h2>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="status">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            {formData.status === 'Approved' && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2" htmlFor="approvedAmount">
                                        Approved Amount ($)
                                    </label>
                                    <input
                                        type="number"
                                        id="approvedAmount"
                                        name="approvedAmount"
                                        value={formData.approvedAmount}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        max={claim.claimAmount}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2" htmlFor="insurerComments">
                                    Comments
                                </label>
                                <textarea
                                    id="insurerComments"
                                    name="insurerComments"
                                    value={formData.insurerComments}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>

                            <div className="flex items-center justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/insurer/dashboard')}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    disabled={updateLoading}
                                >
                                    {updateLoading ? 'Updating...' : 'Update Claim'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClaimReview;
