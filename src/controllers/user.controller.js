import {asyncHandler} from '../utils/asyncHandler.js';
import {apiError} from '../utils/apiError.js'
import {User} from '../models/user.model.js'
import {uploadCloudinary} from '../utils/cloudinary.js'
import { apiResponce } from '../utils/apiResponce.js';

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken; // yaha hum userModel me refreshToken field me token ki value add kar rhe hai.
        await user.save({ validateBeforeSave: false })// data ko save kar rhe hai., ab hm save method run kar rhe hai toh jitne required field hai wo sab kick in ho jayege
                    //aur password field v mangega. es liye hum validation ko off karege. {validateBeforeSave: false} use karke.
        
        return {accessToken, refreshToken} // yaha data ko hme user ko v return karna hia es liye.
    } catch (error) {
        throw new apiError(500, "Something Went wrong while generating Refresh and Access token.")
    }
}

const registerUser = asyncHandler( async (req, res)=>{ // ye hum method banaye hai aur ab ek route banayege kyuki ye method kab call hoga ye hamara route decide karega. Kyuki ek request toh aani chahiye.
    
    // Get data from frontend
    // Validate data e.g-> NO Blank data
    // Check user already Register or not
    // Check for image, Because Upload of Avatar 
    // Upload image on Cloudinary, get url of that image
    // chcek even imag eupload successfully on cloudinary or not.
    // create user Object (Because data save in mongodb in form of object) -> Create db in entry.
    // remove password and refresh token field from responce
    // checlk for user creation because something user did't create successfully.
    // return Responce otherwise return Error.

// Here we trying to get data from user(FRONTEND).......................................................................
    const {username,email,fullName,password} = req.body;
    // console.log("email",email)
    // if(fullname === ""){ // yaha pe hum ek input data ke liye check kar rhe hai, eska second approch use kar rhe hai niche.
    //     throw new apiError(400, "Fullname is required")
    // }
// yaha hum validate kr rhe hai ki input data blank na ho...............................................................
    if(
        [username, email, fullName, password].some((field)=> field?.trim() === "")
    ){
        throw new apiError(400, "all field are required");
    }
// yaha hum check kar rhe hai ki User Already exist na ho...............................................................
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if(existedUser){
        throw new apiError(409, "Already Exist with this Username or Email");
    }

    // yaha hum file handling dekhege e.g-> Avatar uploading................................................................
    // req.files hme middleware ({express multer} ke throught access mila hai.) jaisa req.body hota hai waisa hi middleware extra feature add kr dete hai.
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && (req.files.coverImage.length > 0)){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    if (!avatarLocalPath) {
        throw new apiError(400, "Profile Picture is required");
    }

    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new apiError(400, "Profile Picture is required");
    }
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url||"",
        username: username.toLowerCase(),
        email,
        password,

    })


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) {
        throw new apiError(500, "Server Internal Error While Registering User")
    }

    return res.status(201).json(
        new apiResponce(200, createdUser, "User registered Successfully")
    )
})

const loginUser = asyncHandler(async (req,res)=>{
    // take data from frontend...................(email & password)
    // check username || email from data base
    // verify password
    // generate Access token and Refresh token
    // send cookies

    const {email, username, password} = req.body
    if(!email || !username){
        throw new apiError(400, "Username or Email is required");
    }
    const user = User.findOne({
        $or: [{username}, {email}]
    }) 
    if(!user){
        throw new apiError(404, "User not Exist");
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new apiError(401, "Wrong Password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id) // ab yaha pe destructure krkr hm accessToken and RefreshToken dono le lenge.

    const loggedInUser = await User.findOne(user._id) // yaha hum 107 line ko firse database call kar rhe hai.
    .select("-password -refreshToken") // select kr rhe hai kon kon si field hme user ko nhi bheji hai
    
    // cookies send karne se phle kuch option design krna padta hai.
    const options = {
        httpOnly: true,
        secure: true 
        // ye dono ko true karne se hm esse ye cookies keval server se modify ho sakta hai aisa normally modify ni ho sakta.
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
        // yaha hum cookies se v tokens ko save kar rhe hai but sometimes user esko local machine pe save karvata hai es liye ya fir app development karta hai to waha pe cookies save ni hogi es liye hum esko aisa bhej rhe hai.
    .json(
        new apiResponce(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User LoggedIn Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined,
            }
        },
        {
            new: true,
        }
    )
    const options = {
        httpOnly: true,
        secure: true 
        // ye dono ko true karne se hm esse ye cookies keval server se modify ho sakta hai aisa normally modify ni ho sakta.
    }
    return res
    .status(200)
    .clearCookie("AccessToken", accessToken, options)
    .clearCookie("RefreshToken", refreshToken, options)
    .json(new apiResponce(200, {}, "User Logout"))
})
export {
    registerUser,
    loginUser,
    logoutUser
};