import React from 'react';
import { Link } from 'react-router-dom';

const ErrorComponent = (props) => {
    var flag = false;
    if(props.route==="login"){
        flag = true;
    }
    const submit = ()=>{
        window.location.reload();
    }
    return (
        <div className="bg-red-100 border h-screen flex justify-center items-center content-center border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            
            {flag && (
                <>
                <span className="block sm:inline">You enter wrong email or password. please try again.............</span>
                <button className='bg-blue-800 text-white rounded-xl w-32' onClick={submit}>{props.name}</button>
                </>
            )}
            {!flag && (
                <>
                <span className="block sm:inline">something went wrong. please try again.............</span>
                <Link to={'/signup'} className='inline-block ml-5 bg-blue-800 rounded-xl text-white'>{props.name}</Link>
                </>
            )}
        </div>
    );
};

export default ErrorComponent;
