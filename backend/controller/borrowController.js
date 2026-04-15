import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";

export const recordBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { email } = req.body;
    const book = await Book.findById(req.body.bookId);
    if (!book) {
        return next(new ErrorHandler("Book not found.", 404));
    }
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("user not found.", 404));
    }
    // 1. Check availability
    if (book.quantity <= 0) {
        return next(new ErrorHandler("Book is not available.", 400));
    }

    // 2. Check already borrowed
    const isAlreadyBorrowed = user.borrowedBooks?.find(
        (b) => b.bookId && b.bookId.toString() === bookId && !b.returned
    );

    if (isAlreadyBorrowed) {
        return next(new ErrorHandler("Book already borrowed.", 400));
    }

    // 4. Then update book
    book.quantity -= 1;
    book.availability = book.quantity > 0;
    console.log("QUANTITY 👉", book.quantity);
    console.log("AVAILABLE 👉", book.availability);
    await book.save();
    user.borrowedBooks.push({
        bookId: book._id,
        bookTitle: book.title,
        borrowedDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save();
    await Borrow.create({
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        book: {
            id: book._id,
            title: book.title,
            price: book.price
        },

        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        price: book.price,
    });
    res.status(200).json({
        success: true,
        messaege: "Borrowed Book recorded Successfully.",
    });


});
export const returnBorrowBooks = catchAsyncErrors(async (req, res, next) => { 



    
});
export const borrowedBooks = catchAsyncErrors(async (req, res, next) => { });
export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => { });