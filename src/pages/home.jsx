import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { login } from "../slice/loginSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const Id = storedUser && storedUser._id
  if(storedUser){
    dispatch(login());
  }

  const auth = useSelector((state) => state.auth.isAuthenticated);
  

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {

      setLoading(true);
      const response = await fetch('https://mbackend-cwzo.onrender.com');

      if (!response.ok) {
        setLoading(false);
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Failed to fetch users. Please try again later.');
    }
  };

  // Handle user history and navigation
  const handleHistory = (userid) => {
    const additionalVariable = Id;
    navigate(`/view/${userid}`);

    const data = {
      additionalVariable: additionalVariable,
    };

    fetch(`https://mbackend-cwzo.onrender.com/user/history/${userid}`, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .catch(error => console.error('Error:', error));


    fetch(`https://mbackend-up7l.onrender.com/blog/count/${userid}`, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .catch(error => console.error('Error:', error));
  };
  {!auth && (
    navigate('/login')
  )}

  return (
    <>
      {/* If user is authenticated */}
       {auth && 
      ( 
        <div className="h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-y-auto">
          <div className="grid grid-cols-12 gap-4 p-4">
            {users.map((user) => (
              <div key={user._id} className="lg:col-span-3 md:col-span-4 sm:col-span-6 col-span-12 p-3">
                <button onClick={() => handleHistory(user._id)}>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                    <img className="w-full h-44 object-cover" src={`${user.coverimage}`} alt="User cover" onError={() => setError('Failed to load image')} />
                    <div className="px-4 py-2 flex items-center gap-2">
                      <img className="w-10 h-10 rounded-full" src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="User avatar" />
                      <div>
                        <div className="font-semibold text-lg text-gray-800 text-start">{user.title}</div>
                        <div className="text-sm text-gray-800 text-start">{user.createdby && user.createdby.fullname}</div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
       )
      } 

      {/* If user is not authenticated */}
      

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 bg-black opacity-50 flex justify-center items-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        </div>
      )}
    </>
  );
}

export default Home;
