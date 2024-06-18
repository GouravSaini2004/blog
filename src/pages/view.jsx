import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from 'js-cookie'


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
    const [count, setcount] = useState(0); 
    useEffect(() => {
        const id = Cookies.get('_id');
        setId(id);
    }, [])

    // blog details  fetch api------------------------------------------------------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                // setLoading(true)
                const response = await fetch(`https://gourav-saini.vercel.app//blog/view/${Id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                // console.log(response.status);
                // if(response.status==500 || response.status(404)){
                //       setFailed(true)
                // }
                const result = await response.json();
                // console.log(result)
                setBlog(result.blog);
                // setLoading(false)
                setUpdate(result.blog && result.blog.createdby);
                if (id == update._id) {
                    setButton(true);
                } else {
                    setButton(false)
                }
                // console.log(update);
                setComment(result.comments);
                // console.log(comment)
                // console.log(blog)
                
            } catch (e) {
                // setLoading(false)

                setError('Failed to fetch data. Please try again later.');
            }
        };
        fetchData();
    }, [Id, comment]);

    //   All blog fetch Api----------------------------------------------------------------
    const fetchUsers = async () => {
        try {
            // setLoading(true)
            const response = await fetch('https://gourav-saini.vercel.app');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            // console.log(data)
            setUsersblog(data);
            // setLoading(false)
        } catch (error) {
            // setLoading(false)
            // console.error(error);
            // setError('Failed to fetch users. Please try again later.');
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    // comment post fetch Api---------------------------------------------------------------
    const handleChange = (e) => {
        setFormData(e.target.value)
    };

    const additionalData = id;

    // Merge the additional variables with formData
    const dataToSend = { formData, additionalData };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://gourav-saini.vercel.app/blog/comment/${Id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(dataToSend)
            });
            if (response.ok) {
                console.log("data send succussfully:")
                setFormData('')
            } else {
                console.error('comment not send');
                // Handle error, display error message, etc.
            }
        } catch (error) {
            // setLoading(false)
            console.error('Error:', error);
        }
    }
    // delete the post-------------------------------------------------
    const handleDelete = async () => {
        // setLoading(true);
        console.log("button click")

        try {
            const response = await fetch(`https://gourav-saini.vercel.app/blog/deleteblog/${Id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log('Post deleted successfully');
                // setLoading(false);
                navigate('/');
            } else {
                console.error('Failed to delete post');
                // setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            // setLoading(false);
        }
    };
     
    //like the post----------------------------------------------------
    const handleLike = () => {
        const userid = Cookies.get('_id');
        // const postid = blog._id;
        // console.log(userid);
        // console.log(postid);
        // console.log("click like")

        fetch(`https://gourav-saini.vercel.app/blog/like/${Id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userid })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log("succuss");
            })
            .then(data => {
                console.log('API response:', data);
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    };

    useEffect(() => {
        const fetchData = async () => {
            // const postid = blog._id
            try {
                // setLoading(true)
                const response = await fetch(`https://gourav-saini.vercel.app/blog/like/${Id}`);
                // console.log(postid)
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                setLike(result.count);
                // setLoading(false)
            } catch (e) {
                // setLoading(false)
                setError('Failed to fetch data. Please try again later.');
            }
        };
        fetchData();
    }, [blog._id, handleLike]);

    //handle history of user----------------------------------------------------------------
    const handleHistory = (userid) => {
        const additionalVariable = Cookies.get('_id');
        // console.log(additionalVariable, userId)
        navigate(`/view/${userid}`)
        // console.log("click")

        const data = {
            additionalVariable: additionalVariable
        };
        fetch(`https://gourav-saini.vercel.app/user/history/${userid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('API response:', data);
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });

        fetch(`https://gourav-saini.vercel.app/blog/count/${Id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('API response:', data);
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    };

    // handel view of post----------------------------------------------------------
    useEffect(() => {
        const fetchData = async () => {
            // const postid = blog._id
            try {
                const response = await fetch(`https://gourav-saini.vercel.app/blog/count/${Id}`);
                // console.log(postid)
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                setcount(result.count);
            } catch (e) {

                setError('Failed to fetch data. Please try again later.');
            }
        };
        fetchData();
    }, [blog._id,handleHistory]);

    
        
    return (
            <>
                <div className="h-[573px] overflow-y-auto overflow-x-hidden mt-2">
                    <div className="grid grid-cols-12 gap-2 m-1">
                        <div className="col-span-12 lg:col-span-8 border-2 rounded-lg border-black w-full h-auto">
                            <div className="mx-auto w-11/12 h-auto">
                                <img src={`${blog.coverimage}`} alt="" />
                            </div>
    
                            {button && (
                                <>
                                    <div className="my-1 w-11/12 h-auto  mx-auto flex justify-between overflow-y-auto overflow-x-hidden">
                                        <Link to={`/update/${blog._id}`}><button className="test-white h-10 w-20 bg-green-900 rounded-xl ml-5">Update</button></Link>
                                        <button type="button" onClick={handleDelete} className="test-white h-10 w-20 bg-red-800 rounded-xl mr-5">Delete</button>
                                    </div>
                                </>
                            )}
    
    
    
                            <div className="my-1 w-11/12 h-auto  mx-auto flex justify-start overflow-y-auto overflow-x-hidden">
                                <h3 className="pl-2 font-semibold text-xl p-2">{blog.body}</h3>
                            </div>
                            <div className="my-1 mx-auto w-11/12 flex justify-start ">
                                <div className="p-2 m-1 gap-3">
                                    <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="" width={30} height={30} />
                                </div>
                                <div className="p-2 gap-3 font-medium text-xl">{blog.createdby && blog.createdby.fullname}</div>
                            </div>
                            <div className="mx-auto w-11/12 grid col-span-12">
                                <div className="col-8 flex justify-start">
                                    <button onClick={handleLike} className="border-2 border-gray-400 rounded-xl m-5 w-20">like <span>{like}</span></button>
                                    <div className="border-2 border-gray-400 rounded-xl m-5 w-16">view {count}</div>
                                    <div className="border-2 border-gray-400 rounded-xl m-5 w-16">save</div>
                                </div>
                            </div>
                            <div className="mx-auto w-11/12 flex justify-start ">
                                <h1 className="text-3xl font-bold ml-3">Comment <span className="text-xl">{comment.length}</span></h1>
                            </div>
                            {auth && (
                                <>
                                    <div className="mx-auto w-11/12 flex justify-start mt-1 ">
                                        <form onSubmit={handleSubmit} className="w-full">
                                            <div className="w-full">
                                                <input
                                                    type="text"
                                                    id="comment"
                                                    name="comment"
                                                    placeholder="Add a comment"
                                                    value={formData}
                                                    onChange={handleChange}
                                                    className="rounded bg-slate-400 w-11/12 h-10 text-black"
                                                />
                                            </div>
    
                                            <button type="submit" className="bg-blue-800 mt-1 rounded-xl h-9 w-16 text-white hover:bg-white hover:text-blue-800 font-semibold mb-5">Add</button>
    
                                        </form>
                                    </div>
                                </>
                            )}
    
                            {
                                comment.length > 0 && comment.map(com => (
                                    <div key={com._id} className="my-1 mx-auto w-11/12 h-auto">
                                        <div className="flex justify-start">
                                            <div className="ml-3 gap-3">
                                                <img className="mt-2" src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="" width={30} height={30} />
                                            </div>
                                            <div className="ml-1 gap-3">
                                                <div className="p-2 gap-3 text-xl">{com.createdby && com.createdby.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-start pl-2 ml-6 overflow-x-hidden">
                                            {com.comment}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        {/* side pallel----------------- */}
                        <div className="hidden lg:block col-span-4 w-11/12 mx-auto h-[700px] overflow-y-auto">
                            <div className="mx-auto my-2 w-11/12 h-[900px] border-2 rounded-lg border-black">
                                {usersblog.map(usersblog => (
                                    <div key={usersblog._id} className="col-span-3 h-auto m-3 ">
                                        <button onClick={() => handleHistory(usersblog._id)}>
                                            <div className="rounded-lg overflow-hidden shadow-lg mx-auto h-auto">
                                                <img className="w-full h-44 object-cover" src={`${usersblog.coverimage}`} alt="Placeholder" onError={() => setError('Failed to load image')} width={150} height={10} />
                                                <div className="px-2 py-2 flex justify-start gap-2">
                                                    <div className="">
                                                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="" width={40} height={40} />
                                                    </div>
                                                    <div className="font-bold text-medium mb-2">{usersblog.title}</div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {loading && <div className="absolute inset-0 bg-black opacity-50 flex justify-center items-center">
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
                    </div>}
                </div>
            </>
        )
    }

export default View;