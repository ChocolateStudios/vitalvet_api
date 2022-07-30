import { Router } from 'express';
import { body } from 'express-validator';
import { infoUser, login, register, refreshToken, logout } from '../controllers/auth.controller.js';
import { requireToken } from '../middlewares/requireToken.js';
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

router.get('/protected', requireToken, infoUser);

router.get('/refresh', refreshToken)

router.get('/logout', logout)

export default router;