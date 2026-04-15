import { app } from "./app.js";

const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT,()=>{
    console.log(`server is running at port number ${process.env.PORT}`);
})