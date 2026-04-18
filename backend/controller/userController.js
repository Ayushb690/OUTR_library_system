import { catchAsyncErrors } from "../../backend/middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({ accountVerified: true });
    res.status(200).json({
        success: true,
        users,
    });
});

export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Admin avatar is required.", 400));
    }
    console.log("BODY 👉", req.body);
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new ErrorHandler("Please fill all fields.", 400));
    }
    const isRegistered = await User.findOne({ email, accountVerified: true });

    if (isRegistered) {
        return next(new ErrorHandler("User already registered.", 400));
    }

    if (password.length < 8 || password.length > 16) {
        return next(new ErrorHandler("Password must be betweem 8 to 16 characters long.", 400));
    }

    const { avatar } = req.files;
    const allowedFormats = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp"
];
    console.log("MIMETYPE 👉", avatar.mimetype);
    if (!allowedFormats.includes(avatar.mimetype)) {
        return next(new ErrorHandler("File format not supported.", 400));
    } // Fixed: Added missing closing brace

    const hashedPassword = await bcrypt.hash(password, 10);
    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath, // Fixed: Changed tempfilePath to tempFilePath (standard express-fileupload property)
        {
            folder: "LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS",
        }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary error:", cloudinaryResponse.error || "Unknown Cloudinary error.");
        return next(new ErrorHandler("Failed to upload the avatar to Cloudinary", 500)); // Fixed: Moved 500 inside the next() call
    }

    const admin = await User.create({ // Fixed: Changed 'user.create' to 'User.create' and renamed variable to 'admin'
        name,
        email,
        password: hashedPassword,
        role: "Admin",
        accountVerified: true,
        avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    res.status(201).json({
        success: true,
        message: "Admin registered Successfully.",
        admin, // Fixed: Changed Admin to admin to match the created variable
    });
});