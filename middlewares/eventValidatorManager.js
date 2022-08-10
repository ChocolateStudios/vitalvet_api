import { validationResult, body, param } from "express-validator";
import { validationResultExpress } from "./validationCommon.js";
import Constants from '../constants/constants.js';

export const bodyEventValidator = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: Constants.ONE_LINE_SIZE })
        .withMessage(`Title must be at most ${Constants.ONE_LINE_SIZE} charaters`),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: Constants.MULTILINE_SIZE })
        .withMessage(`Description must be at most ${Constants.MULTILINE_SIZE} charaters`),
    body('startTime')
        .trim()
        .notEmpty()
        .withMessage('Start time is required')
        .isDate()
        .withMessage('Start time must be a date time'),
    body('endTime')
        .if(body('endTime').exists())
        .trim()
        .notEmpty()
        .withMessage('End time is required')
        .isDate()
        .withMessage('End time must be a date time'),
    body('patientId')
        .trim()
        .notEmpty()
        .withMessage('Patient id is required')
        .isInt()
        .withMessage('Patient id must be an integer'),
    body('profileId')
        .trim()
        .notEmpty()
        .withMessage('Profile id is required')
        .isInt()
        .withMessage('Profile id must be an integer'),
    body('eventTypeId')
        .trim()
        .notEmpty()
        .withMessage('Event type id is required')
        .isInt()
        .withMessage('Event type id must be an integer'),
    validationResultExpress        
]