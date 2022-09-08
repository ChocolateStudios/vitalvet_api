import { Router } from "express";
import { createMedicalAttentionMedicine, deleteMedicalAttentionMedicine, getAllMedicinesByMedicalAttentionId, updateMedicalAttentionMedicine } from "../controllers/medicalAttentionMedicines.controller.js";
import { bodyMedicalAttentionMedicineValidator, paramsWithMedicalAttentionValidator, paramsWithMedicineValidator } from "../middlewares/medicalAttentionMedicineValidatorManager.js";
import { requireToken } from "../middlewares/requireToken.js";

const router = Router();

/**
 * @swagger
 * /api/v1/medicalAttentions/{medicalAttentionId}/medicines/{medicineId}:
 *  post:
 *      summary: Assign a medicine with medical attention
 *      tags: [MedicalAttentionMedicines]
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
  *            name: medicineId
  *            schema:
  *                type: integer
  *            required: true
  *            description: The id of the medicine
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/MedicalAttentionMedicineSubmission'
 *      responses:
 *          201:
 *              description: Medicine assigned with medical attention
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MedicalAttentionMedicineResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/medicalAttentions/:medicalAttentionId/medicines/:medicineId', requireToken, paramsWithMedicalAttentionValidator, paramsWithMedicineValidator, bodyMedicalAttentionMedicineValidator, createMedicalAttentionMedicine);

/**
 * @swagger
 * /api/v1/medicalAttentions/{medicalAttentionId}/medicines/{medicineId}:
 *  put:
 *      summary: Update the relationship between medicine and medical attention
 *      tags: [MedicalAttentionMedicines]
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
  *            name: medicineId
  *            schema:
  *                type: integer
  *            required: true
  *            description: The id of the medicine
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/MedicalAttentionMedicineSubmission'
 *      responses:
 *          200:
 *              description: Relationship between medicine and medical attention updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MedicalAttentionMedicineResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/medicalAttentions/:medicalAttentionId/medicines/:medicineId', requireToken, paramsWithMedicalAttentionValidator, paramsWithMedicineValidator, bodyMedicalAttentionMedicineValidator, updateMedicalAttentionMedicine);

/**
 * @swagger
 * /api/v1/medicalAttentions/{medicalAttentionId}/medicines/{medicineId}:
 *  delete:
 *      summary: Delete the relationship between medicine and medical attention
 *      tags: [MedicalAttentionMedicines]
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
  *            name: medicineId
  *            schema:
  *                type: integer
  *            required: true
  *            description: The id of the medicine
 *      responses:
 *          200:
 *              description: Relationship between medicine and medical attention deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MedicalAttentionMedicineResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/medicalAttentions/:medicalAttentionId/medicines/:medicineId', requireToken, paramsWithMedicalAttentionValidator, paramsWithMedicineValidator, deleteMedicalAttentionMedicine);

/**
 * @swagger
 * /api/v1/medicalAttentions/{medicalAttentionId}/medicines:
 *  get:
 *      summary: Get all medicines assigned to a medical attention
 *      tags: [MedicalAttentionMedicines]
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
 *              description: Medicines assigned to medical attention
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MedicalAttentionMedicineListResponse'
 *          401:
 *              $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/medicalAttentions/:medicalAttentionId/medicines', requireToken, paramsWithMedicalAttentionValidator, getAllMedicinesByMedicalAttentionId);

export default router;