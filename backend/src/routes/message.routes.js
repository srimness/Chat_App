import express  from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getUsersforSidebar, getMessages, sendMessages } from "../controllers/message.controller.js";
const router = express.Router();


router.get('/users', protectRoute, getUsersforSidebar)
router.get('/:_id', protectRoute, getMessages)

router.post('/send/:id', protectRoute, sendMessages)

export default router