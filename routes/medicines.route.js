import { Router } from "express";
import { getAllMedicines, getMedicinesByName, createMedicines, updateMedicines, deleteMedicines } from '../controllers/medicines.controller.js';
import { bodyMedicinesValidator } from '../middlewares/medicinesValidatorManager.js';

const router = Router();

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
 *                          $ref: '#/components/schemas/MedicinesListResponse'
 */
router.get('/', getAllMedicines);

/**
 * @swagger
 * /api/v1/medicines/{medicinesName}:
 *  get:
 *      summary: Get a medicine by name
 *      tags: [Medicines]
 *      parameters:
 *          - in: path
 *            name: medicinesName
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
 *                          $ref: '#/components/schemas/Medicines'
 */
router.get('/:medicinesName', getMedicinesByName);

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
 *                          $ref: '#/components/schemas/Medicines'
 */
router.post('/', bodyMedicinesValidator, createMedicines);

/**
 * @swagger
 * /api/v1/medicines/{medicinesId}:
 *  put:
 *      summary: Update a medicine
 *      tags: [Medicines]
 *      parameters:
 *          - in: path
 *            name: medicinesId
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
 *                          $ref: '#/components/schemas/Medicines'
 */
router.put('/:medicinesId', bodyMedicinesValidator, updateMedicines);

/**
 * @swagger
 * /api/v1/medicines/{medicinesId}:
 *  delete:
 *      summary: Delete a medicine
 *      tags: [Medicines]
 *      parameters:
 *          - in: path
 *            name: medicinesId
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
 *                          $ref: '#/components/schemas/Medicines'
 */
router.delete('/:medicinesId', deleteMedicines);

export default router;