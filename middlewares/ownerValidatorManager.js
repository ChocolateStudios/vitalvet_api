import { validationResult, body, param } from "express-validator";
import { validationResultExpress } from "./validationCommon.js";
import Constants from '../constants/constants.js';

export const bodyOwnerValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: Constants.ONE_LINE_SIZE })
        .withMessage(`Name must be at most ${Constants.ONE_LINE_SIZE} characters`),
    body('lastname')
        .trim()
        .notEmpty()
        .withMessage('Lastname is required')
        .isLength({ max: Constants.ONE_LINE_SIZE })
        .withMessage(`Lastname must be at most ${Constants.ONE_LINE_SIZE} characters`),
    body('birthday')
        .trim()
        .notEmpty()
        .withMessage('Birthday is required')
        .isDate()
        .withMessage('Birthday must be a date'),
    body('direction')
        .trim()
        .notEmpty()
        .withMessage('Direction is required')
        .isLength({ max: Constants.ONE_LINE_SIZE })
        .withMessage(`Direction must be at most ${Constants.ONE_LINE_SIZE} characters`),
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone is required')
        .isLength({ max: 15 })
        .withMessage(`Direction must be at most 15 characters`),
    body('dni')
        .if(body('dni').exists())
        .trim()
        .notEmpty()
        .withMessage('Dni is required')
        .isNumeric()
        .withMessage('Dni must be only numbers')
        .isLength({ max: 15 })
        .withMessage(`Dni must be at most 15 characters`),
    body('email')
        .if(body('email').exists())
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be a valid email')
        .normalizeEmail()
        .isLength({ max: Constants.ONE_LINE_SIZE })
        .withMessage(`Email must be at most ${Constants.ONE_LINE_SIZE} characters`),
    validationResultExpress
]

export const paramsOwnerValidator = [
    param('ownerId')
        .trim()
        .notEmpty()
        .withMessage('Owner id is required')
        .isInt()
        .withMessage('Owner id must be an integer'),
    validationResultExpress
]