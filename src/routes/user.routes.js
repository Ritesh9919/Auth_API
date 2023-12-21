import express from 'express';

const router = express.Router();
import {registerUser, loginUser, logoutUser} from '../controllers/auth.controller.js';
import { varifyJwt } from '../middlewares/auth.middleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', varifyJwt, logoutUser )
export default router;
