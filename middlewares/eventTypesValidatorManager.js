import { validationResult, body, param } from "express-validator";
import { validationResultExpress } from "./validationCommon.js";
import Constants from '../constants/constants.js';

export const bodyEventTypesValidator = [
    body('name', `Name must be at most ${Constants.ONE_LINE_SIZE} charaters`)
        .trim()
        .isLength({ max: Constants.ONE_LINE_SIZE }),
    body('color_type', `Name must be at most 8 charaters`)
        .trim()
        .isLength({ max: 8 }),
    validationResultExpress
]