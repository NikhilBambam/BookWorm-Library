import React, { useState,useEffect } from "react";
import { BookA, NotebookPen } from "lucide-react";
import { useDispatch,useSelector } from "react-redux";
import { toggleAddBookPopup, toggleReadBookPopup,toggleRecordBookPopup } from "../store/slices/popUpSlice";
import {toast} from "react-toastify";
import { fetchAllBooks } from "../store/slices/bookSlice";
import { fetchALLBorrowedBooks,resetBorrowSlice } from "../store/slices/borrowSlice"; 
import { resetBookSlice } from "../store/slices/bookSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";

const BookManagement = () => {

  const dispatch = useDispatch();
  const {loading,error,message,books} =useSelector((state) => state.book);
  const {isAuthenticated,user} = useSelector((state) => state.auth);
  const{ 
    addBookPopup,
    readBookPopup,
    recordBookPopup,} = useSelector((state) => state.popup);


    const {loading:borrowSliceLoading,
      error:borrowSliceError,
      message:borrowSliceMessage,
    } = useSelector((state) => state.borrow);

    const[readBook,setReadBook] =useState({});
    const openReadPopup =(id) =>{
      const book =books.find((book) => book._id === id);
      setReadBook(book);
      dispatch(toggleReadBookPopup());
    }

    const [borrowedBookId, setBorrowedBookId] = useState("");

    const openRecordBookPopup = (id) => {
      setBorrowedBookId(id);
      dispatch(toggleRecordBookPopup());
    };

    useEffect(() => {
      if(message || borrowSliceMessage){
        toast.success(message || borrowSliceMessage );
        dispatch(fetchAllBooks());
        dispatch(fetchALLBorrowedBooks());
        dispatch(resetBookSlice());
        dispatch(resetBorrowSlice());
      }
      if(error || borrowSliceError){
        toast.error(error || borrowSliceError);
        dispatch(resetBookSlice());
        dispatch(resetBorrowSlice());
      }
    },[dispatch,message,error,loading,borrowSliceMessage,borrowSliceError,borrowSliceLoading]);

     const[searchedKeyword,setSearchKeyword]=useState("");
     const handleSearch = (e) => {
      setSearchKeyword(e.target.value.toLowerCase());
     }

     const searchedBooks = books.filter((book) => {
       return book.title.toLowerCase().includes(searchedKeyword);
     });

  return <>
  
  <main className="relative flex-1 p-6 pt-28">
  <Header />
  <header className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
    <h2 className="text-xl font-medium md:text-2xl md:font-semibold">
      {user && user.role === "Admin" ? "Book Management" : "Books"}
    </h2>
    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
      {isAuthenticated && user.role === "Admin" && (
        <button
          className="relative pl-14 w-full sm:w-52 flex gap-4 justify-center items-center py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800"
          onClick={() => dispatch(toggleAddBookPopup())}
        >
          <span className="bg-white flex justify-center items-center overflow-hidden rounded-full text-black w-[25px] h-[25px] text-[27px] absolute left-5">+</span>
          Add Book
        </button>
      )}
      <input
        type="text"
        placeholder="Search books..."
        className="w-full sm:w-52 border p-2 border-gray-300 rounded-md"
        value={searchedKeyword}
        onChange={handleSearch}
      />
    </div>
  </header>

  {/* Table */}
  {books && books.length > 0 ? (
    <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Author</th>
            {isAuthenticated && user.role === "Admin" && (
              <th className="px-4 py-2 text-left">Quantity</th>
            )}
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Availability</th>
            {isAuthenticated && user.role === "Admin" && (
              <th className="px-4 py-2 text-center">Record Book</th>
            )}
          </tr>
        </thead>
        <tbody>
          {searchedBooks.map((book, index) => (
            <tr key={book._id} className={(index + 1) % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{book.title}</td>
              <td className="px-4 py-2">{book.author}</td>
              {isAuthenticated && user.role === "Admin" && (
                <td className="px-4 py-2">{book.quantity}</td>
              )}
              <td className="px-4 py-2">${book.price}</td>
              <td className="px-4 py-2">{book.availability ? "Available" : "Out of Stock"}</td>
              {isAuthenticated && user.role === "Admin" && (
                <td className="px-4 py-2 flex space-x-2 my-3 justify-center">
                  <BookA onClick={()=> openReadPopup(book._id)}/>
                    <NotebookPen onClick={() => openRecordBookPopup(book._id)}/>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="mt-6 text-center text-gray-600">No books available.</div>
  )}
</main>

{addBookPopup && <AddBookPopup />}
{readBookPopup && <ReadBookPopup book={readBook} />}
{recordBookPopup && <RecordBookPopup bookId={borrowedBookId}/>}

   
  </>;
};

export default BookManagement;
