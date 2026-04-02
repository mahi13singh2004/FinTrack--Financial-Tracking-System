import express from "express"
import protectRoute from "../middlewares/auth.middleware.js"
const router = express.Router()
import { createRecord, getRecords, updateRecord, deleteRecord, getSummary, getCategoryBreakdown, getMonthlyTrend, getRecentActivity, getWeeklyTrends } from "../controllers/record.controller.js"
import authorize from "../middlewares/role.middleware.js"
import { validateCreateRecord, validateUpdateRecord, validateRecordId, validateGetRecords } from "../middlewares/validation.middleware.js"

router.post("/", protectRoute, authorize(["admin"]), validateCreateRecord, createRecord)
router.get("/", protectRoute, authorize(["admin", "analyst"]), validateGetRecords, getRecords)
router.put("/:id", protectRoute, authorize(["admin"]), validateUpdateRecord, updateRecord)
router.delete("/:id", protectRoute, authorize(["admin"]), validateRecordId, deleteRecord)
router.get("/summary", protectRoute, authorize(["admin", "analyst"]), getSummary)
router.get("/category-breakdown", protectRoute, authorize(["admin", "analyst"]), getCategoryBreakdown)
router.get("/trends", protectRoute, authorize(["admin", "analyst"]), getMonthlyTrend)
router.get("/recent-activity", protectRoute, authorize(["admin", "analyst", "viewer"]), getRecentActivity)
router.get("/weekly-trends", protectRoute, authorize(["admin", "analyst"]), getWeeklyTrends)

export default router