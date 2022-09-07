import { sequelize } from '../database/connectdb.js';
import { server } from "../index.js";
import { EventType } from '../models/EventType.js';
import { apiDelete, apiGet, apiPost, apiPut, compareEventTypeFunc, ensureOnlyInitialInstancesExist, expectBadRequestResponse, expectBadRequiredBodyAttribute, expectLengthOfDatabaseInstancesToBeTheSameWith, expectNotFoundResponse, expectOnlyInitialInstancesInDatabase, expectSameArrayBody, expectSuccessfulCreation, expectSuccessfulRequestResponse, initialEventTypes } from './testCommon.js';

let initEventTypes = [];

describe('event type endpoints', () => {
    beforeEach(async () => {
        initEventTypes = await ensureOnlyInitialInstancesExist(EventType, initialEventTypes, compareEventTypeFunc);
    });

    describe('test scenary ready', () => {
        test('expected initial eventTypes', async () => {
            await expectOnlyInitialInstancesInDatabase(EventType, initialEventTypes, compareEventTypeFunc);
        });
    });

    describe('register a new eventType', () => {
        const endpointUrl = '/eventTypes';

        test('eventType created successfully', async () => {
            const newEventType = { name: "Algo más", typeColor: "#000000" };
            const createResponse = await apiPost(endpointUrl, newEventType);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                name: newEventType.name,
                typeColor: newEventType.typeColor
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(EventType, initialEventTypes.length + 1);
        });

        test('failed to create eventType because there is already another eventType with the same name', async () => {
            const createResponse = await apiPost(endpointUrl, initialEventTypes[1]);
            expectBadRequestResponse(createResponse);
            const expectedBody = { message: 'Event type already exists' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(EventType, initialEventTypes.length);
        });

        test('failed to create a eventType because there is no name and typeColor', async () => {
            const createResponse = await apiPost(endpointUrl, {});
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Name is required");
            expectBadRequiredBodyAttribute(createResponse, "Type color is required");
            await expectLengthOfDatabaseInstancesToBeTheSameWith(EventType, initialEventTypes.length);
        });
    });

    describe('update an eventType', () => {
        const endpointUrl = (eventTypeId) => `/eventTypes/${eventTypeId}`;

        test('eventType updated successfully', async () => {
            const newEventType = { name: "Algo más", typeColor: "#000000" };
            const updateResponse = await apiPut(endpointUrl(initEventTypes[0].id), newEventType);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                name: newEventType.name,
                typeColor: newEventType.typeColor
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update an eventType because there is already another eventType with the same name', async () => {
            const updateResponse = await apiPut(endpointUrl(initEventTypes[1].id), initialEventTypes.find(e => e.name !== initEventTypes[1].name));
            expectBadRequestResponse(updateResponse);
            const expectedBody = { message: 'Another event type already exists with this name' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update an eventType because the eventType does not exist', async () => {
            const newEventType = { name: "Algo más", typeColor: "#000000" };
            const updateResponse = await apiPut(endpointUrl(999), newEventType);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Event type not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update an eventType because there is no name and typeColor', async () => {
            const updateResponse = await apiPut(endpointUrl(initEventTypes[1].id), {});
            expectBadRequestResponse(updateResponse);
            expectBadRequiredBodyAttribute(updateResponse, "Name is required");
            expectBadRequiredBodyAttribute(updateResponse, "Type color is required");
        });
    });

    describe('delete an eventType', () => {
        const endpointUrl = (eventTypeId) => `/eventTypes/${eventTypeId}`;

        test('eventType deleted successfully', async () => {
            const deleteResponse = await apiDelete(endpointUrl(initEventTypes[1].id));
            expectSuccessfulRequestResponse(deleteResponse);

            const expectedBody = {
                id: deleteResponse.body.id,
                name: initEventTypes[1].name,
                typeColor: initEventTypes[1].typeColor,
            };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(EventType, initialEventTypes.length - 1);
        });

        test('failed to delete an eventTypes because the eventTypes does not exist', async () => {
            const deleteResponse = await apiDelete(endpointUrl(999));
            expectNotFoundResponse(deleteResponse);
            const expectedBody = { message: 'Event type not found' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(EventType, initialEventTypes.length);
        });
    });

    describe('get all eventTypes', () => {
        const endpointUrl = '/eventTypes';

        test('all eventTypes returned successfully', async () => {
            const getResponse = await apiGet(endpointUrl);
            expectSuccessfulRequestResponse(getResponse);
            await expectSameArrayBody(getResponse.body, initEventTypes.map(e => {
                return { id: e.id, name: e.name, typeColor: e.typeColor };
            }), compareEventTypeFunc);
        });
    });
});

afterAll(() => {
    sequelize.close();
    server.close();
});