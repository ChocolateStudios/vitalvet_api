import { Router } from 'express';
import { createPatient } from '../controllers/patients.controller.js';

const router = Router();


/**
 * @swagger
 * /api/v1/patients:
 *  post:
 *      summary: Register a new patient
 *      tags: [Patients]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Patient'
 *      responses:
 *          201:
 *              description: Patient created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Patient'
 */
router.post('/', createPatient);

export default router;