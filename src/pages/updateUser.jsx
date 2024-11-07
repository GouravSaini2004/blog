import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function UpdateUser() {
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState('');
    // const [email, setEmail] = useState('');
    // const [fullname, setFullname] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const userId = Cookies.get('_id');
            const useremail = Cookies.get('email');
            const userfullname = Cookies.get('fullname');
            const userpassword = Cookies.get('password');
            setId(userId);
            // setEmail(useremail);
            // setFullname(userfullname);
            setFormData({
                fullname: userfullname,
                email: useremail,
                password: userpassword
            });
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userData = {
                fullname: formData.fullname,
                email: formData.email,
                password: formData.password
            };

            const response = await fetch(`http://localhost:8000/user/updateuser/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                console.log('User updated successfully');
                setLoading(false);
                navigate('/profile');
            } else {
                console.error('Failed to update user');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    return (
        <div className="h-screen">
            <div className="m-2 flex justify-center content-center h-full">
                <div className="m-auto grid-cols-12 border-2 rounded-xl mt-16 border-gray-400">
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-black font-bold text-2xl mt-3">Update User Information</h1>
                        <div className="m-3">
                            <label htmlFor="fullname" className="m-3 text-xl block">Fullname</label>
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
                        <div className="m-3 hidden">
                            <label htmlFor="password" className="m-3 text-xl block">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="rounded bg-slate-400 w-72 h-10 text-black pl-2"
                            />
                        </div>
                        <button type="submit" className="bg-blue-800 rounded-xl h-10 w-20 text-white hover:bg-white hover:text-blue-800 font-semibold mb-5">Update</button>
                    </form>
                </div>
            </div>
            {loading && <div className="absolute inset-0 bg-black opacity-50 flex justify-center items-center">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
            </div>}
        </div>
    );
}

export default UpdateUser;
