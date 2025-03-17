//route file contains all different endpoints regarding the Login/Signup/logout/authentication/profile update

import express from "express"; //.route in the file name is to easily identify that the file is from routes folder
import { login, signup, logout , updateProfile, checkAuth} from '../controllers/auth.controller.js'
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.put('/update-profile', protectRoute, updateProfile);

router.get('/check', protectRoute, checkAuth); // to verify the auth details if the user refreshes the page or timeouts.. 



export default router;
