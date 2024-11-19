import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function History() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const url = "https://mbackend-cwzo.onrender.com"

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const Id = storedUser._id
        
        try {

            setLoading(true);
            const response = await fetch(`${url}/user/history/${Id}`);
            if (!response.ok) {
                setLoading(false);
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            console.log(data.viewHistory);
            setUsers(data.viewHistory);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch users. Please try again later.');
            setLoading(false);
        }
    };

    // No history case
    if (users.length === 0) {
        return (
            <div className="h-screen flex justify-center items-center">
                <h1 className="text-red-800 font-bold text-2xl text-center">No history available.</h1>
            </div>
        );
    }


    return (
        <>
            <div className="h-screen mt-2 overflow-y-auto bg-gray-100 p-4">
                {/* Error Message */}
                {error && (
                    <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {/* History Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {users.map(user => (
                        <div key={user.postId._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <Link to={`/view/${user.postId && user.postId._id}`} className="block">
                                <div className="relative">
                                    <img 
                                        className="w-full h-44 object-cover" 
                                        src={user.postId && user.postId.image || 'https://via.placeholder.com/150'} 
                                        alt="Blog cover" 
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                                    />
                                    <div className="absolute top-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent p-2 text-white">
                                        <div className="text-lg font-bold">{user.postId && user.postId.title}</div>
                                    </div>
                                </div>
                                <div className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <img 
                                            src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
                                            alt="User Icon" 
                                            className="w-8 h-8 rounded-full border-2 border-gray-300"
                                        />
                                        <div className="text-sm font-semibold text-gray-800"> {user.postId && user.postId.content}</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Loading Spinner */}
                {loading && (
                    <div className="absolute inset-0 bg-black opacity-50 flex justify-center items-center">
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                    </div>
                )}
            </div>
        </>
    );
}

export default History;
