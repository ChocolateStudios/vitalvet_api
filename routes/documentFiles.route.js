import { Router } from 'express';
import { createPatientDocumentFile } from '../controllers/documentFiles.controller.js';
import { bodyDocumentFileValidator, paramsPatientDocumentFileValidator } from '../middlewares/documentFileValidatorManager.js';

const router = Router();

/**
 * @swagger
 * /api/v1/patients/{patientId}/documentFiles:
 *  post:
 *      summary: Upload document file for patient
 *      tags: [DocumentFiles]
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
 *                      $ref: '#/components/schemas/DocumentFileSubmission'
 *      responses:
 *          201:
 *              description: Document file uploaded
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/PatientDocumentFileResponse'
 */
 router.post('/patients/:patientId/documentFiles', paramsPatientDocumentFileValidator, bodyDocumentFileValidator, createPatientDocumentFile);

export default router;