import React, { useEffect } from "react";
import{BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import {ToastContainer} from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import {fetchAllUsers} from "./store/slices/userSlice";
import { fetchAllBooks } from "./store/slices/bookSlice";
import { fetchALLBorrowedBooks, fetchUserBorrowedBooks } from "./store/slices/borrowSlice";


const App = () => {
  const {user,isAuthenticated} =useSelector((state)=>state.auth);
  const dispatch=useDispatch(); 
  useEffect(()=>{
    dispatch(getUser());
    dispatch(fetchAllBooks());
    if(isAuthenticated && user && user.role==="Admin"){
      dispatch(fetchAllUsers());
      dispatch(fetchALLBorrowedBooks());
    }
    if(isAuthenticated && user && user.role==="User"){
      dispatch(fetchUserBorrowedBooks());
      
    }
  },[isAuthenticated]);



  return <Router>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/password/forgot" element={<ForgotPassword/>}/>
      <Route path="/otp-verification/:email" element={<OTP/>}/>
      <Route path="/password/reset/:token" element={<ResetPassword/>}/>
    </Routes>
    <ToastContainer theme="dark" />
  </Router>
};

export default App;
