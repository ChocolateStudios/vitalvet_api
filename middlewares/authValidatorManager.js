import { validationResult, body, param } from "express-validator";
import { validationResultExpress } from "./validationCommon.js";

export const bodyRegisterValidator = [
    body('email', 'Email must be valid')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', 'Password must be at least 6 characters')
        .trim()
        .isLength({ min: 6 }),
    validationResultExpress
]

export const bodyLoginValidator = [
    body('email', 'Email must be valid')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', 'Password must be at least 6 characters')
        .trim()
        .isLength({ min: 6 }),
    validationResultExpress
]

