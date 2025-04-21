import React, { useEffect, useState, useCallback } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import { fetchALLBorrowedBooks, resetBorrowSlice } from "../store/slices/borrowSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import Header from "../layout/Header";

const Catalog = () => {
  const dispatch = useDispatch();
  const { returnBookPopup } = useSelector((state) => state.popup);
  const { loading, error, allBorrowedBooks, message } = useSelector((state) => state.borrow);

  const [filter, setFilter] = useState("borrowed");
  const [email, setEmail] = useState("");
  const [borrowedBookId, setBorrowedBookId] = useState("");

  const formatDateAndTime = useCallback((timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(',', '');
  }, []);

  const formatDate = useCallback((timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  const currentDate = new Date();
  const borrowedBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate > currentDate;
  }) || [];

  const overDueBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate <= currentDate;
  }) || [];

  const booksToDisplay = filter === "borrowed" ? borrowedBooks : overDueBooks;

  const openReturnBookPopup = useCallback((id, email) => {
    setBorrowedBookId(id);
    setEmail(email);
    dispatch(toggleReturnBookPopup());
  }, [dispatch]);

  // When message or error appears
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchALLBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, error, message]);

  // Refetch borrowed books when popup closes
  useEffect(() => {
    if (!returnBookPopup) {
      dispatch(fetchALLBorrowedBooks());
    }
  }, [returnBookPopup, dispatch]);

  if (loading) {
    return (
      <main className="relative flex-1 p-6 pt-28">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="relative flex-1 p-6 pt-28">
        <Header />

        {/* Filter Buttons */}
        <header className="flex flex-col gap-3 md:flex-row sm:flex-row md:items-center">
          <button
            className={`relative rounded sm:rounded-tr-none sm:rounded-br-none sm:rounded-tl-lg sm:rounded-bl-lg text-center border-2 font-semibold py-2 w-full sm:w-72 transition-colors ${
              filter === "borrowed"
                ? "bg-black text-white border-black"
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("borrowed")}
          >
            Borrowed Books
          </button>

          <button
            className={`relative rounded sm:rounded-tl-none sm:rounded-bl-none sm:rounded-tr-lg sm:rounded-br-lg text-center border-2 font-semibold py-2 w-full sm:w-72 transition-colors ${
              filter === "overdue"
                ? "bg-black text-white border-black"
                : "bg-gray-200 text-black border-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("overdue")}
          >
            Overdue Borrowers
          </button>
        </header>

        {booksToDisplay.length > 0 ? (
          <div className="mt-6 overflow-auto bg-white rounded-md shadow-lg">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Username</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Borrowed Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {booksToDisplay.map((book, index) => (
                  <tr
                    key={`${book.book}-${index}`}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{book?.user?.name || 'N/A'}</td>
                    <td className="px-4 py-2">{book?.user?.email || 'N/A'}</td>
                    <td className="px-4 py-2">{book.price || '0.00'}</td>
                    <td className="px-4 py-2">{formatDate(book.dueDate)}</td>
                    <td className="px-4 py-2">{formatDateAndTime(book.createdAt)}</td>
                    <td className="px-4 py-2">
                      {book.returnDate ? (
                        <div className="flex items-center gap-1 text-black-600">
                          <FaSquareCheck className="w-5 h-5" />
                          <span>Returned</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => openReturnBookPopup(book.book, book?.user?.email)}
                          className="flex items-center gap-1 text-black-600 hover:text-black-800 transition-colors"
                        >
                          <PiKeyReturnBold className="w-5 h-5" />
                          <span>Return</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 p-6 bg-white rounded-md shadow-lg text-center">
            <h3 className="text-xl md:text-2xl font-medium text-gray-600">
              No {filter === "borrowed" ? "borrowed" : "overdue"} books found
            </h3>
          </div>
        )}
      </main>

      {returnBookPopup && <ReturnBookPopup bookId={borrowedBookId} email={email} />}
    </>
  );
};

export default Catalog;
