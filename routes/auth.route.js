import { Router } from 'express';
import { infoUser, login, register, refreshToken, logout } from '../controllers/auth.controller.js';
import { requireRefreshToken } from '../middlewares/requireRefreshToken.js';
import { requireToken } from '../middlewares/requireToken.js';
import { bodyLoginValidator, bodyRegisterValidator } from '../middlewares/validatorManager.js';

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      TokenResponse:
 *        type: object
 *        properties:
 *         token:
 *          type: string
 *         expiresIn:
 *          type: integer
 *        required:
 *          - token
 *          - expiresIn
 *        example:
 *          token: eyJhbGciOi1NiIsIVCJ9.aWQiOjlhdCI6Y1OTISwiZXhwIxNQ5fQ.RpvhB4XId-sVJ823lpjDe5AlE
 *          expiresIn: 900
 */



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



// /**
//  * 
//  */
// router.get('/protected', requireToken, infoUser);



/**
 * @swagger
 * /api/v1/auth/refresh:
 *  get:
 *      summary: Refresh a token
 *      tags: [User]
 *      security:
 *      - bearerAuth: []
 *      responses:
 *          200:
 *              description: Token refreshed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/TokenResponse'
 */
router.get('/refresh', requireRefreshToken, refreshToken)



/**
 * @swagger
 * /api/v1/auth/logout:
 *  get:
 *      summary: Logout a user
 *      tags: [User]
 *      security:
 *      - bearerAuth: []
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
router.get('/logout', logout)

export default router;