import { Router } from 'express';
import { createProfile } from '../controllers/profiles.controller.js';
import { bodyProfileValidator } from '../middlewares/profileValidatorManager.js';

const router = Router();

/**
 * @swagger
 * /api/v1/profiles:
 *  post:
 *      summary: Register a new profile
 *      tags: [Profiles]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Profile'
 *      responses:
 *          201:
 *              description: Profile created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Profile'
 */
router.post('/', bodyProfileValidator, createProfile);

export default router;