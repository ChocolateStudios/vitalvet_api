import { validationResult, body, param } from "express-validator";
import { validationResultExpress } from "./validationCommon.js";
import { Constants } from '../constants/constants.js';

export const bodyPatientValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: Constants.ONE_LINE_SIZE })
        .withMessage(`Name must be at most ${Constants.ONE_LINE_SIZE} characters`),
    body('weight')
        .trim()
        .notEmpty()
        .withMessage('Weight is required')
        .isFloat()
        .withMessage('Weight must be a float number'),
    body('birthday')
        .trim()
        .notEmpty()
        .withMessage('Birthday is required')
        .isDate()
        .withMessage('Birthday must be a date'),
    body('dayOfDeath')
        .trim()
        .notEmpty()
        .withMessage('Day of death is required')
        .isDate()
        .withMessage('Day of death must be a date'),
    body('mainPicture')
        .if(body('mainPicture').exists())
        .trim()
        .notEmpty()
        .withMessage('Main picture is required')
        .isURL()
        .withMessage('Main picture must be a url')
        .isLength({ max: Constants.LINK_SIZE })
        .withMessage(`Main picture must be at most ${Constants.LINK_SIZE} characters`),
    body('subspeciesId')
        .trim()
        .notEmpty()
        .withMessage('Species id is required')
        .isInt()
        .withMessage('Species id must be an integer'),
    body('ownerId')
        .trim()
        .notEmpty()
        .withMessage('Owner id is required')
        .isInt()
        .withMessage('Owner id must be an integer'),
    validationResultExpress
]

export const paramsPatientValidator = [
    param('patientId')
        .trim()
        .notEmpty()
        .withMessage('Patient id is required')
        .isInt()
        .withMessage('Patient id must be an integer'),
    validationResultExpress
]