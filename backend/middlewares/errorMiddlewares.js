// class ErrorHandler extends Error {
//     constructor(statusCode, message) {
//         super(message);
//         this.statusCode = statusCode;
//     }
// }

// export const errorMiddleware = (err, req, res, next) => {
//     err.message = err.message || "Internal server Error";
//     err.statusCode = err.statusCode || 500;


//     if (err.code === 11000) {
//         const statusCode = 400;
//         const message = 'Duplicate field value Entered.';
//         err = new ErrorHandler(message, err.statusCode);

//     }

//     if (err.name === "JsonWebTokenError") {
//         const statusCode = 400;
//         const message = 'Json Web Token is Invalid. Try again';
//         err = new ErrorHandler(message, err.statusCode);
//     }
//     if (err.name === "TokenExpiredError") {
//         const statusCode = 400;
//         const message = 'Json Web Token is expired. Try again';
//         err = new ErrorHandler(message, err.statusCode);
//     }
//     if (err.name === "CastError") {
//         const statusCode = 400;
//         const message = 'Resource not found . Invalid: ${err.path}';
//         err = new ErrorHandler(message, err.statusCode);
//     }

//     const errorMessage = err.errors ? Object.values(err.errors).map(error => error.message).join(" ") : err.message;

//     return res.status(err.statusCode).json(
//         {
//             success: false,
//             message: errorMessage,
//         }
//     );
// };
// export default ErrorHandler;
class ErrorHandler extends Error {
    constructor(message, statusCode) {   // ✅ correct order
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    console.log("🔥 ERROR DEBUG 👉", err); 

    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    // ✅ Duplicate key error
    if (err.code === 11000) {
        err = new ErrorHandler("Duplicate field value Entered.", 400);
    }

    // ✅ JWT Invalid
    if (err.name === "JsonWebTokenError") {
        err = new ErrorHandler("Json Web Token is Invalid. Try again", 400);
    }

    // ✅ JWT Expired
    if (err.name === "TokenExpiredError") {
        err = new ErrorHandler("Json Web Token is expired. Try again", 400);
    }

    // ✅ Cast Error (Invalid Mongo ID)
    if (err.name === "CastError") {
        err = new ErrorHandler(`Resource not found. Invalid: ${err.path}`, 400);
    }

    // ✅ Validation errors
    const errorMessage = err.errors
        ? Object.values(err.errors).map(e => e.message).join(" ")
        : err.message;

    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
};

export default ErrorHandler;