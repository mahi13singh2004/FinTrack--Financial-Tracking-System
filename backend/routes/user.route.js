import express from "express"
import protectRoute from "../middlewares/auth.middleware.js"
import authorize from "../middlewares/role.middleware.js"
import { createUser, getAllUsers, getUserById, updateUserRole, toggleUserStatus, deleteUser } from "../controllers/user.controller.js"
import { validateCreateUser, validateUserId, validateUpdateUserRole } from "../middlewares/validation.middleware.js"
const router = express.Router()

router.post("/", protectRoute, authorize(["admin"]), validateCreateUser, createUser)
router.get("/", protectRoute, authorize(["admin"]), getAllUsers)
router.get("/:id", protectRoute, authorize(["admin"]), validateUserId, getUserById)
router.put("/:id/role", protectRoute, authorize(["admin"]), validateUpdateUserRole, updateUserRole)
router.put("/:id/status", protectRoute, authorize(["admin"]), validateUserId, toggleUserStatus)
router.delete("/:id", protectRoute, authorize(["admin"]), validateUserId, deleteUser)

export default router