import { sequelize } from '../database/connectdb.js';
import { server } from "../index.js";
import { Species } from '../models/Species.js';
import { api, apiDelete, apiGet, apiPost, apiPut, compareSpeciesFunc, compareSpeciesWithSubspeciesFunc, ensureOnlyInitialInstancesExist, expectBadRequestResponse, expectBadRequiredBodyAttribute, expectLengthOfDatabaseInstancesToBeTheSameWith, expectNotFoundResponse, expectOnlyInitialInstancesInDatabase, expectSameArrayBody, expectSuccessfulCreation, expectSuccessfulRequestResponse, initialSpecies, initialSubspecies } from './testCommon.js';

const initialSpeciesAndSubspecies = initialSpecies.concat(initialSubspecies);
let initSpecies = [];
let initSubspecies = [];

describe('species endpoints', () => {
    beforeEach(async () => {
        initSpecies = await ensureOnlyInitialInstancesExist(Species, initialSpecies, compareSpeciesFunc);
        initSubspecies = await ensureOnlyInitialInstancesExist(Species, initialSpeciesAndSubspecies, compareSpeciesFunc);
        initSubspecies = initSubspecies.filter(s => (s.speciesId));
    });

    describe('test scenary ready', () => {
        test('expected initial species', async () => {
            await expectOnlyInitialInstancesInDatabase(Species, initialSpeciesAndSubspecies, compareSpeciesFunc);
        });
    });

    describe('register a new species', () => {
        const endpointUrl = '/species';

        test('species created successfully', async () => {
            const newSpecies = { name: "León" };
            const createResponse = await apiPost(endpointUrl, newSpecies);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                name: newSpecies.name
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Species, initialSpeciesAndSubspecies.length + 1);
        });

        test('failed to create species because there is already another species with the same name', async () => {
            const createResponse = await apiPost(endpointUrl, initialSpecies[1]);
            expectBadRequestResponse(createResponse);
            const expectedBody = { message: 'Species already exists' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Species, initialSpeciesAndSubspecies.length);
        });

        test('failed to create a species because there is no name', async () => {
            const createResponse = await apiPost(endpointUrl, {});
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Name is required");
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Species, initialSpeciesAndSubspecies.length);
        });
    });

    describe('update a species', () => {
        const endpointUrl = (speciesId) => `/species/${speciesId}`;

        test('species updated successfully', async () => {
            const newSpecies = { name: 'León' };
            const updateResponse = await apiPut(endpointUrl(initSpecies[0].id), newSpecies);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                name: newSpecies.name
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update species because there is already another species with the same name', async () => {
            const updateResponse = await apiPut(endpointUrl(initSpecies[1].id), initialSpecies[1]);
            expectBadRequestResponse(updateResponse);
            const expectedBody = { message: 'Another species already exists with this name' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a species because the species does not exist', async () => {
            const newSpecies = { name: 'León' };
            const updateResponse = await apiPut(endpointUrl(999), newSpecies);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Species not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a species because there is no name', async () => {
            const updateResponse = await apiPut(endpointUrl(initSpecies[1].id), {});
            expectBadRequestResponse(updateResponse);
            expectBadRequiredBodyAttribute(updateResponse, "Name is required");
        });
    });

    describe('delete a species', () => {
        const endpointUrl = (speciesId) => `/species/${speciesId}`;

        test('species deleted successfully', async () => {
            const deleteResponse = await apiDelete(endpointUrl(initSpecies.find(s => s.name === 'Gato').id));
            expectSuccessfulRequestResponse(deleteResponse);

            const expectedBody = {
                id: deleteResponse.body.id,
                name: "Gato"
            };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Species, initialSpeciesAndSubspecies.length - 1);
        });

        test('failed to delete a species because the species does not exist', async () => {
            const deleteResponse = await apiDelete(endpointUrl(999));
            expectNotFoundResponse(deleteResponse);
            const expectedBody = { message: 'Species not found' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Species, initialSpeciesAndSubspecies.length);
        });
    });

    describe('register a new subspecies', () => {
        const endpointUrl = (speciesId) => `/species/${speciesId}/subspecies`;

        test('subspecies created successfully', async () => {
            const newSubspecies = { name: "Bulldog" };
            const createResponse = await apiPost(endpointUrl(initSpecies[1].id), newSubspecies);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                name: newSubspecies.name,
                speciesId: `${initSpecies[1].id}`
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Species, initialSpeciesAndSubspecies.length + 1);
        });

        test('failed to create subspecies because there is already another subspecies with the same name', async () => {
            const createResponse = await apiPost(endpointUrl(initSubspecies[0].speciesId), initialSubspecies[0]);
            expectBadRequestResponse(createResponse);
            const expectedBody = { message: 'Subspecies already exists' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Species, initialSpeciesAndSubspecies.length);
        });

        test('failed to create a subspecies because there is no name', async () => {
            const createResponse = await apiPost(endpointUrl(initSubspecies[0].speciesId), {});
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Name is required");
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Species, initialSpeciesAndSubspecies.length);
        });
    });

    describe('update a subspecies', () => {
        const endpointUrl = (speciesId, subspeciesId) => `/species/${speciesId}/subspecies/${subspeciesId}`;

        test('subspecies updated successfully', async () => {
            const newSubspecies = { name: 'Golden retriever' };
            const updateResponse = await apiPut(endpointUrl(initSubspecies[0].speciesId, initSubspecies[0].id), newSubspecies);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                name: newSubspecies.name,
                speciesId: `${initSubspecies[0].speciesId}`
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update subspecies because there is already another subspecies with the same name', async () => {
            const updateResponse = await apiPut(endpointUrl(initSubspecies[0].speciesId, initSubspecies[0].id), initialSubspecies[0]);
            expectBadRequestResponse(updateResponse);
            const expectedBody = { message: 'Another subspecies already exists with this name' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a subspecies because the subspecies does not exist', async () => {
            const newSubspecies = { name: 'Golden retriever' };
            const updateResponse = await apiPut(endpointUrl(initSubspecies[0].speciesId, 999), newSubspecies);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Subspecies not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a subspecies because the species does not exist', async () => {
            const newSubspecies = { name: 'Golden retriever' };
            const updateResponse = await apiPut(endpointUrl(999, 999), newSubspecies);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Species not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a subspecies because there is no name', async () => {
            const updateResponse = await apiPut(endpointUrl(initSubspecies[0].speciesId, initSubspecies[0].id), {});
            expectBadRequestResponse(updateResponse);
            expectBadRequiredBodyAttribute(updateResponse, "Name is required");
        });
    });

    describe('delete a subspecies', () => {
        const endpointUrl = (speciesId, subspeciesId) => `/species/${speciesId}/subspecies/${subspeciesId}`;

        test('subspecies deleted successfully', async () => {
            const deleteResponse = await apiDelete(endpointUrl(initSubspecies[0].speciesId, initSubspecies[0].id));
            expectSuccessfulRequestResponse(deleteResponse);

            const expectedBody = {
                id: deleteResponse.body.id,
                name: initSubspecies[0].name,
                speciesId: initSubspecies[0].speciesId
            };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Species, initialSpeciesAndSubspecies.length - 1);
        });

        test('failed to delete a subspecies because the subspecies does not exist', async () => {
            const deleteResponse = await apiDelete(endpointUrl(initSubspecies[0].speciesId, 999));
            expectNotFoundResponse(deleteResponse);
            const expectedBody = { message: 'Subspecies not found' };
            expect(deleteResponse.body).toEqual(expectedBody);
        });

        test('failed to delete a subspecies because the species does not exist', async () => {
            const deleteResponse = await apiDelete(endpointUrl(999, 999));
            expectNotFoundResponse(deleteResponse);
            const expectedBody = { message: 'Species not found' };
            expect(deleteResponse.body).toEqual(expectedBody);
        });
    });

    describe('get all species with subspecies', () => {
        const endpointUrl = '/species';

        test('all species with subspecies returned successfully', async () => {
            const getResponse = await apiGet(endpointUrl);
            expectSuccessfulRequestResponse(getResponse);
            await expectSameArrayBody(getResponse.body, initSpecies.map(species => {
                return { id: species.id, name: species.name,
                         subspecies: initSubspecies.filter(subspecies => subspecies.speciesId === species.id) };
            }), compareSpeciesWithSubspeciesFunc);
        });
    });
});

afterAll(() => {
    sequelize.close();
    server.close();
});