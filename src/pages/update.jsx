import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

function UpdatePost() {
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState('');
    const { Id } = useParams(); // Assuming your route includes the postId parameter
    const navigate = useNavigate();

    useEffect(() => {
        const userId = Cookies.get('_id');
        setId(userId);
        // Fetch post data using postId and populate the form
        fetchPostData();
    }, []);

    const [formData, setFormData] = useState({
        title: '',
        body: '',
        file: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'file' ? files[0] : value,
        });
    };

    const fetchPostData = async () => {
        try {
            const response = await fetch(`https://gourav-saini.vercel.app/blog/view/${Id}`);
            if (response.ok) {
                const postData = await response.json();
                setFormData({
                    title: postData.blog.title,
                    body: postData.blog.body,
                    file: postData.blog.coverimage, // Assuming the cover image URL is returned from the server
                });
            } else {
                console.error('Failed to fetch post data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.title || !formData.body) {
            alert('Title and Body are required!');
            setLoading(false);
            return;
        }

        try {
            const postData = new FormData();
            postData.append('title', formData.title);
            postData.append('body', formData.body);
            postData.append('file', formData.file);
            postData.append('id', id);

            const response = await fetch(`http://localhost:8000/blog/updateblog/${Id}`, {
                method: 'PATCH',
                body: postData,
            });

            if (response.ok) {
                console.log('Post updated successfully');
                setLoading(false);
                navigate('/');
            } else {
                console.error('Failed to update post');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Update Post</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" className="block text-lg font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter title"
                        />
                    </div>

                    {/* Body Input */}
                    <div>
                        <label htmlFor="body" className="block text-lg font-medium text-gray-700">Body</label>
                        <textarea
                            id="body"
                            name="body"
                            value={formData.body}
                            onChange={handleChange}
                            required
                            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter body content"
                            rows="6"
                        />
                    </div>

                    {/* Image File Input */}
                    <div>
                        <label htmlFor="file" className="block text-lg font-medium text-gray-700">Cover Image (Optional)</label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Post'}
                        </button>
                    </div>
                </form>

                {loading && (
                    <div className="absolute inset-0 bg-black opacity-50 flex justify-center items-center">
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UpdatePost;
