import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [no, setNo] = useState(false);

  const auth = useSelector((state) => state.auth.isAuthenticated)


  // handle all blog------------------------------------------------------
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      // console.log(data)
      setUsers(data);
      setLoading(false);
      // if(users.length==0){
      //   setNo(true)
      // }
    } catch (error) {
      // console.error(error);
      setLoading(false)
      setError('Failed to fetch users. Please try again later.');
    }
  };

  //handle history of user----------------------------------------------------------
  const handleHistory = (userid) => {
    const additionalVariable = Cookies.get('_id');
    // console.log(additionalVariable, userId)
    navigate(`/view/${userid}`)
    // console.log("click")

    const data = {
      additionalVariable: additionalVariable
    };
    fetch(`http://localhost:8000/user/history/${userid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('API response:', data);
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });

    fetch(`http://localhost:8000/blog/count/${userid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('API response:', data);
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  };



  // if (no) {
  //   return (
  //     <div className="h-screen flex justify-center items-center">
  //       <h1 className="text-red-800 font-bold text-2xl text-center">No post yet...................</h1>
  //     </div>
  //   )
  // }

  return (

    <>
      {auth && (
        <>
          <div className="h-[600px] mt-2 overflow-y-auto">
            <div className="grid grid-cols-12 gap-4 ">
              {users.map(user => (
                <div key={user._id} className="lg:col-span-3 h-auto m-3 md:col-span-4 sm:col-span-6 col-span-12 ">
                  <button onClick={() => handleHistory(user._id)}>
                    <div className="rounded-lg overflow-hidden shadow-lg bg-white mx-auto h-auto">
                      <img className="w-full h-44 object-cover" src={`${user.coverimage}`} alt="Placeholder" onError={() => setError('Failed to load image')} width={150} height={10} />
                      <div className="px-2 py-2 flex justify-start gap-2">
                        <div className="">
                          <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="" width={40} height={40} />
                        </div>
                        <div className="font-bold text-medium mb-2">{user.title}</div>
                      </div>
                    </div>
                  </button>

                </div>
              ))}

            </div>
          </div>
        </>
      )}
      {!auth && (
        <>
          <div className="h-screen flex justify-center items-center">
            <h1 className="text-red-800 font-bold text-2xl text-center">please login first..............</h1>
          </div>
        </>
      )}
      {loading && <div className="absolute inset-0 bg-black opacity-50 flex justify-center items-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
      </div>}
    </>

  );
}

export default Home;
