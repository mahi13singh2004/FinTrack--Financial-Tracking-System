import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js"
import recordRoutes from "./routes/record.route.js"
import userRoutes from "./routes/user.route.js"
import cookieParser from "cookie-parser";
import { generalLimiter, apiLimiter } from "./middlewares/rateLimit.middleware.js"

const app = express();
dotenv.config()

app.use(generalLimiter)
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Finance Dashboard API",
        status: "Server is running",
        version: "1.0.0",
        endpoints: {
            authentication: "/api/auth",
            users: "/api/user",
            records: "/api/record"
        },
        documentation: "https://github.com/mahi13singh2004/FinTrack--Financial-Tracking-System"
    })
})

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    })
})

app.use("/api/auth", authRoutes)
app.use("/api/user", apiLimiter, userRoutes)
app.use("/api/record", apiLimiter, recordRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on ${PORT}`)
})
