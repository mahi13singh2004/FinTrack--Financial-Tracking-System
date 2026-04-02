import express from "express"
import { login, signup, logout, checkAuth } from "../controllers/auth.controller.js"
const router=express.Router()
import protectRoute from "../middlewares/auth.middleware.js"

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/checkAuth",protectRoute,checkAuth)

export default router