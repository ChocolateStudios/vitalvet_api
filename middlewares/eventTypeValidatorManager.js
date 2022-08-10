import { validationResult, body, param } from "express-validator";
import { validationResultExpress } from "./validationCommon.js";
import { Constants } from '../constants/constants.js';

export const bodyEventTypeValidator = [
    body('name',)
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: Constants.ONE_LINE_SIZE })
        .withMessage(`Name must be at most ${Constants.ONE_LINE_SIZE} charaters`),
    body('typeColor')
        .trim()
        .notEmpty()
        .withMessage('Type color is required')
        .isLength({ max: 8 })
        .withMessage(`Type color must be at most 8 charaters`),
    validationResultExpress
]

export const paramEventTypeValidator = [
    param('eventTypeId')
        .trim()
        .notEmpty()
        .withMessage('Event type id is required')
        .isInt()
        .withMessage(`Event type id must be an integer`),
    validationResultExpress
]