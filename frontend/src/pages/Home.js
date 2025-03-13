import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="container mx-auto p-4">
            <div className="text-center my-12">
                <h1 className="text-4xl font-bold mb-4">Claims Management Platform</h1>
                <p className="text-xl mb-8">A simple platform for managing insurance claims</p>

                {user ? (
                    <div className="mt-8">
                        {user.role === 'patient' ? (
                            <Link
                                to="/patient/dashboard"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700"
                            >
                                Go to Patient Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/insurer/dashboard"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700"
                            >
                                Go to Insurer Dashboard
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-center space-x-4 mt-8">
                        <Link
                            to="/login"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-lg hover:bg-gray-300"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">For Patients</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Submit insurance claims easily</li>
                        <li>Upload supporting documents</li>
                        <li>Track claim status in real-time</li>
                        <li>View approved amounts and comments</li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">For Insurers</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Review submitted claims</li>
                        <li>Filter claims by status, date, and amount</li>
                        <li>Approve or reject claims with comments</li>
                        <li>Manage approved amounts</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home;
