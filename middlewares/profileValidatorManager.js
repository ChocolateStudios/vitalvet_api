import { validationResult, body, param } from "express-validator";
import { validationResultExpress } from "./validationCommon.js";
import { Constants } from '../constants/constants.js';

export const bodyProfileValidator = [
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
    body('picture')
        .if(body('picture').exists())
        .trim()
        .notEmpty()
        .withMessage('Picture is required')
        .isURL()
        .withMessage('Picture must be a url')
        .isLength({ max: Constants.LINK_SIZE })
        .withMessage(`Picture must be at most ${Constants.LINK_SIZE} characters`),
    body('admin')
        .if(body('admin').exists())
        .trim()
        .isBoolean()
        .withMessage('Admin must be a boolean'),
    body('college')
        .trim()
        .notEmpty()
        .withMessage('College is required')
        .isLength({ max: Constants.ONE_LINE_SIZE })
        .withMessage(`College must be at most ${Constants.ONE_LINE_SIZE} characters`),
    body('review')
        .trim()
        .notEmpty()
        .withMessage('Review is required')
        .isLength({ max: Constants.MULTILINE_SIZE })
        .withMessage(`Review must be at most ${Constants.MULTILINE_SIZE} characters`),
    validationResultExpress
]