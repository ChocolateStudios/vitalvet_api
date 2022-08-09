import { Router } from 'express';
import { createOwner } from '../controllers/owners.controller.js';

const router = Router();

/**
 * @swagger
 * /api/v1/owners:
 *  post:
 *      summary: Register a new owner
 *      tags: [Owners]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Owner'
 *      responses:
 *          201:
 *              description: Owner created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Owner'
 */
router.post('/', createOwner);

export default router;