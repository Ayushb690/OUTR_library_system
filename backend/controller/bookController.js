import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Book } from "../models/bookModel.js";
import { } from "../models/userModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
// import express from "express";

export const addBook = catchAsyncErrors(async (req, res, next) => {
    const { title, author, description, price, quantity ,availability} = req.body;
    if (!title || !author || !description || !price || !quantity) {
        return next(new ErrorHandler("please fill all the Fields.", 400));
    }
    const book = await Book.create({
        title,
        author,
        description,
        price,
        quantity,
        availability: true,
    });
    res.status(201).json({
        success: true,
        message: "Book Added Successfully.",
        book,
    });
});
export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
    const books = await Book.find();
    res.status(200).json({
        success: true,
        books,
    });
});
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(req.body.bookId);
    if (!book) {
        return next(new ErrorHandler("Book not Found.", 404));
    }
    await book.deleteOne();
    res.status(200).json({
        success: true,
        message: "Book deleted Successfully."
    });
});