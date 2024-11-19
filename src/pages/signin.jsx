import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: ''
    });
    const [auth, setauth] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        
        if(storedUser) setauth(true);
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("button clicked")
        try {
            setLoading(true);
            const response = await fetch('https://mbackend-cwzo.onrender.com/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok) {
                // Handle success
                console.log('Form data sent successfully');
                setLoading(false)
                navigate('/login');
            } else {
                // Handle error
                setLoading(false)
                setError('Failed to send form data. Please try again.');
            }
        } catch (error) {
            setLoading(false);
            setError("Something went wrong. Please try again.");
            console.error('Error:', error);
        }
    };

    if(auth){
        navigate('/')
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Side image */}
            <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/003/689/228/non_2x/online-registration-or-sign-up-login-for-account-on-smartphone-app-user-interface-with-secure-password-mobile-application-for-ui-web-banner-access-cartoon-people-illustration-vector.jpg')" }}></div>

            {/* Form Container */}
            <div className="w-full md:w-1/2 flex justify-center items-center bg-white p-6 md:p-12">
                <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-gray-50">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Signup Form</h1>

                    {/* Error Message */}
                    {error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="fullname" className="block text-xl text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                id="fullname"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                maxLength={15} 
                                minLength="3"// Set maximum length for the full name
                                required
                            />
                            {formData.fullname.length > 15 && (
                                <p className="text-red-500 text-sm mt-1">Full name cannot exceed 15 characters.</p>
                            )}
                        </div>

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

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-xl text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                minLength="8"
                                maxLength="15"
                                required
                            />
                        </div>

                        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                            {loading ? 'Submitting...' : 'Sign Up'}
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-gray-600">Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">Login here</Link></p>
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

export default Signin;
