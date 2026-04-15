import express from "express";
import {
    borrowedBooks,
    getBorrowedBooksForAdmin,
    recordBorrowedBooks,
    returnBorrowBooks
} from "../controller/borrowController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/record-borrow-book/:id", isAuthenticated, isAuthorized("Admin"), recordBorrowedBooks);
router.get("/borrowed-books-by-users", isAuthenticated, isAuthorized("Admin"), getBorrowedBooksForAdmin);
router.get("/my-borrowed-books", isAuthenticated, getBorrowedBooksForAdmin);
router.put("/return-borrowed-books/:bookId", isAuthenticated, isAuthorized("Admin"), returnBorrowBooks);

export default router;