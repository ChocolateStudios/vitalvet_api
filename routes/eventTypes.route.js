import { Router } from "express";
import { createEventType, deleteEventType, getAllEventTypes, updateEventType } from "../controllers/eventTypes.controller.js";
import { bodyEventTypeValidator, paramEventTypeValidator } from "../middlewares/eventTypeValidatorManager.js";

const router = Router();

/**
 * @swagger
 * /api/v1/eventTypes:
 *  post:
 *      summary: Register a new event type
 *      tags: [EventTypes]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/EventTypeSubmission'
 *      responses:
 *          201:
 *              description: EventType created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/EventTypeResponse'
 */
 router.post('/', bodyEventTypeValidator, createEventType);

 /**
 * @swagger
 * /api/v1/eventTypes/{eventTypeId}:
 *  put:
 *      summary: Update an event type
 *      tags: [EventTypes]
 *      parameters:
 *          - in: path
 *            name: eventTypeId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the event type
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/EventTypeSubmission'
 *      responses:
 *          200:
 *              description: EventType created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/EventTypeResponse'
 */
  router.put('/:eventTypeId', paramEventTypeValidator, bodyEventTypeValidator, updateEventType);

 /**
 * @swagger
 * /api/v1/eventTypes/{eventTypeId}:
 *  delete:
 *      summary: Delete an event type
 *      tags: [EventTypes]
 *      parameters:
 *          - in: path
 *            name: eventTypeId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the event type
 *      responses:
 *          200:
 *              description: EventType deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/EventTypeResponse'
 */
  router.delete('/:eventTypeId', deleteEventType);

/**
 * @swagger
 * /api/v1/eventTypes:
 *  get:
 *      summary: Get all event types
 *      tags: [EventTypes]
 *      responses:
 *          200:
 *              description: EventTypes returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/EventTypeListResponse'
 */
 router.get('/', getAllEventTypes);

 export default router;