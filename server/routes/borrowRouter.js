// import express from "express";
// import { isAuthenticated, isAuthorized} from '../middlewares/authMiddleware.js';
// import {borrowedBooks,getBorrowedBooksForAdmin,recordBorrowedBook,returnBorrowBook} from "../controllers/borrowControllers.js";

// const router = express.Router();

// router.post("/record-borrow-book/:id",isAuthenticated,isAuthorized("Admin"),recordBorrowedBook);
// router.get("/borrowed-books-by-users",isAuthenticated,isAuthorized("Admin"),getBorrowedBooksForAdmin);
// router.get("/my-borrowed-books",isAuthenticated,borrowedBooks);
// router.put("/return-borrowed-book/:bookId",isAuthenticated,isAuthorized("Admin"),returnBorrowBook);

// export default router;

import express from "express";
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddleware.js';
import {
  borrowedBooks,
  getBorrowedBooksForAdmin,
  recordBorrowedBook,
  returnBorrowBook,
  userBorrowBook // New controller for user-initiated borrows
} from "../controllers/borrowControllers.js";

const router = express.Router();

// Admin-only routes
router.post("/admin/record-borrow-book/:id", isAuthenticated, isAuthorized("Admin"), recordBorrowedBook);
router.get("/admin/borrowed-books", isAuthenticated, isAuthorized("Admin"), getBorrowedBooksForAdmin);
router.put("/admin/return-borrowed-book/:bookId", isAuthenticated, isAuthorized("Admin"), returnBorrowBook);

// User routes
router.post("/borrow-book/:id", isAuthenticated, isAuthorized("Borrower"), userBorrowBook);
router.get("/my-borrowed-books", isAuthenticated, borrowedBooks);

export default router;