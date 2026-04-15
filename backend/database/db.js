import mongoose from "mongoose";
export const connectDB=() =>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"libraryDB",
    }).then(()=>{
    console.log(`Database connected succesfully.`);

    }).catch(err=>{
        console.log('Error conecting to database',err);
    });
}