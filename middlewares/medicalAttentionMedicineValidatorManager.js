import { validationResult, body, param } from "express-validator";
import { validationResultExpress } from "./validationCommon.js";
import { Constants } from '../constants/constants.js';

export const bodyMedicalAttentionMedicineValidator = [
    body('details')
        .trim()
        .notEmpty()
        .withMessage('Details is required')
        .isLength({ max: Constants.MULTILINE_SIZE })
        .withMessage(`Details must be at most ${Constants.MULTILINE_SIZE} characters`),
]

export const paramsWithMedicalAttentionValidator = [
    param('medicalAttentionId')
    .trim()
    .notEmpty()
    .withMessage('Medical Attention id is required')
    .isInt()
    .withMessage('Medical Attention id must be an integer'),
    validationResultExpress
]

export const paramsWithMedicineValidator = [
    param('medicineId')
    .trim()
    .notEmpty()
    .withMessage('Medicine id is required')
    .isInt()
    .withMessage('Medicine id must be an integer'),
    validationResultExpress
]