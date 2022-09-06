import { sequelize } from '../database/connectdb.js';
import { server } from "../index.js";
import { Medicine } from '../models/Medicine.js';
import { apiDelete, apiGet, apiPost, apiPut, compareEventTypeFunc, compareMedicineFunc, ensureOnlyInitialInstancesExist, expectBadRequestResponse, expectBadRequiredBodyAttribute, expectLengthOfDatabaseInstancesToBeTheSameWith, expectNotFoundResponse, expectOnlyInitialInstancesInDatabase, expectSameArrayBody, expectSuccessfulCreation, expectSuccessfulRequestResponse, initialMedicines } from './testCommon.js';

let initMedicines = [];

describe('medicine endpoints', () => {
    beforeEach(async () => {
        initMedicines = await ensureOnlyInitialInstancesExist(Medicine, initialMedicines, compareMedicineFunc);
    });

    describe('test scenary ready', () => {
        test('expected initial medicines', async () => {
            await expectOnlyInitialInstancesInDatabase(Medicine, initialMedicines, compareMedicineFunc);
        });
    });

    describe('register a new medicine', () => {
        const endpointUrl = '/medicines';

        test('medicine created successfully', async () => {
            const newMedicine = { name: "Isaler" };
            const createResponse = await apiPost(endpointUrl, newMedicine);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                name: newMedicine.name
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Medicine, initialMedicines.length + 1);
        });

        test('failed to create medicine because there is already another medicine with the same name', async () => {
            const createResponse = await apiPost(endpointUrl, initialMedicines[1]);
            expectBadRequestResponse(createResponse);
            const expectedBody = { message: 'Medicine already exists' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Medicine, initialMedicines.length);
        });

        test('failed to create a medicine because there is no name', async () => {
            const createResponse = await apiPost(endpointUrl, {});
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Name is required");
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Medicine, initialMedicines.length);
        });
    });

    describe('update a medicine', () => {
        const endpointUrl = (medicineId) => `/medicines/${medicineId}`;

        test('medicine updated successfully', async () => {
            const newMedicine = { name: "Isaler" };
            const updateResponse = await apiPut(endpointUrl(initMedicines[0].id), newMedicine);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                name: newMedicine.name
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a medicine because there is already another medicine with the same name', async () => {
            const updateResponse = await apiPut(endpointUrl(initMedicines[1].id), initialMedicines.find(m => m.name !== initMedicines[1].name));
            expectBadRequestResponse(updateResponse);
            const expectedBody = { message: 'Another medicine already exists with this name' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a medicine because the medicine does not exist', async () => {
            const newMedicine = { name: "Isaler" };
            const updateResponse = await apiPut(endpointUrl(999), newMedicine);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Medicine not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a medicine because there is no name', async () => {
            const updateResponse = await apiPut(endpointUrl(initMedicines[1].id), {});
            expectBadRequestResponse(updateResponse);
            expectBadRequiredBodyAttribute(updateResponse, "Name is required");
        });
    });

    describe('delete a medicine', () => {
        const endpointUrl = (medicineId) => `/medicines/${medicineId}`;

        test('medicine deleted successfully', async () => {
            const deleteResponse = await apiDelete(endpointUrl(initMedicines[1].id));
            expectSuccessfulRequestResponse(deleteResponse);

            const expectedBody = {
                id: deleteResponse.body.id,
                name: initMedicines[1].name
            };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Medicine, initialMedicines.length - 1);
        });

        test('failed to delete a medicine because the medicine does not exist', async () => {
            const deleteResponse = await apiDelete(endpointUrl(999));
            expectNotFoundResponse(deleteResponse);
            const expectedBody = { message: 'Medicine not found' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Medicine, initialMedicines.length);
        });
    });

    describe('get all medicines', () => {
        const endpointUrl = '/medicines';

        test('all medicines returned successfully', async () => {
            const getResponse = await apiGet(endpointUrl);
            expectSuccessfulRequestResponse(getResponse);
            await expectSameArrayBody(getResponse.body, initMedicines.map(m => {
                return { id: m.id, name: m.name };
            }), compareEventTypeFunc);
        });
    });
});

afterAll(() => {
    sequelize.close();
    server.close();
});