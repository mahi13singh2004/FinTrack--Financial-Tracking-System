import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { generateTokens } from "../utils/generateTokenAndSetCookie.js"

const protectRoute = async (req, res, next) => {
    try {
        let accessToken = req.cookies.accessToken
        const refreshToken = req.cookies.refreshToken

        if (!accessToken && !refreshToken) {
            return res.status(401).json({ message: "Unauthorised, no token" })
        }

        let decoded
        let tokenRefreshed = false

        try {
            decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
        } catch (error) {
            if (error.name === 'TokenExpiredError' && refreshToken) {
                try {
                    const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(refreshDecoded.id)
                    const isProduction = process.env.NODE_ENV === 'production'

                    res.cookie("accessToken", newAccessToken, {
                        httpOnly: true,
                        secure: isProduction,
                        sameSite: isProduction ? "none" : "strict",
                        maxAge: 15 * 60 * 1000
                    })

                    res.cookie("refreshToken", newRefreshToken, {
                        httpOnly: true,
                        secure: isProduction,
                        sameSite: isProduction ? "none" : "strict",
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    })

                    decoded = jwt.verify(newAccessToken, process.env.JWT_SECRET)
                    tokenRefreshed = true
                } catch (refreshError) {
                    res.clearCookie("accessToken")
                    res.clearCookie("refreshToken")
                    return res.status(401).json({ message: "Invalid refresh token" })
                }
            } else {
                return res.status(401).json({ message: "Invalid access token" })
            }
        }

        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }
        if (!user.isActive) {
            return res.status(401).json({ message: "Account is inactive" })
        }

        req.user = user
        req.tokenRefreshed = tokenRefreshed
        next()
    }
    catch (error) {
        console.log("Auth middleware error", error.message)
        return res.status(401).json({ message: "Authentication failed" })
    }
}

export default protectRoute
