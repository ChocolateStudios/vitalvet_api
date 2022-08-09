import { validationResult, body, param } from "express-validator";
import Constants from "../constants/constants.js";
import { validationResultExpress } from "./validationCommon.js";

export const bodyRegisterValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be valid')
        .normalizeEmail(),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    validationResultExpress
]

export const bodyLoginValidator = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be valid')
        .normalizeEmail()
        .isLength({ max: Constants.ONE_LINE_SIZE })
        .withMessage(`Email must be at most ${Constants.ONE_LINE_SIZE} characters`),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    validationResultExpress
]

