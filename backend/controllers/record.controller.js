import Record from "../models/record.model.js"

export const createRecord = async (req, res) => {
    try {
        const { amount, type, category, date, notes } = req.body
        if (!amount || !type || !category) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const record = await Record.create({
            userId: req.user._id,
            amount,
            type,
            category,
            date,
            notes
        })

        return res.status(201).json({
            message: "Record created successfully",
            record
        })
    }
    catch (error) {
        console.log("Error in backend createRecord controller", error.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getRecords = async (req, res) => {
    try {
        const { type, category } = req.query

        let filter = { userId: req.user._id }

        if (type) filter.type = type
        if (category) filter.category = category

        const records = await Record.find(filter).sort({ createdAt: -1 })

        return res.status(200).json({
            message: "Records fetched sucessfully",
            records
        })
    }
    catch (error) {
        console.log("Error in backend getRecord controller", error.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const deleteRecord = async (req, res) => {
    try {
        const record = await Record.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
        if (!record) {
            return res.status(404).json({ message: "Record not found" })
        }
        return res.status(200).json({ message: "Record deleted sucessfully" })
    }
    catch (error) {
        console.log("Error in backend deleteRecord controller", error.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const updateRecord = async (req, res) => {
    try {
        const record = await Record.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        )

        if (!record) {
            return res.status(404).json({ message: "Record not found" })
        }

        return res.status(200).json({
            message: "Record updated",
            record
        })
    }
    catch (error) {
        console.log("Error in backend updateRecord controller", error.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getSummary = async (req, res) => {
    try {
        const records = await Record.find({ userId: req.user._id })
        let income = 0
        let expense = 0

        records.forEach((r) => {
            if (r.type === "income") income += r.amount
            else expense += r.amount
        })

        return res.status(200).json({
            message: "Summary formed",
            totalIncome: income,
            totalExpense: expense,
            netBalance: income - expense
        })
    }
    catch (error) {
        console.log("Error in backend getSummary controller", error.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getCategoryBreakdown = async (req, res) => {
    try {
        const records = await Record.find({ userId: req.user._id })
        const result = {}
        records.forEach((r) => {
            if (!result[r.category]) result[r.category] = 0
            else result[r.category] += r.amount
        })

        return res.status(200).json({
            message: "Breakdown achieved",
            result
        })
    }
    catch (error) {
        console.log("Error in backend getCategoryBreakdown controller", error.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getMonthlyTrend = async (req, res) => {
    try {
        const records = await Record.find({ userId: req.user._id })
        const trends = {}
        records.forEach((r) => {
            const month = r.date.toISOString().slice(0, 7);
            if (!trends[month]) trends[month] = 0
            trends[month] += r.amount
        })

        return res.status(200).json({
            message: "Monthly trends recieved",
            trends
        })
    }
    catch (error) {
        console.log("Error in backend getMonthlyTrend controller", error.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getRecentActivity = async (req, res) => {
    try {
        const { limit = 10 } = req.query

        const recentRecords = await Record.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .select('amount type category date notes createdAt')

        const activitySummary = {
            totalRecords: recentRecords.length,
            recentIncome: recentRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0),
            recentExpenses: recentRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0)
        }

        return res.status(200).json({
            message: "Recent activity fetched successfully",
            recentRecords,
            summary: activitySummary
        })
    }
    catch (error) {
        console.log("Error in getRecentActivity controller", error.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getWeeklyTrends = async (req, res) => {
    try {
        const records = await Record.find({ userId: req.user._id })
        const weeklyTrends = {}

        records.forEach((r) => {
            const date = new Date(r.date)
            const year = date.getFullYear()
            const week = getWeekNumber(date)
            const weekKey = `${year}-W${week.toString().padStart(2, '0')}`

            if (!weeklyTrends[weekKey]) {
                weeklyTrends[weekKey] = {
                    income: 0,
                    expense: 0,
                    total: 0,
                    count: 0
                }
            }

            if (r.type === 'income') {
                weeklyTrends[weekKey].income += r.amount
            } else {
                weeklyTrends[weekKey].expense += r.amount
            }

            weeklyTrends[weekKey].total += r.amount
            weeklyTrends[weekKey].count += 1
        })

        const sortedWeeks = Object.keys(weeklyTrends).sort().reduce((acc, key) => {
            acc[key] = weeklyTrends[key]
            return acc
        }, {})

        return res.status(200).json({
            message: "Weekly trends received",
            weeklyTrends: sortedWeeks
        })
    }
    catch (error) {
        console.log("Error in getWeeklyTrends controller", error.message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}