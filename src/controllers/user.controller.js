import {asyncHandler} from '../utils/asyncHandler.js';

const registerUser = asyncHandler( async (req, res)=>{ // ye hum method banaye hai aur ab ek route banayege kyuki ye method kab call hoga ye hamara route decide karega. Kyuki ek request toh aani chahiye.
    res.status(200).json({
        message: "Ok"
    })
})

export {registerUser};