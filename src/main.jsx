import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter , createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import Home from './pages/home.jsx'
import Signin from "./pages/signin.jsx"
import Login from './pages/login.jsx'
import View from './pages/view.jsx'
import Post from './pages/post.jsx'
import ErrorComponent from './pages/error.jsx'
import History from './pages/history.jsx'
import Allblog from './pages/allblog.jsx'
import UserProfile from './pages/profile.jsx'
import AIComponent from './pages/ai.jsx'
// import UpdateUser from './pages/updateUser.jsx'
import UpdatePost from './pages/update.jsx'
import { Provider } from 'react-redux'
import store from "./app/store.js"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='/signup' element={<Signin />} />
      <Route path='/login' element={<Login />} />
      <Route path='/view/:Id' element={<View />} />
      <Route path='/post' element={<Post />} />
      <Route path='/error' element={<ErrorComponent />} />
      <Route path='/update/:Id' element={<UpdatePost />} />
      <Route path='/profile' element={<UserProfile />} />
      <Route path='/history' element={<History />} />
      <Route path='/allblog' element={<Allblog />} />
      <Route path='/ai' element={<AIComponent />} />
      {/* <Route path='/updateuser' element={<UpdateUser />} /> */}


    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
)
