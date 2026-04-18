import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

export const recordBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
    // Aligned with router param name and internal logic
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

    if (book.quantity <= 0) {
        return next(new ErrorHandler("Book is not available.", 400));
    }

    // Matches 'bookid' (lowercase 'i') from your User Schema
    const isAlreadyBorrowed = user.borrowedBooks?.find(
        (b) => b.bookid?.toString() === bookId && !b.returned
    );

    if (isAlreadyBorrowed) {
        return next(new ErrorHandler("Book already borrowed.", 400));
    }

    // Update Book stock
    book.quantity -= 1;
    book.availability = book.quantity > 0;
    await book.save();

    // Push to User's array using the schema key 'bookid'
    user.borrowedBooks.push({
        bookid: book._id,
        bookTitle: book.title,
        borrowedDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        returned: false
    });
    await user.save();

    // Create the record in Borrow collection
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
        message: "Borrowed Book recorded Successfully.",
    });
});

export const returnBorrowBooks = catchAsyncErrors(async (req, res, next) => {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);
    console.log("DEBUG: ID from URL is:", bookId); // Is this undefined?

    console.log("DEBUG: Book Found is:", book); // Is this null?
    const { email } = req.body;

    if (!book) {
        return next(new ErrorHandler("Book not found.", 404));
    }

    const user = await User.findOne({ email, accountVerified: true });
    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }

    // Find record in user array using 'bookid'
    // Search user record
    const borrowedBook = user.borrowedBooks.find((b) => {
        // Check if bookid exists and matches (handling potential naming differences)
        const idInArray = b.bookid || b.bookId;
        return idInArray?.toString() === bookId && b.returned === false;
    });

    if (!borrowedBook) {
        // Add this console log to see what the server is actually seeing in the array
        console.log("BOOKS IN USER ARRAY 👉", user.borrowedBooks);
        return next(new ErrorHandler("You have not borrowed this book.", 400));
    }

    // Update User Record
    borrowedBook.returned = true;
    await user.save();

    // Update Book stock
    book.quantity += 1;
    book.availability = true;
    await book.save();

    // Find active record in Borrow collection
    const borrow = await Borrow.findOne({
        "book.id": bookId,
        "user.email": email,
        returnDate: null,
    });

    if (!borrow) {
        return next(new ErrorHandler("Borrow record not found in database", 400));
    }

    // Update Borrow Record
    borrow.returnDate = new Date();
    borrow.returned = true;
    const fine = calculateFine(borrow.dueDate);
    borrow.fine = fine;
    await borrow.save();

    res.status(200).json({
        success: true,
        message: fine !== 0
            ? `The book has been returned successfully. Fine: $${fine}`
            : `The book has been returned successfully.`
    });
});

export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
    // Uses the authenticated user's data
    const { borrowedBooks } = req.user;
    res.status(200).json({
        success: true,
        borrowedBooks
    });
});

export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
    // Returns all records from the Borrow collection
    const records = await Borrow.find();
    res.status(200).json({
        success: true,
        borrowedBooks: records
    });
});