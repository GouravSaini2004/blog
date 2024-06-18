import './App.css'
import Cookies from 'js-cookie'
import { useDispatch } from "react-redux";
import { login } from "./slice/loginSlice"

import Nav from './pages/nav'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const cookievalue = Cookies.get('_id');
    if(cookievalue){
      dispatch(login());

    }

  }, [])
  

  return (
    <>
      <Nav />
      <Outlet />
    </>
  )
}

export default App
