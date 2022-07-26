import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { body } from 'express-validator';
import { validationResultExpress } from '../middlewares/validationResultExpress.js';
const router = express.Router();

router.post(
    '/register',
    [
        body('email', 'Email must be valid')
            .trim()
            .isEmail()
            .normalizeEmail(),
        body('password', 'Password must be at least 6 characters')
            .trim()
            .isLength({ min: 6 })
    ],
    validationResultExpress,
    register
);

router.post(
    '/login',
    [
        body('email', 'Email must be valid')
            .trim()
            .isEmail()
            .normalizeEmail(),
        body('password', 'Password must be at least 6 characters')
            .trim()
            .isLength({ min: 6 })
    ],
    validationResultExpress,
    login
);

export default router;