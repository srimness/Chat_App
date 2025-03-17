import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import UpdateProfile from './pages/UpdateProfile';
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () =>{
const {authUser, checkAuth, ischeckingAuth, onlineUsers} = useAuthStore();

console.log({onlineUsers});

useEffect(() => {
  checkAuth()
}, [checkAuth]);


if(ischeckingAuth)
  return (
  <div className="flex items-center justify-center h-screen">
    <Loader className='size-10 animate-spin' />
  </div>
);


  return (
    <div> 
      <Navbar />
      <Routes> 
        
        <Route  path="/" element={authUser? <HomePage /> : <Navigate to="/login"/> } />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />}/>
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />}/>
        <Route  path="/profile" element={authUser? <UpdateProfile /> : <Navigate to="/" />}/>
      </Routes>
      < Toaster />
   </div>
  )
}

export default App;


