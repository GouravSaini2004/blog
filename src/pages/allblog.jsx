import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function Allblog() {
    const [blog, setBlog] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const url = "https://mbackend-cwzo.onrender.com"

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const Id = storedUser._id
        setLoading(true);

        try {

            const response = await fetch(`${url}/blog/allblog/${Id}`);

            if (!response.ok) {
                setLoading(false);
                throw new Error('Failed to fetch blogs');
            }
            const data = await response.json();
            setBlog(data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch blogs. Please try again later.');
            setLoading(false);
        }
    };

    if (blog.length === 0) {
        return (
            <div className="h-screen flex justify-center items-center">
                <h1 className="text-red-800 font-bold text-2xl text-center">No posts available...</h1>
            </div>
        );
    }

    return (
        <>
            <div className="h-screen mt-4 bg-gray-100 p-4">
                {/* Error Message */}
                {error && (
                    <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {/* Grid of Blog Posts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {blog.map(user => (
                        <div key={user._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <Link to={`/view/${user._id}`} className="block">
                                <div className="relative">
                                    {/* Image Section */}
                                    <img
                                        className="w-full h-48 object-cover"
                                        src={user.image || 'https://via.placeholder.com/150'}
                                        alt="Blog Post"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                                    />
                                    <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent text-white p-4">
                                        <h3 className="text-lg font-semibold">{user.title}</h3>
                                    </div>
                                </div>
                            </Link>
                            {/* Blog Metadata */}
                            <div className="px-4 py-2">
                                <div className="flex items-center gap-2">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                        alt="User Icon"
                                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                                    />
                                    <span className="text-sm font-semibold text-gray-700">By: {user.user && user.user.fullname}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Loading Spinner */}
            {loading && (
                <div className="absolute inset-0 bg-black opacity-50 flex justify-center items-center">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                </div>
            )}
        </>
    );
}

export default Allblog;
