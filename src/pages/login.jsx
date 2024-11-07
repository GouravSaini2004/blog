import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { login } from "../slice/loginSlice";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/user/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.status === 200) {
                setLoading(false);
                const data = await response.json();
                const user = data.user;

                localStorage.setItem("user", JSON.stringify(user));
                dispatch(login());
                navigate('/');
            } else {
                setLoading(false);
                setError("Invalid email or password");
                console.log("data not fetched:");
            }
        } catch (error) {
            setLoading(false);
            setError("Something went wrong. Please try again.");
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Side image */}
            <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/003/689/228/non_2x/online-registration-or-sign-up-login-for-account-on-smartphone-app-user-interface-with-secure-password-mobile-application-for-ui-web-banner-access-cartoon-people-illustration-vector.jpg')" }}></div>

            {/* Form Container */}
            <div className="w-full md:w-1/2 flex justify-center items-center bg-white p-6 md:p-12">
                <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-gray-50">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login Form</h1>

                    {/* Error Message */}
                    {error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-xl text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-xl text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex justify-end mb-4">
                            <a className="text-blue-800 underline" href="#">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-gray-600">Don't have an account? <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">Create Account</Link></p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Loading Spinner */}
            {loading && (
                <div className="absolute inset-0 bg-black opacity-50 flex justify-center items-center">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                </div>
            )}
        </div>
    );
}

export default Login;
