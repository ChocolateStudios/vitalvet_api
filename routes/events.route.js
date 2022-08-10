import { Router } from 'express';
import { createEvent } from '../controllers/events.controller.js';
import { requireToken } from '../middlewares/requireToken.js';

const router = Router();

/**
 * @swagger
 * /api/v1/events:
 *  post:
 *      summary: Register a new event
 *      tags: [Events]
 *      security:
 *          - BearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/EventSubmission'
 *      responses:
 *          201:
 *              description: Event created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Event'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */            
 router.post('/', requireToken, createEvent);

export default router;