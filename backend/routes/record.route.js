import express from "express"
import protectRoute from "../middlewares/auth.middleware.js"
const router=express.Router()
import {createRecord,getRecords,updateRecord,deleteRecord, getSummary, getCategoryBreakdown, getMonthlyTrend} from "../controllers/record.controller.js"
import authorize from "../middlewares/role.middleware.js"

router.post("/",protectRoute,authorize(["admin"]),createRecord)

router.get("/",protectRoute,authorize(["admin","analyst"]),getRecords)

router.put("/:id",protectRoute,authorize(["admin"]),updateRecord)

router.delete("/:id",protectRoute,authorize(["admin"]),deleteRecord)

router.get("/summary",protectRoute,authorize(["admin","analyst"]),getSummary)

router.get("/getSummary",protectRoute,authorize(["admin","analyst"]),getCategoryBreakdown)

router.get("/trends",protectRoute,authorize(["admin","analyst"]),getMonthlyTrend)

export default router