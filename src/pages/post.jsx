import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'

function AddPost() {
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState('')
    // const [email, setEmail] = useState('')
    // const [image, setImage] = useState('')
    useEffect(() => {
        const id = Cookies.get('_id');
            setId(id);
    }, [])
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        file: null
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'file' ? files[0] : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const postData = new FormData();
            postData.append('title', formData.title);
            postData.append('body', formData.body);
            postData.append('file', formData.file);
            postData.append('id', id);

            const response = await fetch('https://gourav-saini.vercel.app/blog/addblog', {
                method: 'POST',
                body: postData
            });

            if (response.ok) {
                console.log('Post added successfully');
                setLoading(false);
                navigate('/');
            } else {
                console.error('Failed to add post');
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
                        <h1 className="text-black font-bold text-2xl mt-3">Add Post</h1>
                        <div className="m-3">
                            <label htmlFor="title" className="m-3 text-xl block">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="rounded bg-slate-400 w-72 h-10 text-black pl-2"
                            />
                        </div>
                        <div className="m-3">
                            <label htmlFor="body" className="m-3 text-xl block">Body</label>
                            <textarea
                                id="body"
                                name="body"
                                value={formData.body}
                                onChange={handleChange}
                                className="rounded bg-slate-400 w-72 h-32 text-black pl-2"
                            />
                        </div>
                        <div className="m-3">
                            <label htmlFor="file" className="m-3 text-xl block">File</label>
                            <input
                                type="file"
                                id="file"
                                name="file"
                                onChange={handleChange}
                                className="rounded bg-slate-400 w-72 h-10 text-black pl-2"
                            />
                        </div>
                        <button type="submit" className="bg-blue-800 rounded-xl h-10 w-20 text-white hover:bg-white hover:text-blue-800 font-semibold mb-5">Submit</button>
                    </form>
                </div>
            </div>
            {loading && <div className="absolute inset-0 bg-black opacity-50 flex justify-center items-center">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
            </div>}
        </div>
    );
}

export default AddPost;
