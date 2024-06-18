import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

function Allblog() {
    const [blog, setBlog] = useState([])
    const [error, setError] = useState();
    const [loading, setLoding] = useState(false);
    useEffect(() => {
        fetchUsers();
    }, [])

    const fetchUsers = async () => {
        const Id = Cookies.get('_id');
        setLoding(true)
        try {
            const response = await fetch(`https://gourav-saini.vercel.app/blog/allblog/${Id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            // console.log(data);
            setBlog(data);
            setLoding(false)
        } catch (error) {
            setError('Failed to fetch users. Please try again later.');
        }
    };

    // if (blog.length == 0) {
    //     return (
    //       <div className="h-screen flex justify-center items-center">
    //         <h1 className="text-red-800 font-bold text-2xl text-center">No blog yet...................</h1>
    //       </div>
    //     )
    //   }

    return (
        <>
            <div className="h-[600px] mt-2 overflow-y-auto">
                <div className="grid grid-cols-12 gap-4 ">
                    {blog.map(user => (
                        <div key={user._id} className="lg:col-span-3 h-auto m-3 md:col-span-4 sm:col-span-6 col-span-12 ">
                            <Link to={`/view/${user._id}`}>
                                <div className="rounded-lg overflow-hidden shadow-lg bg-white mx-auto h-auto">
                                    <img className="w-full h-44 object-cover" src={`${user.coverimage}`} alt="Placeholder" onError={() => setError('Failed to load image')} width={150} height={10} />
                                    <div className="px-2 py-2 flex justify-start gap-2">
                                        <div className="">
                                            <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="" width={40} height={40} />
                                        </div>
                                        <div className="font-bold text-medium mb-2">{user.title}</div>
                                    </div>
                                </div>
                            </Link>

                        </div>
                    ))}

                </div>
            </div>
            {loading && <div className="absolute inset-0 bg-black opacity-50 flex justify-center items-center">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
                </div>}
        </>
    )
}

export default Allblog
