import { Router } from "express";
import { createEventTypes } from "../controllers/eventTypes.controller";
import { bodyEventTypesValidator } from "../middlewares/eventTypesValidatorManager";

const router = Router();

/**
 * @swagger
 * /api/v1/eventTypes:
 *  post:
 *      summary: Register a new eventTypes:
 *      tags: [EventTypes]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/EventTypes'
 *      responses:
 *          201:
 *              description: EventTypes created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/EventTypes'
 */
 router.post('/eventTypes', bodyEventTypesValidator, createEventTypes);

 export default router;