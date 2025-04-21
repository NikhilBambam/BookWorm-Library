import React, { useEffect, useState } from "react";
import logo_with_title from "../assets/logo-with-title-black.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import logo from "../assets/black-logo.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const UserDashboard = () => {
const {settingPopup} =useSelector(state=>state.popup);
const {userBorrowedBooks} =useSelector(state=>state.borrow);

const [totalBorrowedBooks,setTotalBorrowedBooks]=useState(0);
const [totalReturnedBooks,setTotalReturnedBooks]=useState(0);

useEffect(()=>{
let numberOfTotalBorrowedBooks=userBorrowedBooks.filter((book)=> book.returned ===false);
let numberOfTotalReturnedBooks=userBorrowedBooks.filter((book)=> book.returned ===true);
setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length);
setTotalReturnedBooks(numberOfTotalReturnedBooks.length);
},[userBorrowedBooks]);

const data = {
  labels:["Total Borrowed Books","Total Returned Books"],
  datasets:[
    {
      label:"Books",
      data:[totalBorrowedBooks,totalReturnedBooks],
      backgroundColor:["#3D3E3E","#151619"],
      hoverOffset:4,
    },
  ]
}

  return <>
<main className="relative flex-1 p-6 pt-28 bg-gray-100"> 
    <Header/>
    <div className="flex flex-col-reverse xl:flex-row gap-6">
      {/* left side */}
      <div className="flex flex-[4] flex-col gap-6 lg:gap-7 lg:py-5 justify-between xl:min-h-[85.5vh]">
        <div className="flex flex-col gap-6 flex-[4]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 bg-white p-5 min-h-[120px] rounded-lg transition hover:shadow-inner duration-300">
              <span className="w-[2px] bg-black h-20 lg:h-full"></span>
              <span className="bg-gray-300 h-20 lg:h-full min-w-20 flex justify-center items-center rounded-lg">
                <img src={bookIcon} alt="book-icon" className="w-8 h-8"/>
              </span>
              <h4 className="font-black m-4 overflow-visible text-3xl">{totalBorrowedBooks}</h4>
              <p className="text-lg xl:text-xl font-semibold">Your Borrowed book List</p>
            </div>
            <div className="flex items-center gap-3 bg-white p-5 min-h-[120px] rounded-lg transition hover:shadow-inner duration-300">
              <span className="w-[2px] bg-black h-20 lg:h-full"></span>
              <span className="bg-gray-300 h-20 lg:h-full min-w-20 flex justify-center items-center rounded-lg">
                <img src={returnIcon} alt="book-icon" className="w-8 h-8"/>
              </span>
              <h4 className="font-black m-4 overflow-visible text-3xl">{totalReturnedBooks}</h4>
              <p className="text-lg xl:text-xl font-semibold">Your Returned book List</p>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex items-center gap-3 bg-white p-5 h-[120px] rounded-lg transition hover:shadow-inner duration-300 flex-1">
              <span className="w-[2px] bg-black h-20 lg:h-full"></span>
              <span className="bg-gray-300 h-20 lg:h-full min-w-20 flex justify-center items-center rounded-lg">
                <img src={browseIcon} alt="book-icon" className="w-8 h-8"/>
              </span>
              <p className="text-lg xl:text-xl font-semibold">Let's browse books inventory</p>
            </div>
            <img 
              src={logo_with_title} 
              alt="logo" 
              className="hidden lg:block w-auto h-[120px] object-contain"
            />
          </div>
        </div>
        
        <div className="bg-white p-7 min-h-32 font-semibold relative flex-[3] flex justify-center items-center rounded-2xl">
          <div className="relative">
            <h4 className="text-xl sm:text-2xl lg:text-xl mb-5 font-semibold text-center text-gray-800 px-4 py-6 bg-white rounded-xl ">
              "Welcome back! Manage your borrowed books, explore the library, and enjoy seamless reading anytime, anywhere."
            </h4>
            <p className="text-gray-700 text-sm sm:text-lg absolute right-4 mt-2  sm:right-8 bottom-1">~BookWorm Team</p>
          </div>
        </div>
      </div>
      
      {/* right side */}
      <div className="flex-[2] flex flex-col gap-6 xl:gap-8 py-5">
        <div className="xl:flex-[4] flex justify-center items-center bg-white p-4 rounded-lg">
          <div className="w-full max-w-[400px] h-auto aspect-square">
            <Pie data={data} options={{cutout:0}} className="w-full h-full"/>
          </div>
        </div>
        
        <div className="flex items-center p-6 w-full bg-white rounded-lg xl:flex-1">
          <img src={logo} alt="logo" className="w-auto h-12 2xl:h-20"/>
          <span className="w-[2px] bg-black h-16 mx-4"/>
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#3D3E3E]"></span>
              <span>Total Borrowed Books</span>
            </p>
            <p className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#151619]"></span>
              <span>Total Returned Books</span>
            </p>
          </div>
        </div>
      </div>
    </div>
</main>
  
  </>;
};

export default UserDashboard;
