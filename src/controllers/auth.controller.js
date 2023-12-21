import {User} from '../models/user.model.js';
import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { generateAccessAndRefreshToken } from '../utils/generateAccessTokenAndRefreshToken.js';
import {option} from '../utils/cookieOption.js';


const registerUser = asyncHandler(async(req, res)=> {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        throw new ApiError(400, 'All fields are required');
    }

    const isUserExist = await User.findOne({email});
    if(isUserExist) {
        throw new ApiError(409, 'User already exist');
    }

    const user = await User.create({name, email, password});
    
    const createdUser = await User.findById(user._id).select('-password');

    return res.status(201)
    .json(new ApiResponse(200, createdUser, 'User register successfull'));


})


const loginUser = asyncHandler(async(req, res)=> {
      const {email, password} = req.body;

      if(!email || !password) {
        throw new ApiError(400, 'Both fields are required');
      }

      const user = await User.findOne({email});

      if(!user) {
        throw new ApiError(404, 'User does not exist');
      }

      const isPasswordCorrect = await user.isPasswordCorrect(password);

      if(!isPasswordCorrect) {
        throw new ApiError(401, 'Invalid Credential');
      }

      const loginUser = await User.findById(user._id).select('-password -refreshToken');
      const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

      return res.status(200)
      .cookie('accessToken', accessToken, option)
      .cookie('refreshToken', refreshToken, option)
      .json(new ApiResponse(200, {loginUser, accessToken, refreshToken}, 'User login sucessfully'));

})


const logoutUser = asyncHandler(async(req, res)=> {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set:{refreshToken:undefined}
      },
      {new:true}
    )

    return res.status(200)
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json(new ApiResponse(200, {}, 'User logout successfully'));

})



export {
    registerUser,
    loginUser,
    logoutUser
}




