import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { login } from "../slice/loginSlice"
import Cookies from "js-cookie"
import { Link } from "react-router-dom";
// import { Cookies } from 'universal-cookie';

function Login() {
    // const cookies = new Cookies();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
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
        
        // console.log("button click")
        // console.log(formData)

        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/user/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.status === 200) {
                // console.log(response.value)
                setLoading(false)
                //    console.log(response.status)                
                const data = await response.json();
                const user = data.user
               
                // console.log(user);
                Cookies.set('_id', user._id)
                // console.log(Cookies.get('user'))
                Cookies.set('fullname', user.fullname)
                Cookies.set('email', user.email)
                Cookies.set('image', user.profileimageurl)
                Cookies.set('password', user.password)
                dispatch(login())
                navigate('/')

            } else {
                setLoading(false)
                setError("Something went wrong. Please try again.")
                console.log("data not fetched:")
            }


        } catch (error) {
            setLoading(false)
            console.error('Error:', error);
        }
        finally {
            setLoading(false)
        }

    };

    if(!error.length==0){
        return(
            <>
               {
                navigate("/error")
               }
            </>
        )
    }

    return (
        <>
            <div className="h-screen">
                <div className="m-2 flex justify-center content-center h-full ">
                    <div className=" m-auto grid-cols-12 border-2 rounded-xl mt-16 border-gray-400">
                        <form onSubmit={handleSubmit}>
                            <h1 className="text-black font-bold text-2xl mt-3 underline">Login  Form</h1>

                            <div className="m-3">
                                <label className="m-3 text-xl block" htmlFor="email">Email</label>
                                <input className="rounded bg-slate-400 w-72 h-10 text-black pl-2" type="text" value={formData.email}
                                    onChange={handleChange} name="email" id="email" />
                            </div>
                            <div className="m-3">
                                <label className="m-3 text-xl block self-start" htmlFor="password">Passowrd</label>
                                <input className="rounded bg-slate-400 w-72 h-10 text-black pl-2" type="text" value={formData.password}
                                    onChange={handleChange} name="password" id="password" />
                            </div>
                            <div className="flex justify-end m-3 mr-10">
                                <a className="text-blue-800 underline" href="#">forget Password</a>
                            </div>
                            <button type="submit" className="bg-blue-800 rounded-xl h-10 w-20 text-white hover:bg-white hover:text-blue-800 font-semibold mb-5 ">Submit</button>
                            <div className="m-3 mb-5">
                                <Link to={'/signup'}>If you have not account, click hear <span className="text-blue-800 underline">Create Account</span></Link>
                            </div>

                        </form>
                    </div>
                </div>
                {loading && <div className="absolute inset-0 bg-black opacity-50 flex justify-center items-center">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
                </div>}
            </div>
        </>
    )
}

export default Login;