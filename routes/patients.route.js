import { Router } from 'express';
import { createPatient, deletePatient, getAllPatients, getPatientById, updatePatient } from '../controllers/patients.controller.js';
import { bodyPatientValidator, paramsPatientValidator } from '../middlewares/patientValidatorManager.js';
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
 *                          $ref: '#/components/schemas/PatientResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', requireToken, bodyPatientValidator, createPatient);

/**
 * @swagger
 * /api/v1/patients/{patientId}:
 *  put:
 *      summary: Update a patient
 *      tags: [Patients]
 *      security:
 *          - BearerAuth: []
 *      parameters:
 *          - in: path
 *            name: patientId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the patient
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/PatientSubmission'
 *      responses:
 *          200:
 *              description: Patient updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/PatientResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/:patientId', requireToken, paramsPatientValidator, bodyPatientValidator, updatePatient);

/**
 * @swagger
 * /api/v1/patients/{patientId}:
 *  delete:
 *      summary: Delete a patient
 *      tags: [Patients]
 *      security:
 *          - BearerAuth: []
 *      parameters:
 *          - in: path
 *            name: patientId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the patient
 *      responses:
 *          200:
 *              description: Patient deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/PatientResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/:patientId', requireToken, paramsPatientValidator, deletePatient);

/**
 * @swagger
 * /api/v1/patients/{patientId}:
 *  get:
 *      summary: Get a patient by id
 *      tags: [Patients]
 *      security:
 *          - BearerAuth: []
 *      parameters:
 *          - in: path
 *            name: patientId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the patient
 *      responses:
 *          200:
 *              description: Patient returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/PatientResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/:patientId', requireToken, paramsPatientValidator, getPatientById);

/**
 * @swagger
 * /api/v1/patients:
 *  get:
 *      summary: Get all patients
 *      tags: [Patients]
 *      security:
 *          - BearerAuth: []
 *      responses:
 *          200:
 *              description: Patients returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/PatientListResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', requireToken, getAllPatients);

export default router;