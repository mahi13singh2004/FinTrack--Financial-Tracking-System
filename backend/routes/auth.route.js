import express from "express"
import { login, signup, logout, checkAuth } from "../controllers/auth.controller.js"
const router = express.Router()
import protectRoute from "../middlewares/auth.middleware.js"
import { validateCreateUser, validateLogin } from "../middlewares/validation.middleware.js"


router.post("/signup", validateCreateUser, signup)
router.post("/login", validateLogin, login)
router.post("/logout", logout)
router.get("/checkAuth", protectRoute, checkAuth)

export default router