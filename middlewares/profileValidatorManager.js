import { validationResult, body, param } from "express-validator";
import { validationResultExpress } from "./validationCommon.js";
import Constants from '../constants/constants.js';

export const bodyProfileValidator = [
    body('name', `Name must be at most ${Constants.ONE_LINE_SIZE} characters`)
        .trim()
        .isLength({ max: Constants.ONE_LINE_SIZE }),
    body('lastname', `Lastname must be at most ${Constants.ONE_LINE_SIZE} characters`)
        .trim()
        .isLength({ max: Constants.ONE_LINE_SIZE }),
    body('birthday', 'Birthday must be a date')
        .trim()
        .isDate(),
    body('picture', 'Picture must be a url')
        .trim()
        .isURL(),
    body('picture', `Picture must be at most ${Constants.LINK_SIZE} characters`)
        .isLength({ max: Constants.LINK_SIZE }),
    body('admin', 'Admin must be a boolean')
        .trim()
        .isBoolean(),
    body('user_id', 'User id must be an integer')
        .trim()
        .isInt(),
    validationResultExpress
]