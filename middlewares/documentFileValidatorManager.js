import { validationResult, body, param } from "express-validator";
import { validationResultExpress } from "./validationCommon.js";
import { Constants } from '../constants/constants.js';

export const bodyDocumentFileValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: Constants.ONE_LINE_SIZE })
        .withMessage(`Name must be at most ${Constants.ONE_LINE_SIZE} characters`),
    body('link')
        .trim()
        .notEmpty()
        .withMessage('Link is required')
        .isURL()
        .withMessage('Link must be a url')
        .isLength({ max: Constants.LINK_SIZE })
        .withMessage(`Link must be at most ${Constants.LINK_SIZE} characters`),
    body('type')
        .trim()
        .notEmpty()
        .withMessage('Type is required')
        .isIn(Object.values(Constants.DOCUMENT_TYPES))
        .withMessage('Type must be one of the following: ' + Object.values(Constants.DOCUMENT_TYPES).join(', ')),
    validationResultExpress
]

export const paramsPatientDocumentFileValidator = [
    param('patientId')
        .trim()
        .notEmpty()
        .withMessage('Patient id is required')
        .isInt()
        .withMessage('Patient id must be an integer'),
    validationResultExpress
]

export const paramsMedicalAttentionDocumentFileValidator = [
    param('medicalAttentionId')
        .trim()
        .notEmpty()
        .withMessage('Medical attention id is required')
        .isInt()
        .withMessage('Medical attention id must be an integer'),
    validationResultExpress
]