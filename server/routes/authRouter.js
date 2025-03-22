import express from "express";
import {forgotPassword, getUser, login, logout, register, resetPassword, updatePassword, verifyOTP} from "../controllers/authController.js"
const router = express.Router();
import { isAuthenticated } from "../middlewares/authMiddleware.js";

router.post("/register",register);
router.post("/verify-otp",verifyOTP)
router.post("/login",login);
router.get("/logout",isAuthenticated,logout)
router.get("/me",isAuthenticated,getUser);
router.post("/password/forgot",forgotPassword);
router.put("/password/reset/:token",resetPassword);
router.put("/password/update",isAuthenticated,updatePassword);
export default router;