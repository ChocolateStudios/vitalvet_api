import { Router } from 'express';
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from '../controllers/events.controller.js';
import { bodyEventValidator, paramsEventValidator } from '../middlewares/eventValidatorManager.js';
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
 *                          $ref: '#/components/schemas/EventResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */            
 router.post('/', requireToken, bodyEventValidator, createEvent);

 /**
  * @swagger
  * /api/v1/events/{eventId}:
  *  put:
  *      summary: Update an event
  *      tags: [Events]
  *      security:
  *          - BearerAuth: []
  *      parameters:
  *          - in: path
  *            name: eventId
  *            schema:
  *                type: integer
  *            required: true
  *            description: The id of the event
  *      requestBody:
  *          required: true
  *          content:
  *              application/json:
  *                  schema:
  *                      type: object
  *                      $ref: '#/components/schemas/EventSubmission'
  *      responses:
  *          200:
  *              description: Event updated
  *              content:
  *                  application/json:
  *                      schema:
  *                          type: object
  *                          $ref: '#/components/schemas/EventResponse'
  *          401:
  *              $ref: '#/components/responses/UnauthorizedError'
  */
 router.put('/:eventId', requireToken, paramsEventValidator, bodyEventValidator, updateEvent);
 
 /**
  * @swagger
  * /api/v1/events/{eventId}:
  *  delete:
  *      summary: Delete an event
  *      tags: [Events]
  *      security:
  *          - BearerAuth: []
  *      parameters:
  *          - in: path
  *            name: eventId
  *            schema:
  *                type: integer
  *            required: true
  *            description: The id of the event
  *      responses:
  *          200:
  *              description: Event deleted
  *              content:
  *                  application/json:
  *                      schema:
  *                          type: object
  *                          $ref: '#/components/schemas/EventResponse'
  *          401:
  *              $ref: '#/components/responses/UnauthorizedError'
  */
 router.delete('/:eventId', requireToken, paramsEventValidator, deleteEvent);
 
 /**
  * @swagger
  * /api/v1/events/{eventId}:
  *  get:
  *      summary: Get an event by id
  *      tags: [Events]
  *      security:
  *          - BearerAuth: []
  *      parameters:
  *          - in: path
  *            name: eventId
  *            schema:
  *                type: integer
  *            required: true
  *            description: The id of the event
  *      responses:
  *          200:
  *              description: Event returned
  *              content:
  *                  application/json:
  *                      schema:
  *                          type: object
  *                          $ref: '#/components/schemas/EventResponse'
  *          401:
  *              $ref: '#/components/responses/UnauthorizedError'
  */
 router.get('/:eventId', requireToken, paramsEventValidator, getEventById);
 
 /**
  * @swagger
  * /api/v1/events:
  *  get:
  *      summary: Get all events
  *      tags: [Events]
  *      security:
  *          - BearerAuth: []
  *      responses:
  *          200:
  *              description: Events returned
  *              content:
  *                  application/json:
  *                      schema:
  *                          type: object
  *                          $ref: '#/components/schemas/EventListResponse'
  *          401:
  *              $ref: '#/components/responses/UnauthorizedError'
  */
 router.get('/', requireToken, getAllEvents);

export default router;