import React from 'react';
import { Link } from 'react-router-dom';

const ErrorComponent = () => {
    return (
        <div className="bg-red-100 border h-screen flex justify-center items-center content-center border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">You enter wrong information. please try again.............</span>
            <Link to={'/login'} className='inline-block ml-5 bg-blue-800 rounded-xl text-white'>login again..</Link>
        </div>
    );
};

export default ErrorComponent;
