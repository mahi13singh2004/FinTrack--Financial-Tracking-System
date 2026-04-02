import express from "express"
import protectRoute from "../middlewares/auth.middleware.js"
import authorize from "../middlewares/role.middleware.js"

const router=express.Router()

router.get("/admin",protectRoute,authorize(["admin"]),(req,res)=>{
    res.send("admin only")
})

router.get("/analytics",protectRoute,authorize(["admin,analyst"]),(req,res)=>{
    res.send("analytics only")
})

router.get("/admin",protectRoute,(req,res)=>{
    res.send("All users")
})

export default router