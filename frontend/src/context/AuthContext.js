import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Set default headers for all requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // We'll use the stored user info to avoid an extra API call
                const userData = JSON.parse(localStorage.getItem('user'));
                if (userData) {
                    setUser(userData);
                }
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }

            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

            setUser(res.data.user);
            return true;
        } catch (error) {
            return false;
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
                role
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

            setUser(res.data.user);
            return true;
        } catch (error) {
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
