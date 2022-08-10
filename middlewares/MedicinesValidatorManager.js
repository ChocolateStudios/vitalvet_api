import { validationResult, body, param } from "express-validator";
import { validationResultExpress } from "./validationCommon.js";
import Constants from '../constants/constants.js';

export const bodyMedicinesValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: Constants.ONE_LINE_SIZE })
        .withMessage(`Name must be at most ${Constants.ONE_LINE_SIZE} characters`),
    validationResultExpress
]