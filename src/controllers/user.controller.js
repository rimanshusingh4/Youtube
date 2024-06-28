import {asyncHandler} from '../utils/asyncHandler.js';
import {apiError} from '../utils/apiError.js'
import {User} from '../models/user.model.js'
import {uploadCloudinary} from '../utils/cloudinary.js'
import { apiResponce } from '../utils/apiResponce.js';



const registerUser = asyncHandler( async (req, res)=>{ // ye hum method banaye hai aur ab ek route banayege kyuki ye method kab call hoga ye hamara route decide karega. Kyuki ek request toh aani chahiye.
    res.status(200).json({
        message: "Ok"
    })
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
    const {username,email,fullname,password} = req.body;
    console.log("email",email)
    // if(fullname === ""){ // yaha pe hum ek input data ke liye check kar rhe hai, eska second approch use kar rhe hai niche.
    //     throw new apiError(400, "Fullname is required")
    // }
// yaha hum validate kr rhe hai ki input data blank na ho...............................................................
    if(
        [username, email, fullname, password].some((field)=> field?.trim() === "")
    ){
        throw new apiError(400, "all field are required");
    }
// yaha hum check kar rhe hai ki User Already exist na ho...............................................................
    const existedUser = User.findOne({
        $or: [{ email }, { username }]
    })
    if(existedUser){
        throw new apiError(409, "Already Exist with this Username or Email");
    }

    
    // yaha hum file handling dekhege e.g-> Avatar uploading................................................................
    // req.files hme middleware ({express multer} ke throught access mila hai.) jaisa req.body hota hai waisa hi middleware extra feature add kr dete hai.
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if (!avatarLocalPath) {
        throw new apiError(400, "Profile Picture is required");
    }
    console.log(avatarLocalPath);

    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new apiError(400, "Profile Picture is required");
    }
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url||"",
        username: username.toLowerCase(),
        email,
        password,

    })


    const createdUer = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUer) {
        throw new apiError(500, "Server Internal Error While Registering User")
    }

    return res.status(201).json(
        new apiResponce(200)
    )
})
export {registerUser};