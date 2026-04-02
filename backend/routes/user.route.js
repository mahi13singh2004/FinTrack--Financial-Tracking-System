import express from "express"
import protectRoute from "../middlewares/auth.middleware.js"
import authorize from "../middlewares/role.middleware.js"
import { changeStatus, createUser, deleteUser, getAllUsers, GetUserById, updateUserRole } from "../controllers/user.controller.js"
const router=express.Router()

router.post("/",protectRoute,authorize(["admin"]),createUser)
router.get("/",protectRoute,authorize(["admin"]),getAllUsers)
router.get("/:id",protectRoute,authorize(["admin"]),GetUserById)
router.put("/:id/role",protectRoute,authorize(["admin"]),updateUserRole)
router.put("/:id/status",protectRoute,authorize(["admin"]),changeStatus)
router.delete("/:id",protectRoute,authorize(["admin"]),deleteUser)

export default router