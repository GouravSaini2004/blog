import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';


function UserProfile() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    useEffect(() => {
        setName(Cookies.get('fullname'))
        setEmail(Cookies.get("email"))
    }, [])

    // const handleUpdate = () =>{
    //      navigate("/updateuser");
    // }
    return (
        <>
            <div className="h-screen">
                <div className="m-2 flex justify-center content-center h-full ">
                    <div className=" m-auto grid-cols-12 border-2 w-[300px] md:w-[500px] rounded-xl mt-16 border-gray-400">
                        <h1 className="text-black font-bold text-2xl mt-3 underline">User Profile</h1>
                        <div className='m-3'>
                            <div className='inline-block m-3'>
                                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="" width={150} height={150} />
                            </div>
                            <div className=' m-3'>
                                <p>Name</p>
                                <p className='text-xl border-2 border-gray-400 rounded-xl'>{name}</p>
                            </div>
                            <div className='m-3 mt-5'>
                                <p>Email</p>
                                <p className='text-xl border-2 border-gray-400 rounded-xl'>{email}</p>
                            </div>
                            <div className='mt-3 m-3'>
                                <button className= ' m-2 bg-blue-800 text-white rounded-lg h-10 w-20'>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </>

    );
}


export default UserProfile;
