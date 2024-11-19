import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from 'js-cookie'
import { data } from "autoprefixer";

import { IoIosArrowUp } from "react-icons/io";

function View() {
    // let auth = false;
    const navigate = useNavigate();
    const { Id } = useParams();
    const [id, setId] = useState('')
    const [like, setLike] = useState(0);
    const [blog, setBlog] = useState([]);
    const [comm, setComm] = useState([])
    const [error, setError] = useState(null);
    const [usersblog, setUsersblog] = useState([]);
    const [update, setUpdate] = useState([]);
    const [button, setButton] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState('');

    const [cla, setCla] = useState("hidden");
    const [cla2, setCla2] = useState("block");
    const [isSharing, setIsSharing] = useState(false);
    const url = "https://mbackend-cwzo.onrender.com"

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const id = storedUser._id
        setId(id);
        
    }, [])

    const auth = useSelector((state) => state.auth.isAuthenticated);

    const toggleVisibility = () => {
        setCla(prevCla => (prevCla === "hidden" ? "block" : "hidden")); // Toggle cla state
        setCla2(prevCla2 => (prevCla2 === "block" ? "hidden" : "block")); // Toggle cla2 state
    };

    const dataToSend = { formData, additionalData: id };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${url}/blog/comment/${Id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });
            if (response.ok) {
                setFormData('')
                const data = await response.json()
                // console.log(data.comm)
                setComm(data.comment)
            } else {
                console.error('Comment not sent');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${url}/blog/view/${Id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                // console.log(result.blog)
                setBlog(result.blog);
                const data = result.blog && result.blog.user && result.blog.user._id;
                const storedUser = JSON.parse(localStorage.getItem("user"));
                const id = storedUser._id
                // console.log(data,"jh")
                // console.log(id,"jhjw")
                if (id != data) {
                    setButton(false);
                }
                // setComment(result.comments);
            } catch (e) {
                setError('Failed to fetch data. Please try again later.');
            }
        };
        fetchData();
    }, [Id, comm, like]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${url}`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsersblog(data);
            // console.log(data)
        } catch (error) {
            // console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData(e.target.value)
    };



    const handleDelete = async () => {
        try {
            const response = await fetch(`${url}/blog/deleteblog/${Id}`, {
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

    const handleView = async (id) => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const id1 = storedUser._id
        const additionalVariable = id; // Assuming id is the postId
        console.log("Handling view for post ID:", additionalVariable);
      
        // First fetch to update blog views
        const response = await fetch(`${url}/blog/count/${id}`);
        if (!response.ok) {
          console.error("Error updating blog views");
          navigate('/');
          return; // Stop further execution if first fetch fails
        }
        const data = await response.json();
        console.log("Blog view update response:");
    
         // Second fetch to update user history
         const respons = await fetch(`${url}/user/history/${id1}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId: additionalVariable }), // Sending postId as body
        });
        console.log(respons)
      
        // Check if the second request was successful
        if (respons.ok) {
          const data1 = await respons.json();
          console.log("History updated successfully:");
          navigate(`/view/${id}`); // Navigate to the view page if both requests succeed
        } else {
          // Log the error if the history update failed
          const error = await respons.json();
          console.error("Error updating history:", error);
          navigate('/'); // Navigate to a fallback page on failure
        }
      
        
      }


    const handleLike = async (blogId) => {

        try {
            const response = await fetch(`${url}/blog/like/${blogId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: id }),
            });

            const data = await response.json();

            if (response.ok) {

                setLike(data.likes);  // Update the number of likes
            } else {
                console.error(data.error);
                alert(data.error || 'An error occurred');
            }
        } catch (error) {
            console.error('Error liking the blog:', error);
            alert('An error occurred while liking the blog');
        }
    };

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

    // if(!auth){
    //     navigate('/login')
    // }

    return (
        <div className="bg-gray-50 h-auto">
            <div className="grid lg:grid-cols-12 grid-cols-1 gap-6 p-4">

                
                <div className="lg:col-span-8 col-span-12 bg-white p-4 rounded-lg shadow-lg items-center">
                    <img src={blog.image} alt="Blog" className="rounded-lg h-96 w-auto" />

                    {button && (
                        <div className="flex justify-between mt-4">
                            <Link to={`/update/${blog._id}`} className="bg-green-600 hover:bg-green-400 text-white py-2 px-4 rounded">Update</Link>
                            <button onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded">Delete</button>
                        </div>
                    )}

                    <div className="my-4 text-lg text-start font-bold">{blog.content}</div>

                    <div className="flex items-center gap-2 mb-4">
                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="User" className="w-8 h-8 rounded-full" />
                        <span className="font-semibold">{blog.user && blog.user.fullname}</span>
                    </div>

                    {/* Interaction Buttons */}
                    <div className="flex gap-4 mb-4">
                        <button onClick={() => { handleLike(blog._id) }} className="bg-gray-200 py-2 px-4 rounded-lg">Like {blog.likes && blog.likes.length}</button>
                        <div className="bg-gray-200 py-2 px-4 rounded-lg">Views {blog.views}</div>
                        <button onClick={() => handleShare(blog.image)} className="bg-gray-200 py-2 px-4 rounded-lg">share</button>
                    </div>

                    {/* Comments Section */}
                    <div className="mb-4">
                        <div className="flex justify-center gap-5">
                            <h2 className="text-xl font-bold mb-2">Comments</h2>
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
                                {blog.comments && blog.comments.length > 0 && blog.comments.map((com) => (
                                    <div key={com._id} className="flex items-start gap-4">
                                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="User" className="w-8 h-8 rounded-full" />
                                        <div className="space-y-1">
                                            <p className="font-medium">{com.user && com.user.email}</p>
                                            <p className="text-start">{com.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Related Posts) */}
                <div className={`lg:col-span-4 col-span-12 bg-white p-4 rounded-lg shadow-lg`}>
                    <h3 className="text-xl font-bold mb-4">Related Posts</h3>
                    {usersblog.map((userblog) => (
                        <div key={userblog._id} className="flex items-start mb-4 w-full">
                            <img src={userblog.image} alt={userblog.title} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex justify-between w-full">
                                <div className="ml-4">
                                    <h4 className="font-semibold text-start">{userblog.title}</h4>
                                    <h4 className="text-sm">{userblog.body}</h4>
                                </div>
                                <div className="flex-end">
                                    <button onClick={() => handleView(userblog._id)} className="text-blue-600 hover:underline">View</button>
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
