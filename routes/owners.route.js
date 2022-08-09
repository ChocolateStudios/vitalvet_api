import { Router } from 'express';
import { createOwner, deleteOwner, getAllOwners, getOwnerById, updateOwner } from '../controllers/owners.controller.js';
import { bodyOwnerValidator, paramsOwnerValidator } from '../middlewares/ownerValidatorManager.js';

const router = Router();

/**
 * @swagger
 * /api/v1/owners:
 *  post:
 *      summary: Register a new owner
 *      tags: [Owners]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/OwnerSubmission'
 *      responses:
 *          201:
 *              description: Owner created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Owner'
 */
router.post('/', bodyOwnerValidator, createOwner);

/**
 * @swagger
 * /api/v1/owners/{ownerId}:
 *  put:
 *      summary: Update an owner
 *      tags: [Owners]
 *      parameters:
 *          - in: path
 *            name: ownerId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the owner
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/OwnerSubmission'
 *      responses:
 *          200:
 *              description: Owner updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Owner'
 */
router.put('/:ownerId', paramsOwnerValidator, bodyOwnerValidator, updateOwner);

/**
 * @swagger
 * /api/v1/owners/{ownerId}:
 *  delete:
 *      summary: Delete an owner
 *      tags: [Owners]
 *      parameters:
 *          - in: path
 *            name: ownerId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the owner
 *      responses:
 *          200:
 *              description: Owner deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Owner'
 */
router.delete('/:ownerId', paramsOwnerValidator, deleteOwner);

/**
 * @swagger
 * /api/v1/owners/{ownerId}:
 *  get:
 *      summary: Get an owner by id
 *      tags: [Owners]
 *      parameters:
 *          - in: path
 *            name: ownerId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the owner
 *      responses:
 *          200:
 *              description: Owner returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Owner'
 */
router.get('/:ownerId', paramsOwnerValidator, getOwnerById);

/**
 * @swagger
 * /api/v1/owners:
 *  get:
 *      summary: Get all owners
 *      tags: [Owners]
 *      responses:
 *          200:
 *              description: Owners returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/OwnersListResponse'
 */
router.get('/', getAllOwners);

export default router;