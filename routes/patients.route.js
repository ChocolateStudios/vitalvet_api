import { Router } from 'express';
import { createPatient } from '../controllers/patients.controller.js';
import { requireToken } from '../middlewares/requireToken.js';

const router = Router();


/**
 * @swagger
 * /api/v1/patients:
 *  post:
 *      summary: Register a new patient
 *      tags: [Patients]
 *      security:
 *          - BearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/PatientSubmission'
 *      responses:
 *          201:
 *              description: Patient created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Patient'
 */
router.post('/', requireToken, createPatient);

export default router;