//require ('dotenv').config({path: './env'}); //kaam esse v ho jayega but humara code import type module ko prefer kar rha hai esse consistency kharab hogi es liye hum essi line ko dusre tarike se import karege.
import dotenv from "dotenv";// but chalega nhi kyuki esko config v kaarna padega.
dotenv.config({
    path: './env'
}) //esko config karne ke baad hme package.json me jake dev script me -r wali line add karni padegi kyuki ye ek experimental feature hai.
import connectDB from "./db/index.js";


// Second Approch just below one line.
connectDB(); // hm direct esko import karke project ko run nhi kar sakte  ye ek common issue hai eske liye hum error ko sahi se padho kyuki db ke baad index aur extension lagana padta hai.














/*
// This is the first approach for connecting the databse in the index file.
import express from "express";
const app = express();
( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        app.on("Error",(error)=>{
            console.log("Error:", error)
            throw error;
        })
        app.listen("process.env.PORT",()=>{
            console.log(`app is listning on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error(error, "Error");
        throw err;
    }
} )()
*/