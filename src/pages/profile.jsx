import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';

function UserProfile() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        setName(Cookies.get('fullname'));
        setEmail(Cookies.get("email"));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md md:max-w-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 underline">{name} Profile</h1>

                <div className="flex flex-col items-center">
                    {/* Profile Image */}
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="Profile"
                        className="w-36 h-36 object-cover rounded-full mb-4"
                    />

                    {/* Name */}
                    <div className="w-full mb-4">
                        <p className="text-lg font-medium text-gray-700">Name</p>
                        <p className="text-xl text-gray-800 p-3 border-2 border-gray-300 rounded-xl">{name}</p>
                    </div>

                    {/* Email */}
                    <div className="w-full mb-6">
                        <p className="text-lg font-medium text-gray-700">Email</p>
                        <p className="text-xl text-gray-800 p-3 border-2 border-gray-300 rounded-xl">{email}</p>
                    </div>

                    {/* Update Button */}
                    <button
                        onClick={() => navigate('/updateuser')}
                        className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
