import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from 'js-cookie'
import { data } from "autoprefixer";

import { IoIosArrowUp } from "react-icons/io";

function View() {
    const auth = useSelector((state) => state.auth.isAuthenticated)
    const navigate = useNavigate();
    const { Id } = useParams();
    const [id, setId] = useState('')
    const [like, setLike] = useState(0);
    const [blog, setBlog] = useState([]);
    const [comment, setComment] = useState([]);
    const [error, setError] = useState(null);
    const [usersblog, setUsersblog] = useState([]);
    const [update, setUpdate] = useState([]);
    const [button, setButton] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState('');
    const [count, setCount] = useState(0);
    const [cla, setCla] = useState("hidden");
    const [cla2, setCla2] = useState("block");
    const [isSharing, setIsSharing] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const id = storedUser._id
        setId(id);
    }, [])

    const toggleVisibility = () => {
        setCla(prevCla => (prevCla === "hidden" ? "block" : "hidden")); // Toggle cla state
        setCla2(prevCla2 => (prevCla2 === "block" ? "hidden" : "block")); // Toggle cla2 state
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/blog/view/${Id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                setBlog(result.blog);
                setUpdate(result.blog && result.blog.createdby);
                if (id === update._id) {
                    setButton(true);
                } else {
                    setButton(false);
                }
                setComment(result.comments);
            } catch (e) {
                setError('Failed to fetch data. Please try again later.');
            }
        };
        fetchData();
    }, [Id, comment, update]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsersblog(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData(e.target.value)
    };

    const dataToSend = { formData, additionalData: id };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/blog/comment/${Id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });
            if (response.ok) {
                setFormData('')
            } else {
                console.error('Comment not sent');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/blog/deleteblog/${Id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                navigate('/');
            } else {
                console.error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLike = () => {
        const userid = Cookies.get('_id');
        fetch(`http://localhost:8000/blog/like/${Id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userid })
        })
            .then(response => response.ok ? response.json() : Promise.reject())

            .catch(error => console.error('Error:', error));
    };

    const handleHistory = (userid) => {
        navigate(`/view/${userid}`);
        fetch(`http://localhost:8000/user/history/${userid}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ additionalVariable: Id })
        });
        fetch(`http://localhost:8000/blog/count/${userid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .catch(error => console.error('Error:', error));
    };

    useEffect(() => {
        const fetchLikeCount = async () => {
            try {
                const response = await fetch(`http://localhost:8000/blog/like/${Id}`);
                if (response.ok) {
                    const data = await response.json()
                    setLike(data.count);
                    // console.log(data)
                }
                // Set the like count in the state
            } catch (error) {
                setError("Error fetching like count.");
            } finally {
                setLoading(false); // Set loading to false once the data is fetched
            }
        };

        fetchLikeCount();
    }, [handleHistory, handleLike]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/blog/count/${Id}`);
                const result = await response.json();
                setCount(result.count);
            } catch (e) {
                setError('Failed to fetch data. Please try again later.');
            }
        };
        fetchData();
    }, [blog._id, handleHistory]);

    const handleShare = async (imageUrl) => {
        const title = 'Check this out!';
        const text = 'Here is an interesting image.';

        // Prevent sharing if another share action is already in progress
        if (isSharing) return;

        try {
            setIsSharing(true);  // Set sharing in progress

            if (navigator.canShare && navigator.canShare({ url: imageUrl })) {
                await navigator.share({
                    title: title,
                    text: text,
                    url: imageUrl,  // Share the image URL
                });
                console.log('Shared successfully!');
            } else {
                console.log('Sharing is not supported on this device.');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        } finally {
            setIsSharing(false);  // Reset sharing state once complete
        }
    };

    return (
        <div className="bg-gray-50 h-screen overflow-y-auto">
            <div className="grid lg:grid-cols-12 grid-cols-1 gap-6 p-4">

                {/* Main Content (Blog Details) */}
                <div className="lg:col-span-8 col-span-12 bg-white p-4 rounded-lg shadow-lg">
                    <img src={blog.coverimage} alt="Blog" className="w-full rounded-lg" />

                    {button && (
                        <div className="flex justify-between mt-4">
                            <Link to={`/update/${blog._id}`} className="bg-green-600 hover:bg-green-400 text-white py-2 px-4 rounded">Update</Link>
                            <button onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded">Delete</button>
                        </div>
                    )}

                    <div className="my-4 text-lg text-start font-bold">{blog.body}</div>

                    <div className="flex items-center gap-2 mb-4">
                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="User" className="w-8 h-8 rounded-full" />
                        <span className="font-semibold">{blog.createdby && blog.createdby.fullname}</span>
                    </div>

                    {/* Interaction Buttons */}
                    <div className="flex gap-4 mb-4">
                        <button onClick={handleLike} className="bg-gray-200 py-2 px-4 rounded-lg">Like {like}</button>
                        <div className="bg-gray-200 py-2 px-4 rounded-lg">Views {count}</div>
                        <button onClick={() => handleShare(blog.coverimage)} className="bg-gray-200 py-2 px-4 rounded-lg">share</button>
                    </div>

                    {/* Comments Section */}
                    <div className="mb-4">
                        <div className="flex justify-center gap-5">
                            <h2 className="text-xl font-bold mb-2">Comments ({comment.length})</h2>
                            {/* <IoIosArrowUp onClick={toggleVisibility} size={25} color="white" className="bg-blue-700 rounded lg:hidden"/> */}
                        </div>

                        <div className="space-y-4">
                            {auth && (
                                <form onSubmit={handleSubmit} className="flex gap-4 mb-4">
                                    <input
                                        type="text"
                                        value={formData}
                                        onChange={handleChange}
                                        placeholder="Add a comment"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                    <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg">Add</button>

                                </form>
                            )}

                            <div>
                                {comment.length > 0 && comment.map((com) => (
                                    <div key={com._id} className="flex items-start gap-4">
                                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="User" className="w-8 h-8 rounded-full" />
                                        <div className="space-y-1">
                                            <p className="font-medium">{com.createdby && com.createdby.email}</p>
                                            <p className="text-start">{com.comment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Related Posts) */}
                <div className={`lg:col-span-4 col-span-12 bg-white p-4 rounded-lg shadow-lg ${cla2}`}>
                    <h3 className="text-xl font-bold mb-4">Related Posts</h3>
                    {usersblog.map((userblog) => (
                        <div key={userblog._id} className="flex items-start mb-4 w-full">
                            <img src={userblog.coverimage} alt={userblog.title} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex justify-between w-full">
                                <div className="ml-4">
                                    <h4 className="font-semibold text-start">{userblog.title}</h4>
                                    <h4 className="text-sm">{userblog.body}</h4>
                                </div>
                                <div className="flex-end">
                                    <button onClick={() => handleHistory(userblog._id)} className="text-blue-600 hover:underline">View</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default View;
