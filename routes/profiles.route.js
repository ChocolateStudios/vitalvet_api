import { Router } from 'express';
import { createProfile, deleteProfile, getAllProfilesIfAdmin, getProfile, updateProfile } from '../controllers/profiles.controller.js';
import { bodyProfileValidator } from '../middlewares/profileValidatorManager.js';
import { requireToken } from '../middlewares/requireToken.js';

const router = Router();

/**
 * @swagger
 * /api/v1/profiles:
 *  post:
 *      summary: Register profile of logged in user
 *      tags: [Profiles]
 *      security:
 *          - BearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/ProfileSubmission'
 *      responses:
 *          201:
 *              description: Profile created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Profile'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', requireToken, bodyProfileValidator, createProfile);


/**
 * @swagger
 * /api/v1/profiles:
 *  put:
 *      summary: Update profile of logged in user
 *      tags: [Profiles]
 *      security:
 *          - BearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/ProfileSubmission'
 *      responses:
 *          200:
 *              description: Profile updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Profile'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/', requireToken, bodyProfileValidator, updateProfile);


/**
 * @swagger
 * /api/v1/profiles:
 *  delete:
 *      summary: Delete profile of logged in user
 *      tags: [Profiles]
 *      security:
 *          - BearerAuth: []
 *      responses:
 *          200:
 *              description: Profile deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Profile'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/', requireToken, deleteProfile);


/**
 * @swagger
 * /api/v1/profiles:
 *  get:
 *      summary: Get profile of logged in user
 *      tags: [Profiles]
 *      security:
 *          - BearerAuth: []
 *      responses:
 *          200:
 *              description: Profile returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Profile'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', requireToken, getProfile);


/**
 * @swagger
 * /api/v1/profiles/all:
 *  get:
 *      summary: Get all profiles if logged in user is admin
 *      tags: [Profiles]
 *      security:
 *          - BearerAuth: []
 *      responses:
 *          200:
 *              description: Profiles returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Profile'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/all', requireToken, getAllProfilesIfAdmin);

export default router;