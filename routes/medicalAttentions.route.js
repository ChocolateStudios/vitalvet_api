import { Router } from "express";
import { createMedicalAttention, deleteMedicalAttention, getAllMedicalAttentionsByPatientId, getMedicalAttentionById, updateMedicalAttention } from "../controllers/medicalAttentions.controller.js";
import { bodyMedicalAttentionValidator } from "../middlewares/medicalAttentionValidatorManager.js";
import { requireToken } from "../middlewares/requireToken.js";

const router = Router();

/**
 * @swagger
 * /api/v1/medicalAttentions:
 *  post:
 *      summary: Register a new medical attention
 *      tags: [MedicalAttentions]
 *      security:
 *          - BearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/MedicalAttentionSubmission'
 *      responses:
 *          201:
 *              description: Medical attention created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MedicalAttentionResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', requireToken, bodyMedicalAttentionValidator, createMedicalAttention);

/**
* @swagger
* /api/v1/medicalAttentions/{medicalAttentionId}:
*  put:
*      summary: Update a medical attention
*      tags: [MedicalAttentions]
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
*                      $ref: '#/components/schemas/MedicalAttentionSubmission'
*      responses:
*          200:
*              description: Medical attention updated
*              content:
*                  application/json:
*                      schema:
*                          type: object
*                          $ref: '#/components/schemas/MedicalAttentionResponse'
*          401:
*              $ref: '#/components/responses/UnauthorizedError'
*/
router.put('/:medicalAttentionId', requireToken, bodyMedicalAttentionValidator, updateMedicalAttention);

/**
* @swagger
* /api/v1/medicalAttentions/{medicalAttentionId}:
*  delete:
*      summary: Delete a medical attention
*      tags: [MedicalAttentions]
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
*              description: Medical attention deleted
*              content:
*                  application/json:
*                      schema:
*                          type: object
*                          $ref: '#/components/schemas/MedicalAttentionResponse'
*          401:
*              $ref: '#/components/responses/UnauthorizedError'
*/
router.delete('/:medicalAttentionId', requireToken, deleteMedicalAttention);

/**
* @swagger
* /api/v1/medicalAttentions/{medicalAttentionId}:
*  get:
*      summary: Get medical attention by id
*      tags: [MedicalAttentions]
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
*              description: Medical attention returned
*              content:
*                  application/json:
*                      schema:
*                          type: object
*                          $ref: '#/components/schemas/MedicalAttentionResponse'
*          401:
*              $ref: '#/components/responses/UnauthorizedError'
*/
router.get('/:medicalAttentionId', requireToken, getMedicalAttentionById);

/**
 * @swagger
 * /api/v1/medicalAttentions/patient/{patientId}:
 *  get:
 *      summary: Get all medical attentions by patient id
 *      tags: [MedicalAttentions]
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
 *              description: Medical attentions returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MedicalAttentionListResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/patient/:patientId', requireToken, getAllMedicalAttentionsByPatientId);

export default router;