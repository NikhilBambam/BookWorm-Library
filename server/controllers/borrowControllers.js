// import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
// import ErrorHandler from "../middlewares/errorMiddlewares.js"
// import { Borrow } from "../models/borrowModel.js";
// import {Book} from "../models/bookmodel.js";
// import{User} from "../models/userModel.js";
// import {calculateFine} from "../utils/fineCalculator.js";

// export const borrowedBooks=catchAsyncErrors(async(req,res,next)=>
// {
//     const {borrowedBooks} = req.user;
//     res.status(200).json({
//         success:true,
//         borrowedBooks,
//     });

// })

// export const getBorrowedBooksForAdmin=catchAsyncErrors(async(req,res,next)=>
//  {
//     const borrowedBooks= await Borrow.find();
//     res.status(200).json({
//         success:true,
//         borrowedBooks,
//     });
//     })

//  export const recordBorrowedBook =catchAsyncErrors(async(req,res,next)=>{
//     const{id} =req.params;
//     const{email}=req.body;

//     const book =await Book.findById(id);
//     if(!book)
//     {
//         return next(new ErrorHandler("Book not found.",400));
//     }
//     const user = await User.findOne({email,role:"Admin",accountVerified:true});
//     if(!user)
//     {
//         return next(new ErrorHandler("User not found.",404));
//     }
//     if(book.quantity === 0)
//     {
//         return next(new ErrorHandler("Book not available.",400));
//     }
//     const isAlreadyBorrowed = user.borrowedBooks.find(
//         (b)=> b.bookId.toString() === id && b.returned === false
//     );
//     if(isAlreadyBorrowed)
//     {
//         return next(new ErrorHandler("Book already borrowed.",400))
//     }
//     book.quantity -=1;
//     book.availability = book.quantity> 0;
//     await book.save();

//     user.borrowedBooks.push({
//         bookId:book._id,
//         bookTitle:book.title,
//         borrowedDate:new Date(),
//         dueDate:new Date(Date.now()+7*24*60*60*1000),
//     })
//     await user.save();
//     await Borrow.create({
//         user:{
//             id:user._id,
//             name:user.name,
//             email:user.email
//         },
//         book:book._id,
//         dueDate:new Date(Date.now()+7*24*60*60*1000),
//         price:book.price,
//     });
//     res.status(200).json({
//         success:true,
//         message:"Borrowed book recorded successfully."
//     });

//  })

//  export const returnBorrowBook = catchAsyncErrors(async(req,res,next) =>{
//     const {bookId} = req.params;
//     const {email} =req.body;
//     const book = await Book.findById(bookId);
//     if(!book)
//         {
//             return next(new ErrorHandler("Book not found.",400));
//         }
//         const user = await User.findOne({email,accountVerified:true});
//         if(!user)
//         {
//             return next(new ErrorHandler("User not found.",404));
//         }
//         const borrowedBook = user.borrowedBooks.find(
//             (b)=>b.bookId.toString() === bookId && b.returned === false
//         );
//         if(!borrowedBook)
//         {
//             return next(new ErrorHandler("You have not borrowed this book.",400))
//         }
//         borrowedBook.returned = true;
//         await user.save();

//         book.quantity +=1;
//         book.availability = book.quantity > 0;
//         await book.save();

//         const borrow = await Borrow.findOne({
//             book:bookId,
//             "user.email":email,
//             returnDate:null,
//         });
//         if(!borrow)
//         {
//             return next(new ErrorHandler("You have not borrowed this book.",400))
//         }
//         borrow.returnDate = new Date();
        
//         const fine = calculateFine(borrow.dueDate);
//         borrow.fine =fine;

//         await borrow.save();
//         res.status(200).json({
//             success:true,
//             message:
//             fine !==0 
//             ? `The book has been returned successfully.The total charges,including a fine,are$${fine+book.price}`
//             : `The book has been returned successfully.The total charges are $${book.price}`,
//         })
//  });

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js"
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookmodel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

// Get borrowed books for current user
export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const { borrowedBooks } = req.user;
  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

// Admin: Get all borrowed books
export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
  const borrowedBooks = await Borrow.find().populate('book', 'title author');
  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

// Admin: Record a borrowed book for any user
export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  const user = await User.findOne({ 
    email,
    role: { $in: ["Admin", "Borrower"] },
    accountVerified: true 
  });
  
  if (!user) {
    return next(new ErrorHandler("User not found or not authorized to borrow books.", 404));
  }

  if (book.quantity === 0) {
    return next(new ErrorHandler("Book not available.", 400));
  }

  const isAlreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === id && b.returned === false
  );

  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("Book already borrowed by this user.", 400));
  }

  // Update book quantity
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  // Update user's borrowed books
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  user.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.title,
    borrowedDate: new Date(),
    dueDate,
    returned: false
  });
  await user.save();

  // Create borrow record
  await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    book: book._id,
    borrowedDate: new Date(),
    dueDate,
    price: book.price,
  });

  res.status(200).json({
    success: true,
    message: "Book borrowed successfully.",
    dueDate: dueDate.toISOString().split('T')[0] // Return formatted date
  });
});

// User-initiated book borrowing
export const userBorrowBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  if (book.quantity === 0) {
    return next(new ErrorHandler("Book not available.", 400));
  }

  const user = await User.findById(userId);
  const isAlreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === id && b.returned === false
  );

  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("You have already borrowed this book.", 400));
  }

  // Update book quantity
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  // Update user's borrowed books
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  user.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.title,
    borrowedDate: new Date(),
    dueDate,
    returned: false
  });
  await user.save();

  // Create borrow record
  await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    book: book._id,
    borrowedDate: new Date(),
    dueDate,
    price: book.price,
  });

  res.status(200).json({
    success: true,
    message: "Book borrowed successfully.",
    dueDate: dueDate.toISOString().split('T')[0]
  });
});

// Return a borrowed book
export const returnBorrowBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body;

  const book = await Book.findById(bookId);
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  const borrowedBook = user.borrowedBooks.find(
    (b) => b.bookId.toString() === bookId && b.returned === false
  );

  if (!borrowedBook) {
    return next(new ErrorHandler("This user hasn't borrowed this book.", 400));
  }

  // Update user record
  borrowedBook.returned = true;
  await user.save();

  // Update book availability
  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  // Update borrow record
  const borrow = await Borrow.findOne({
    book: bookId,
    "user.email": email,
    returnDate: null,
  });

  if (!borrow) {
    return next(new ErrorHandler("Borrow record not found.", 404));
  }

  borrow.returnDate = new Date();
  const fine = calculateFine(borrow.dueDate);
  borrow.fine = fine;

  await borrow.save();

  res.status(200).json({
    success: true,
    message: fine !== 0
      ? `Book returned successfully. Total charges: $${fine + book.price} (includes $${fine} fine)`
      : `Book returned successfully. Total charges: $${book.price}`,
    fine,
    price: book.price
  });
});