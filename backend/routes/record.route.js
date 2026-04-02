import express from "express"
import protectRoute from "../middlewares/auth.middleware.js"
const router=express.Router()
import {createRecord,getRecords,updateRecord,deleteRecord} from "../controllers/record.controller.js"
import authorize from "../middlewares/role.middleware.js"

router.post("/",protectRoute,authorize(["admin"]),createRecord)

router.get("/",protectRoute,authorize(["admin","analyst"]),getRecords)

router.put("/:id",protectRoute,authorize(["admin"]),updateRecord)

router.delete("/:id",protectRoute,authorize(["admin"]),deleteRecord)

export default router