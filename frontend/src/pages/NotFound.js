import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-2xl text-gray-600 mb-8">Page not found</p>
            <Link
                to="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
                Go to Home
            </Link>
        </div>
    );
};

export default NotFound;
