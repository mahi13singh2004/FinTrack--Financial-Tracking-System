import { body, param, query, validationResult } from 'express-validator'

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors.array()
        })
    }
    next()
}

export const validateCreateRecord = [
    body('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be greater than 0'),
    body('type')
        .isIn(['income', 'expense'])
        .withMessage('Type must be either income or expense'),
    body('category')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be between 1 and 50 characters')
        .matches(/^[a-zA-Z0-9\s-_]+$/)
        .withMessage('Category can only contain letters, numbers, spaces, hyphens and underscores'),
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be in valid ISO format'),
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes cannot exceed 500 characters')
        .escape(),
    handleValidationErrors
]

export const validateUpdateRecord = [
    param('id')
        .isMongoId()
        .withMessage('Invalid record ID'),
    body('amount')
        .optional()
        .isNumeric()
        .withMessage('Amount must be a number')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be greater than 0'),
    body('type')
        .optional()
        .isIn(['income', 'expense'])
        .withMessage('Type must be either income or expense'),
    body('category')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be between 1 and 50 characters')
        .matches(/^[a-zA-Z0-9\s-_]+$/)
        .withMessage('Category can only contain letters, numbers, spaces, hyphens and underscores'),
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be in valid ISO format'),
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes cannot exceed 500 characters')
        .escape(),
    handleValidationErrors
]

export const validateRecordId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid record ID'),
    handleValidationErrors
]

export const validateGetRecords = [
    query('type')
        .optional()
        .isIn(['income', 'expense'])
        .withMessage('Type must be either income or expense'),
    query('category')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Category cannot exceed 50 characters')
        .escape(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
]

export const validateCreateUser = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('role')
        .optional()
        .isIn(['viewer', 'analyst', 'admin'])
        .withMessage('Role must be viewer, analyst, or admin'),
    handleValidationErrors
]

export const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
]

export const validateUserId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid user ID'),
    handleValidationErrors
]

export const validateUpdateUserRole = [
    param('id')
        .isMongoId()
        .withMessage('Invalid user ID'),
    body('role')
        .isIn(['viewer', 'analyst', 'admin'])
        .withMessage('Role must be viewer, analyst, or admin'),
    handleValidationErrors
]