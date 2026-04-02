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

app.use("/api/auth", authRoutes)
app.use("/api/user", apiLimiter, userRoutes)
app.use("/api/record", apiLimiter, recordRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    connectDB()
    console.log(`Server is running on ${PORT}`)
})
