import jwt from "jsonwebtoken"

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "15m"
    })

    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d"
    })

    return { accessToken, refreshToken }
}

const generateTokenAndSetCookie = (res, userId) => {
    const { accessToken, refreshToken } = generateTokens(userId)
    const isProduction = process.env.NODE_ENV === 'production'

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
        maxAge: 15 * 60 * 1000
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return { accessToken, refreshToken }
}

export default generateTokenAndSetCookie
export { generateTokens }