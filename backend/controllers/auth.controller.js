import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js"
import jwt from "jsonwebtoken"
import { generateTokens } from "../utils/generateTokenAndSetCookie.js"

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Enter all fields" })
        }
        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        generateTokenAndSetCookie(res, user._id)

        return res.status(201).json({
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    }
    catch (error) {
        console.log("Error in signup controller backend", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Enter all fields" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Signup First" })
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        generateTokenAndSetCookie(res, user._id)

        return res.status(200).json({
            message: "User login successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })
    }
    catch (error) {
        console.log("Error in login controller backend", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        return res.status(200).json({
            message: "Logged out successfully"
        })
    }
    catch (error) {
        console.log("Error in logout controller backend", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(401).json({ message: "Internal server error" })
        }

        const response = {
            message: "User is authenticated",
            user: {
                ...user._doc,
                password: undefined
            }
        }

        if (req.tokenRefreshed) {
            response.tokenRefreshed = true
        }

        return res.status(200).json(response)
    }
    catch (error) {
        console.log("Error in checkAuth controller backend", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" })
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        const user = await User.findById(decoded.id)

        if (!user || !user.isActive) {
            return res.status(401).json({ message: "Invalid refresh token" })
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id)

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "Token refreshed successfully"
        })
    }
    catch (error) {
        console.log("Error in refreshToken controller", error.message)
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        return res.status(401).json({ message: "Invalid refresh token" })
    }
}
