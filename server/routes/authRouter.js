import express from "express";
import {getUser, login, logout, register, verifyOTP} from "../controllers/authController.js"
const router = express.Router();
import { isAuthenticated } from "../middlewares/authMiddleware.js";

router.post("/register",register);
router.post("/verify-otp",verifyOTP)
router.post("/login",login);
router.get("/logout",isAuthenticated,logout)
router.get("/me",isAuthenticated,getUser);

export default router;