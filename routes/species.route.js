import { Router } from 'express';
import { createSpecies, createSubspecies, deleteSpecies, deleteSubspecies, getAllSpecies, getAllSubspeciesBySpeciesId, updateSpecies, updateSubspecies } from '../controllers/species.controller.js';
import { bodySpeciesValidator, paramsSpeciesAndSubspeciesValidator, paramsSpeciesValidator } from '../middlewares/speciesValidatorManager.js';

const router = Router();


/**
 * @swagger
 * /api/v1/species:
 *  post:
 *      summary: Register a new species
 *      tags: [Species]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/SpeciesSubmission'
 *      responses:
 *          201:
 *              description: Species created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/SpeciesResponse'
 */
router.post('/', bodySpeciesValidator, createSpecies);


/**
 * @swagger
 * /api/v1/species/{speciesId}/subspecies:
 *  post:
 *      summary: Register a new subspecies
 *      tags: [Species]
 *      parameters:
 *          - in: path
 *            name: speciesId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the species
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/SpeciesSubmission'
 *      responses:
 *          201:
 *              description: Species created
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/SpeciesResponse'
 */
router.post('/:speciesId/subspecies', paramsSpeciesValidator, bodySpeciesValidator, createSubspecies);


/**
 * @swagger
 * /api/v1/species/{speciesId}:
 *  put:
 *      summary: Update a species
 *      tags: [Species]
 *      parameters:
 *          - in: path
 *            name: speciesId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the species
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/SpeciesSubmission'
 *      responses:
 *          200:
 *              description: Species updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/SpeciesResponse'
 */
router.put('/:speciesId', paramsSpeciesValidator, bodySpeciesValidator, updateSpecies);


/**
 * @swagger
 * /api/v1/species/{speciesId}/subspecies/{subspeciesId}:
 *  put:
 *      summary: Update a subspecies
 *      tags: [Species]
 *      parameters:
 *          - in: path
 *            name: speciesId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the species
 *          - in: path
 *            name: subspeciesId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the subspecies
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/SpeciesSubmission'
 *      responses:
 *          200:
 *              description: Subspecies updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/SpeciesResponse'
 */
router.put('/:speciesId/subspecies/:subspeciesId', paramsSpeciesAndSubspeciesValidator, bodySpeciesValidator, updateSubspecies);


/**
 * @swagger
 * /api/v1/species/{speciesId}:
 *  delete:
 *      summary: Delete a species
 *      tags: [Species]
 *      parameters:
 *          - in: path
 *            name: speciesId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the species
 *      responses:
 *          200:
 *              description: Species deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/SpeciesResponse'
 */
router.delete('/:speciesId', paramsSpeciesValidator, deleteSpecies);


/**
 * @swagger
 * /api/v1/species/{speciesId}/subspecies/{subspeciesId}:
 *  delete:
 *      summary: Delete a subspecies
 *      tags: [Species]
 *      parameters:
 *          - in: path
 *            name: speciesId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the species
 *          - in: path
 *            name: subspeciesId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the subspecies
 *      responses:
 *          200:
 *              description: Species deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/SpeciesResponse'
 */
router.delete('/:speciesId/subspecies/:subspeciesId', paramsSpeciesAndSubspeciesValidator, deleteSubspecies);


/**
 * @swagger
 * /api/v1/species:
 *  get:
 *      summary: Get all species with subspecies
 *      tags: [Species]
 *      responses:
 *          200:
 *              description: Species returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/SpeciesListResponse'
 */
router.get('/', getAllSpecies);


/**
 * swagger
 * /api/v1/species/{speciesId}/subspecies:
 *  get:
 *      summary: Get all subspecies by species id
 *      tags: [Species]
 *      parameters:
 *          - in: path
 *            name: speciesId
 *            schema:
 *                type: integer
 *            required: true
 *            description: The id of the species
 *      responses:
 *          200:
 *              description: Species returned
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/SpeciesListResponse'
 */
// router.get('/:speciesId/subspecies', paramsSpeciesValidator, getAllSubspeciesBySpeciesId);

export default router;