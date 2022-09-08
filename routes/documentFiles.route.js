import { Router } from 'express';
import { createMedicalAttentionDocumentFile, createPatientDocumentFile, deleteMedicalAttentionDocumentFile, deletePatientDocumentFile, getAllMedicalAttentionDocumentFilesByMedicalAttentionId, getAllPatientDocumentFilesByPatientId, getMedicalAttentionDocumentFileByMedicalAttentionIdAndDocumentFileId, getPatientDocumentFileByPatientIdAndDocumentFileId, updateMedicalAttentionDocumentFile, updatePatientDocumentFile } from '../controllers/documentFiles.controller.js';
import { bodyDocumentFileValidator, paramsGeneralDocumentFileValidator, paramsMedicalAttentionDocumentFileValidator, paramsPatientDocumentFileValidator } from '../middlewares/documentFileValidatorManager.js';
import { requireToken } from '../middlewares/requireToken.js';

const router = Router();

/**
 * @swagger
 * /api/v1/patients/{patientId}/documentFiles:
 *  post:
 *      summary: Upload document file for patient
 *      tags: [PatientDocumentFiles]
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
 *                      $ref: '#/components/schemas/DocumentFileSubmission'
 *      responses:
 *          201:
 *              description: Document file uploaded
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/PatientDocumentFileResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/patients/:patientId/documentFiles', requireToken, paramsPatientDocumentFileValidator, bodyDocumentFileValidator, createPatientDocumentFile);

/**
 * @swagger
 * /api/v1/medicalAttentions/{medicalAttentionId}/documentFiles:
 *  post:
 *      summary: Upload document file for medical attention
 *      tags: [MedicalAttentionDocumentFiles]
 *      security:
 *          - BearerAuth: []
 *      parameters:
 *          - in: path
 *            name: medicalAttentionId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the medical attention
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
 *                          $ref: '#/components/schemas/MedicalAttentionDocumentFileResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/medicalAttentions/:medicalAttentionId/documentFiles', requireToken, paramsMedicalAttentionDocumentFileValidator, bodyDocumentFileValidator, createMedicalAttentionDocumentFile);

/**
 * @swagger
 * /api/v1/patients/{patientId}/documentFiles/{documentFileId}:
 *  put:
 *      summary: Update a document file for patient
 *      tags: [PatientDocumentFiles]
 *      security:
 *          - BearerAuth: []
 *      parameters:
 *          - in: path
 *            name: patientId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the patient
 *          - in: path
 *            name: documentFileId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the document file
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/DocumentFileSubmission'
 *      responses:
 *          200:
 *              description: Document file updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/PatientDocumentFileResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/patients/:patientId/documentFiles/:documentFileId', requireToken, paramsPatientDocumentFileValidator, paramsGeneralDocumentFileValidator, bodyDocumentFileValidator, updatePatientDocumentFile);

/**
 * @swagger
 * /api/v1/medicalAttentions/{medicalAttentionId}/documentFiles/{documentFileId}:
 *  put:
 *      summary: Update a document file for medical attention
 *      tags: [MedicalAttentionDocumentFiles]
 *      security:
 *          - BearerAuth: []
 *      parameters:
 *          - in: path
 *            name: medicalAttentionId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the medical attention
 *          - in: path
 *            name: documentFileId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the document file
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/DocumentFileSubmission'
 *      responses:
 *          200:
 *              description: Document file updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MedicalAttentionDocumentFileResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/medicalAttentions/:medicalAttentionId/documentFiles/:documentFileId', requireToken, paramsMedicalAttentionDocumentFileValidator, paramsGeneralDocumentFileValidator, bodyDocumentFileValidator, updateMedicalAttentionDocumentFile);

/**
 * @swagger
 * /api/v1/patients/{patientId}/documentFiles/{documentFileId}:
 *  delete:
 *      summary: Delete a document file for patient
 *      tags: [PatientDocumentFiles]
 *      security:
 *          - BearerAuth: []
 *      parameters:
 *          - in: path
 *            name: patientId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the patient
 *          - in: path
 *            name: documentFileId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the document file
 *      responses:
 *          200:
 *              description: Document file deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/PatientDocumentFileResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/patients/:patientId/documentFiles/:documentFileId', requireToken, paramsPatientDocumentFileValidator, paramsGeneralDocumentFileValidator, deletePatientDocumentFile);

/**
 * @swagger
 * /api/v1/medicalAttentions/{medicalAttentionId}/documentFiles/{documentFileId}:
 *  delete:
 *      summary: Delete a document file for medical attention
 *      tags: [MedicalAttentionDocumentFiles]
 *      security:
 *          - BearerAuth: []
 *      parameters:
 *          - in: path
 *            name: medicalAttentionId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the medical attention
 *          - in: path
 *            name: documentFileId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the document file
 *      responses:
 *          200:
 *              description: Document file deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MedicalAttentionDocumentFileResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/medicalAttentions/:medicalAttentionId/documentFiles/:documentFileId', requireToken, paramsMedicalAttentionDocumentFileValidator, paramsGeneralDocumentFileValidator, deleteMedicalAttentionDocumentFile);

/**
 * @swagger
 * /api/v1/patients/{patientId}/documentFiles/{documentFileId}:
 *  get:
 *      summary: Get a document file by patient id and document file id
 *      tags: [PatientDocumentFiles]
 *      security:
 *          - BearerAuth: []
 *      parameters:
 *          - in: path
 *            name: patientId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the patient
 *          - in: path
 *            name: documentFileId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the document file
 *      responses:
 *          200:
 *              description: Document file returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/PatientDocumentFileResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/patients/:patientId/documentFiles/:documentFileId', requireToken, paramsPatientDocumentFileValidator, paramsGeneralDocumentFileValidator, getPatientDocumentFileByPatientIdAndDocumentFileId);

/**
 * @swagger
 * /api/v1/medicalAttentions/{medicalAttentionId}/documentFiles/{documentFileId}:
 *  get:
 *      summary: Get a document file by medical attention id and document file id
 *      tags: [MedicalAttentionDocumentFiles]
 *      security:
 *          - BearerAuth: []
 *      parameters:
 *          - in: path
 *            name: medicalAttentionId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the medical attention
 *          - in: path
 *            name: documentFileId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the document file
 *      responses:
 *          200:
 *              description: Document file returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MedicalAttentionDocumentFileResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/medicalAttentions/:medicalAttentionId/documentFiles/:documentFileId', requireToken, paramsMedicalAttentionDocumentFileValidator, paramsGeneralDocumentFileValidator, getMedicalAttentionDocumentFileByMedicalAttentionIdAndDocumentFileId);

/**
 * @swagger
 * /api/v1/patients/{patientId}/documentFiles:
 *  get:
 *      summary: Get all document files by patient id
 *      tags: [PatientDocumentFiles]
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
 *              description: Document files returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/PatientDocumentFileListResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/patients/:patientId/documentFiles', requireToken, paramsPatientDocumentFileValidator, getAllPatientDocumentFilesByPatientId);

/**
 * @swagger
 * /api/v1/medicalAttentions/{medicalAttentionId}/documentFiles:
 *  get:
 *      summary: Get all document files by medical attention id
 *      tags: [MedicalAttentionDocumentFiles]
 *      security:
 *          - BearerAuth: []
 *      parameters:
 *          - in: path
 *            name: medicalAttentionId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the medical attention
 *      responses:
 *          200:
 *              description: Document files returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MedicalAttentionDocumentFileListResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/medicalAttentions/:medicalAttentionId/documentFiles', requireToken, paramsMedicalAttentionDocumentFileValidator, getAllMedicalAttentionDocumentFilesByMedicalAttentionId);


export default router;