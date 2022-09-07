import { validationResult, body, param } from "express-validator";
import { validationResultExpress } from "./validationCommon.js";
import { Constants } from '../constants/constants.js';

export const bodyMedicalAttentionValidator = [
    body('weight')
        .trim()
        .notEmpty()
        .withMessage('Weight is required')
        .isFloat()
        .withMessage('Weight must be a float number'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: Constants.MULTILINE_SIZE })
        .withMessage(`Description must be at most ${Constants.MULTILINE_SIZE} characters`),
    body('date')
        .trim()
        .notEmpty()
        .withMessage('Date is required')
        .isDate()
        .withMessage('Date must be a date'),
    body('resultNotes')
        .trim()
        .notEmpty()
        .withMessage('Result notes are required')
        .isLength({ max: Constants.MULTILINE_SIZE })
        .withMessage(`Result notes must be at most ${Constants.MULTILINE_SIZE} characters`),
    body('patientId')
        .trim()
        .notEmpty()
        .withMessage('Patient id is required')
        .isInt()
        .withMessage('Patient id must be an integer'),
        validationResultExpress
]

export const paramsMedicalAttentionValidator = [
    param('medicalAttentionId')
    .trim()
    .notEmpty()
    .withMessage('Medical Attention id is required')
    .isInt()
    .withMessage('Medical Attention id must be an integer'),
    validationResultExpress
]