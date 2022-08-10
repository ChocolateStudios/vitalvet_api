import { validationResult, body, param } from "express-validator";
import { validationResultExpress } from "./validationCommon.js";
import { Constants } from '../constants/constants.js';

export const bodySpeciesValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: Constants.ONE_LINE_SIZE })
        .withMessage(`Name must be at most ${Constants.ONE_LINE_SIZE} characters`),
    validationResultExpress
]

export const paramsSpeciesValidator = [
    param('speciesId')
        .trim()
        .notEmpty()
        .withMessage('Species id is required')
        .isInt()
        .withMessage('Species id must be an integer'),
    validationResultExpress
]

export const paramsSpeciesAndSubspeciesValidator = [
    param('speciesId')
        .trim()
        .notEmpty()
        .withMessage('Species id is required')
        .isInt()
        .withMessage('Species id must be an integer'),
    param('subspeciesId')
        .trim()
        .notEmpty()
        .withMessage('Subspecies id is required')
        .isInt()
        .withMessage('Subspecies id must be an integer'),
    validationResultExpress
]