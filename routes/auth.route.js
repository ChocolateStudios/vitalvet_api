import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/auth.controller.js';
import { validationResultExpress } from '../middlewares/validationResultExpress.js';

const router = Router();

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