import { Router } from "express";
import { getAllMedicines, getMedicineByName, createMedicine, updateMedicine, deleteMedicine } from '../controllers/medicines.controller.js';
import { bodyMedicineValidator, paramsMedicineValidator } from '../middlewares/medicinesValidatorManager.js';

const router = Router();

/**
 * @swagger
 * /api/v1/medicines:
 *  post:
 *      summary: Register a new medicine
 *      tags: [Medicines]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/MedicineSubmission'
 *      responses:
 *          201:
 *              description: Medicine created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MedicineResponse'
 */
router.post('/', bodyMedicineValidator, createMedicine);

/**
 * @swagger
 * /api/v1/medicines/{medicineId}:
 *  put:
 *      summary: Update a medicine
 *      tags: [Medicines]
 *      parameters:
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
 *                      $ref: '#/components/schemas/MedicineSubmission'
 *      responses:
 *          200:
 *              description: Medicine updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MedicineResponse'
 */
router.put('/:medicineId', paramsMedicineValidator, bodyMedicineValidator, updateMedicine);

/**
 * @swagger
 * /api/v1/medicines/{medicineId}:
 *  delete:
 *      summary: Delete a medicine
 *      tags: [Medicines]
 *      parameters:
 *          - in: path
 *            name: medicineId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the medicine
 *      responses:
 *          200:
 *              description: Medicine deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MedicineResponse'
 */
router.delete('/:medicineId', paramsMedicineValidator, deleteMedicine);

/**
 * @swagger
 * /api/v1/medicines/{medicineName}:
 *  get:
 *      summary: Get a medicine by name
 *      tags: [Medicines]
 *      parameters:
 *          - in: path
 *            name: medicineName
 *            schema:
 *                type: string
 *            required: true
 *            description: The name of the medicine
 *      responses:
 *          200:
 *              description: Medicine returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MedicineResponse'
 */
router.get('/:medicineName', getMedicineByName);

/**
 * @swagger
 * /api/v1/medicines:
 *  get:
 *      summary: Get all medicines
 *      tags: [Medicines]
 *      responses:
 *          200:
 *              description: Medicines returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MedicineListResponse'
 */
router.get('/', getAllMedicines);

export default router;