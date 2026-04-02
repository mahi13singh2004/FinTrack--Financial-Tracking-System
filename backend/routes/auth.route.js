import express from "express"
import { login, signup, logout, checkAuth, refreshToken } from "../controllers/auth.controller.js"
const router = express.Router()
import protectRoute from "../middlewares/auth.middleware.js"
import { validateCreateUser, validateLogin } from "../middlewares/validation.middleware.js"
import { authLimiter, strictLimiter } from "../middlewares/rateLimit.middleware.js"

router.post("/signup", authLimiter, validateCreateUser, signup)
router.post("/login", authLimiter, validateLogin, login)
router.post("/logout", logout)
router.get("/checkAuth", protectRoute, checkAuth)
router.post("/refresh", strictLimiter, refreshToken)

export default router
