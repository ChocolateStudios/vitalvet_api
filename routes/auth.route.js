import { Router } from 'express';
import { login, register, refreshToken, logout, deleteAccount } from '../controllers/auth.controller.js';
import { requireRefreshToken } from '../middlewares/requireRefreshToken.js';
import { requireToken } from '../middlewares/requireToken.js';
import { bodyLoginValidator, bodyRegisterValidator } from '../middlewares/authValidatorManager.js';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *  post:
 *      summary: Register a new user
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          201:
 *              description: User created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/TokenResponse'
 */
router.post('/register', bodyRegisterValidator, register);



/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *      summary: Login a user
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: User logged in
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/TokenResponse'
 */
router.post('/login', bodyLoginValidator, login);



/**
 * @swagger
 * /api/v1/auth/refresh:
 *  get:
 *      summary: Refresh the token of logged in user
 *      tags: [User]
 *      responses:
 *          200:
 *              description: Token refreshed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/TokenResponse'
 */
router.get('/refresh', requireRefreshToken, refreshToken);



/**
 * @swagger
 * /api/v1/auth/logout:
 *  get:
 *      summary: Logout the logged in user
 *      tags: [User]
 *      responses:
 *          200:
 *              description: User logged out
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: "Logout successfully"
 * 
 */
router.get('/logout', logout);



/**
 * @swagger
 * /api/v1/auth/:
 *  delete:
 *      summary: Delete logged in user
 *      tags: [User]
 *      security:
 *          - BearerAuth: []
 *      responses:
 *          200:
 *              description: User deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: "Account deleted"
 * 
 */
router.delete('/', requireToken, deleteAccount);

export default router;