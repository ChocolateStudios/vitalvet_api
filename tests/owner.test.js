import { sequelize } from '../database/connectdb.js';
import { server } from "../index.js";
import { Owner } from '../models/Owner.js';
import { api, apiDelete, apiGet, apiPost, apiPut, compareOwnerFunc, ensureOnlyInitialInstancesExist, expectBadRequestResponse, expectBadRequiredBodyAttribute, expectLengthOfDatabaseInstancesToBeTheSameWith, expectNotFoundResponse, expectOnlyInitialInstancesInDatabase, expectSameArrayBody, expectSuccessfulCreation, expectSuccessfulRequestResponse, initialOwners } from './testCommon.js';

let initOwners = [];

describe('owner endpoints', () => {
    beforeEach(async () => {
        initOwners = await ensureOnlyInitialInstancesExist(Owner, initialOwners, compareOwnerFunc);
    });

    describe('test scenary ready', () => {
        test('expected initial owners', async () => {
            await expectOnlyInitialInstancesInDatabase(Owner, initialOwners, compareOwnerFunc);
        });
    });

    describe('register a new owner', () => {
        const endpointUrl = '/owners';

        test('owner created successfully', async () => {
            const newOwner = { 
                name: "Diego",
                lastname: "Manco",
                birthday: "2015-05-24",
                direction: "Av. Example 534 - Estados Unidos",
                phone: "991724597",
                dni: "760857612",
                email: "diego@example.com"
            };
            const createResponse = await apiPost(endpointUrl, newOwner);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                name: newOwner.name,
                lastname: newOwner.lastname,
                birthday: newOwner.birthday,
                direction: newOwner.direction,
                phone: newOwner.phone,
                dni: newOwner.dni,
                email: newOwner.email
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Owner, initialOwners.length + 1);
        });

        test('owner created successfully with no dni and email', async () => {
            const newOwner = { 
                name: "Diego",
                lastname: "Manco",
                birthday: "2015-05-24",
                direction: "Av. Example 534 - Estados Unidos",
                phone: "991724597"
            };
            const createResponse = await apiPost(endpointUrl, newOwner);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                name: newOwner.name,
                lastname: newOwner.lastname,
                birthday: newOwner.birthday,
                direction: newOwner.direction,
                phone: newOwner.phone,
                dni: null,
                email: null
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Owner, initialOwners.length + 1);
        });

        test('failed to create an owner because there is no name, lastname, birthday, direction and phone', async () => {
            const createResponse = await apiPost(endpointUrl, {});
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Name is required");
            expectBadRequiredBodyAttribute(createResponse, "Lastname is required");
            expectBadRequiredBodyAttribute(createResponse, "Birthday is required");
            expectBadRequiredBodyAttribute(createResponse, "Direction is required");
            expectBadRequiredBodyAttribute(createResponse, "Phone is required");
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Owner, initialOwners.length);
        });
    });

    describe('update an owner', () => {
        const endpointUrl = (ownerId) => `/owners/${ownerId}`;

        test('owner updated successfully', async () => {
            const newOwner = { 
                name: "Diego",
                lastname: "Manco",
                birthday: "2015-05-24",
                direction: "Av. Example 534 - Estados Unidos",
                phone: "991724597",
                dni: "760857612",
                email: "diego@example.com"
            };
            const updateResponse = await apiPut(endpointUrl(initOwners[1].id), newOwner);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                name: newOwner.name,
                lastname: newOwner.lastname,
                birthday: newOwner.birthday,
                direction: newOwner.direction,
                phone: newOwner.phone,
                dni: newOwner.dni,
                email: newOwner.email
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('owner updated successfully with no dni and email', async () => {
            const newOwner = { 
                name: "Diego",
                lastname: "Manco",
                birthday: "2015-05-24",
                direction: "Av. Example 534 - Estados Unidos",
                phone: "991724597"
            };
            const updateResponse = await apiPut(endpointUrl(initOwners[1].id), newOwner);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                name: newOwner.name,
                lastname: newOwner.lastname,
                birthday: newOwner.birthday,
                direction: newOwner.direction,
                phone: newOwner.phone,
                dni: null,
                email: null
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update an owner because the owner does not exist', async () => {
            const newOwner = { 
                name: "Diego",
                lastname: "Manco",
                birthday: "2015-05-24",
                direction: "Av. Example 534 - Estados Unidos",
                phone: "991724597"
            };
            const updateResponse = await apiPut(endpointUrl(999), newOwner);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Owner not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update an owner because there is no name, lastname, birthday, direction and phone', async () => {
            const updateResponse = await apiPut(endpointUrl(initOwners[1].id), {});
            expectBadRequestResponse(updateResponse);
            expectBadRequiredBodyAttribute(updateResponse, "Name is required");
            expectBadRequiredBodyAttribute(updateResponse, "Lastname is required");
            expectBadRequiredBodyAttribute(updateResponse, "Birthday is required");
            expectBadRequiredBodyAttribute(updateResponse, "Direction is required");
            expectBadRequiredBodyAttribute(updateResponse, "Phone is required");
        });
    });

    describe('delete an owner', () => {
        const endpointUrl = (ownerId) => `/owners/${ownerId}`;

        test('owner deleted successfully', async () => {
            const deleteResponse = await apiDelete(endpointUrl(initOwners[1].id));
            expectSuccessfulRequestResponse(deleteResponse);

            const expectedBody = {
                id: deleteResponse.body.id,
                name: initOwners[1].name,
                lastname: initOwners[1].lastname,
                birthday: initOwners[1].birthday,
                direction: initOwners[1].direction,
                phone: initOwners[1].phone,
                dni: initOwners[1].dni,
                email: initOwners[1].email
            };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Owner, initialOwners.length - 1);
        });

        test('failed to delete an owner because the owner does not exist', async () => {
            const deleteResponse = await apiDelete(endpointUrl(999));
            expectNotFoundResponse(deleteResponse);
            const expectedBody = { message: 'Owner not found' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Owner, initialOwners.length);
        });
    });

    describe('get an owner by id', () => {
        const endpointUrl = (ownerId) => `/owners/${ownerId}`;

        test('owner returned successfully', async () => {
            const getResponse = await apiGet(endpointUrl(initOwners[1].id));
            expectSuccessfulRequestResponse(getResponse);

            const expectedBody = {
                id: getResponse.body.id,
                name: initOwners[1].name,
                lastname: initOwners[1].lastname,
                birthday: initOwners[1].birthday,
                direction: initOwners[1].direction,
                phone: initOwners[1].phone,
                dni: initOwners[1].dni,
                email: initOwners[1].email
            };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return an owner because the owner does not exist', async () => {
            const getResponse = await apiGet(endpointUrl(999));
            expectNotFoundResponse(getResponse);
            const expectedBody = { message: 'Owner not found' };
            expect(getResponse.body).toEqual(expectedBody);
        });
    });

    describe('get all owners', () => {
        const endpointUrl = '/owners';

        test('all owners returned successfully', async () => {
            const getResponse = await apiGet(endpointUrl);
            expectSuccessfulRequestResponse(getResponse);
            await expectSameArrayBody(getResponse.body, initialOwners, compareOwnerFunc);
        });
    });
});

afterAll(() => {
    sequelize.close();
    server.close();
});