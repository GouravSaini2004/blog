import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
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
        // console.log("button clicked")
        try {
            const response = await fetch('https://gourav-saini-q37q.vercel.app/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            // console.log("second button")

            if (response.ok) {
                // Handle success
                console.log('Form data sent successfully');
                navigate('/login');
            } else {
                // Handle error
                console.error('Failed to send form data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="h-screen">
            <div className="m-2 flex justify-center content-center h-full">
                <div className="m-auto grid-cols-12 border-2 rounded-xl mt-16 border-gray-400">
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-black font-bold text-2xl mt-3">Signup Form</h1>
                        <div className="m-3">
                            <label htmlFor="fullname" className="m-3 text-xl block">Full Name</label>
                            <input
                                type="text"
                                id="fullname"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="rounded bg-slate-400 w-72 h-10 text-black pl-2"
                            />
                        </div>
                        <div className="m-3">
                            <label htmlFor="email" className="m-3 text-xl block">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="rounded bg-slate-400 w-72 h-10 text-black pl-2"
                            />
                        </div>
                        <div className="m-3">
                            <label htmlFor="password" className="m-3 text-xl block self-start">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="rounded bg-slate-400 w-72 h-10 text-black pl-2"
                            />
                        </div>
                        <button type="submit" className="bg-blue-800 rounded-xl h-10 w-20 text-white hover:bg-white hover:text-blue-800 font-semibold mb-5">Submit</button>
                        <div className="m-3">
                            <p>If you have an account, click hear to <Link to={'/login'} className="underline text-blue-800 font-medium">login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signin;
