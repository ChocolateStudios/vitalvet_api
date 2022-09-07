import { sequelize } from '../database/connectdb.js';
import { server } from "../index.js";
import { Event } from '../models/Event.js';
import { EventType } from '../models/EventType.js';
import { Owner } from '../models/Owner.js';
import { Patient } from '../models/Patient.js';
import { Profile } from '../models/Profile.js';
import { Species } from '../models/Species.js';
import { User } from '../models/User.js';
import { after1s, apiDelete, apiDeleteWithAuth, apiGet, apiGetWithAuth, apiLoginTestUser, apiLoginUser, apiPost, apiPostWithAuth, apiPut, apiPutWithAuth, apiRegisterUser, compareEventFunc, compareEventTypeFunc, compareOwnerFunc, comparePatientFunc, compareProfileFunc, compareSpeciesFunc, compareUserFunc, ensureOnlyInitialInstancesExist, expectBadRequestResponse, expectBadRequiredBodyAttribute, expectLengthOfDatabaseInstancesToBeTheSameWith, expectNotFoundResponse, expectOnlyInitialInstancesInDatabase, expectSameArrayBody, expectSuccessfulCreation, expectSuccessfulRequestResponse, expectTokenErrorMessageReceived, expectTokenExpiredErrorMessageReceived, expectUnauthorizedResponse, initialEvents, initialEventTypes, initialOwners, initialPatients, initialProfiles, initialSpecies, initialSubspecies, initialUsers } from './testCommon.js';

const initialSpeciesAndSubspecies = initialSpecies.concat(initialSubspecies);

let initUsers = [];
let initProfiles = [];
let initPatients = [];
let initEventTypes = [];
let initEvents = [];

describe('event endpoints', () => {
    beforeEach(async () => {
        initUsers = await ensureOnlyInitialInstancesExist(User, initialUsers, compareUserFunc);
        initProfiles = await ensureOnlyInitialInstancesExist(Profile, initialProfiles, compareProfileFunc);
        await ensureOnlyInitialInstancesExist(Species, initialSpecies, compareSpeciesFunc);
        await ensureOnlyInitialInstancesExist(Species, initialSpeciesAndSubspecies, compareSpeciesFunc);
        await ensureOnlyInitialInstancesExist(Owner, initialOwners, compareOwnerFunc);
        initPatients = await ensureOnlyInitialInstancesExist(Patient, initialPatients, comparePatientFunc);
        initEventTypes = await ensureOnlyInitialInstancesExist(EventType, initialEventTypes, compareEventTypeFunc);
        initEvents = await ensureOnlyInitialInstancesExist(Event, initialEvents, compareEventFunc);
    });

    describe('test scenary ready', () => {
        test('expected initial users', async () => {
            await expectOnlyInitialInstancesInDatabase(User, initialUsers, compareUserFunc);
        });

        test('expected initial profiles', async () => {
            await expectOnlyInitialInstancesInDatabase(Profile, initialProfiles, compareProfileFunc);
        });

        test('expected initial species', async () => {
            await expectOnlyInitialInstancesInDatabase(Species, initialSpeciesAndSubspecies, compareSpeciesFunc);
        });

        test('expected initial owners', async () => {
            await expectOnlyInitialInstancesInDatabase(Owner, initialOwners, compareOwnerFunc);
        });

        test('expected initial patients', async () => {
            await expectOnlyInitialInstancesInDatabase(Patient, initialPatients, comparePatientFunc);
        });

        test('expected initial eventTypes', async () => {
            await expectOnlyInitialInstancesInDatabase(EventType, initialEventTypes, compareEventTypeFunc);
        });

        test('expected initial events', async () => {
            await expectOnlyInitialInstancesInDatabase(Event, initialEvents, compareEventFunc);
        });
    });

    describe('register a new event', () => {
        const endpointUrl = '/events';

        test('event created successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2019-03-17T00:00:00.000Z",
                endTime: "2019-03-17T00:00:00.000Z",
                patientId: initPatients[1].id,
                eventTypeId: initEventTypes[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newEvent);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                title: newEvent.title,
                description: newEvent.description,
                startTime: newEvent.startTime,
                endTime: newEvent.endTime,
                patientId: `${initPatients[1].id}`,
                profileId: initProfiles[1].id,
                eventTypeId: `${initEventTypes[1].id}`,
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Event, initialEvents.length + 1);
        });

        test('event created successfully with no endTime and patientId', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2015-05-25T00:09:00.000Z",
                eventTypeId: initEventTypes[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newEvent);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                title: newEvent.title,
                description: newEvent.description,
                startTime: newEvent.startTime,
                endTime: null,
                patientId: null,
                profileId: initProfiles[1].id,
                eventTypeId: `${initEventTypes[1].id}`,
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Event, initialEvents.length + 1);
        });

        test('failed to create an event because the eventType does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2015-05-25T00:09:00.000Z",
                eventTypeId: 999,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newEvent);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Event type not found' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Event, initialEvents.length);
        });

        test('failed to create an event because the patient does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2015-05-25T00:09:00.000Z",
                patientId: 999,
                eventTypeId: initEventTypes[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newEvent);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Patient not found' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Event, initialEvents.length);
        });

        test('failed to create an event because the profile does not exist', async () => {
            const newUser = { email: "newemail@example.com", password: "newPassword#123" };
            const accessToken = (await apiRegisterUser(newUser)).body.accessToken;
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2015-05-25T00:09:00.000Z",
                eventTypeId: initEventTypes[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newEvent);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Profile not found for this user' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Event, initialEvents.length);
        });

        test('failed to create an event because there is no title, description, startTime and eventTypeId', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const newEvent = { endTime: "2015-05-25T01:10:00.000Z", patientId: initPatients[1].id };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newEvent);
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Title is required");
            expectBadRequiredBodyAttribute(createResponse, "Description is required");
            expectBadRequiredBodyAttribute(createResponse, "Start time is required");
            expectBadRequiredBodyAttribute(createResponse, "Event type id is required");
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Event, initialEvents.length);
        });

        test('failed to create an event because there is no accessToken', async () => {
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2015-05-25T00:09:00.000Z",
                eventTypeId: initEventTypes[1].id,
            };
            const createResponse = await apiPost(endpointUrl, newEvent);
            expectUnauthorizedResponse(createResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Event, initialEvents.length);
        });

        test('failed to create an event because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2015-05-25T00:09:00.000Z",
                eventTypeId: initEventTypes[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newEvent);
            expectUnauthorizedResponse(createResponse);
            expectTokenErrorMessageReceived(createResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Event, initialEvents.length);
        });

        test('failed to create an event because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2015-05-25T00:09:00.000Z",
                eventTypeId: initEventTypes[1].id,
            };
            const createResponse = await after1s(apiPostWithAuth, endpointUrl, accessToken, newEvent);  // accessToken expires after 1 second
            expectUnauthorizedResponse(createResponse);
            expectTokenExpiredErrorMessageReceived(createResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Event, initialEvents.length);
        });
    });

    describe('update an event', () => {
        const endpointUrl = (eventId) => `/events/${eventId}`;

        test('event updated successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2019-03-17T00:00:00.000Z",
                endTime: "2019-03-17T00:00:00.000Z",
                patientId: initPatients[1].id,
                eventTypeId: initEventTypes[1].id,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initEvents[1].id), accessToken, newEvent);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                title: newEvent.title,
                description: newEvent.description,
                startTime: newEvent.startTime,
                endTime: newEvent.endTime,
                patientId: `${initPatients[1].id}`,
                profileId: initProfiles[1].id,
                eventTypeId: `${initEventTypes[1].id}`,
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('event updated successfully with no endTime and patientId', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2019-03-17T00:00:00.000Z",
                eventTypeId: initEventTypes[1].id,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initEvents[1].id), accessToken, newEvent);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                title: newEvent.title,
                description: newEvent.description,
                startTime: newEvent.startTime,
                endTime: null,
                patientId: null,
                profileId: initProfiles[1].id,
                eventTypeId: `${initEventTypes[1].id}`,
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update an event because the eventType does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2019-03-17T00:00:00.000Z",
                eventTypeId: 999,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initEvents[1].id), accessToken, newEvent);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Event type not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update an event because the patient does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2019-03-17T00:00:00.000Z",
                patientId: 999,
                eventTypeId: initEventTypes[1].id,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initEvents[1].id), accessToken, newEvent);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Patient not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update an event because the event does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2019-03-17T00:00:00.000Z",
                eventTypeId: initEventTypes[1].id,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(999), accessToken, newEvent);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Event not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update an event because there is no title, description, startTime and eventTypeId', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const newEvent = { endTime: "2015-05-25T01:10:00.000Z", patientId: initPatients[1].id };
            const updateResponse = await apiPutWithAuth(endpointUrl(initEvents[1].id), accessToken, newEvent);
            expectBadRequestResponse(updateResponse);
            expectBadRequiredBodyAttribute(updateResponse, "Title is required");
            expectBadRequiredBodyAttribute(updateResponse, "Description is required");
            expectBadRequiredBodyAttribute(updateResponse, "Start time is required");
            expectBadRequiredBodyAttribute(updateResponse, "Event type id is required");
        });

        test('failed to update an event because there is no accessToken', async () => {
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2019-03-17T00:00:00.000Z",
                eventTypeId: initEventTypes[1].id,
            };
            const updateResponse = await apiPut(endpointUrl(initEvents[1].id), newEvent);
            expectUnauthorizedResponse(updateResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update an event because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2019-03-17T00:00:00.000Z",
                eventTypeId: initEventTypes[1].id,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initEvents[1].id), accessToken, newEvent);
            expectUnauthorizedResponse(updateResponse);
            expectTokenErrorMessageReceived(updateResponse);
        });

        test('failed to update an event because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const newEvent = {
                title: "Bañar a Simba",
                description: "Baño de pulgas",
                startTime: "2019-03-17T00:00:00.000Z",
                eventTypeId: initEventTypes[1].id,
            };
            const updateResponse = await after1s(apiPutWithAuth, endpointUrl(initEvents[1].id), accessToken, newEvent);  // accessToken expires after 1 second
            expectUnauthorizedResponse(updateResponse);
            expectTokenExpiredErrorMessageReceived(updateResponse);
        });
    });

    describe('delete an event', () => {
        const endpointUrl = (eventId) => `/events/${eventId}`;

        test('event deleted successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(initEvents[1].id), accessToken);
            expectSuccessfulRequestResponse(deleteResponse);
            const expectedBody = {
                id: deleteResponse.body.id,
                title: initEvents[1].title,
                description: initEvents[1].description,
                startTime: `${initEvents[1].startTime.toISOString()}`,
                endTime: `${initEvents[1].endTime.toISOString()}`,
                patientId: initEvents[1].patientId,
                profileId: initEvents[1].profileId,
                eventTypeId: initEvents[1].eventTypeId,
            };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Event, initialEvents.length - 1);
        });

        test('failed to delete an event because the event does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(999), accessToken);
            expectNotFoundResponse(deleteResponse);
            const expectedBody = { message: 'Event not found' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Event, initialEvents.length);
        });

        test('failed to delete an event because there is no accessToken', async () => {
            const deleteResponse = await apiDelete(endpointUrl(initEvents[1].id));
            expectUnauthorizedResponse(deleteResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Event, initialEvents.length);
        });

        test('failed to delete an event because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(initEvents[1].id), accessToken);
            expectUnauthorizedResponse(deleteResponse);
            expectTokenErrorMessageReceived(deleteResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Event, initialEvents.length);
        });

        test('failed to delete an event because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const deleteResponse = await after1s(apiDeleteWithAuth, endpointUrl(initEvents[1].id), accessToken);  // accessToken expires after 1 second
            expectUnauthorizedResponse(deleteResponse);
            expectTokenExpiredErrorMessageReceived(deleteResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Event, initialEvents.length);
        });
    });

    describe('get an event by id', () => {
        const endpointUrl = (eventId) => `/events/${eventId}`;

        test('event returned successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(initEvents[1].id), accessToken);
            expectSuccessfulRequestResponse(getResponse);
            const expectedBody = {
                id: getResponse.body.id,
                title: initEvents[1].title,
                description: initEvents[1].description,
                startTime: `${initEvents[1].startTime.toISOString()}`,
                endTime: `${initEvents[1].endTime.toISOString()}`,
                patientId: initEvents[1].patientId,
                profileId: initEvents[1].profileId,
                eventTypeId: initEvents[1].eventTypeId,
            };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return an event because the event does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(999), accessToken);
            expectNotFoundResponse(getResponse);
            const expectedBody = { message: 'Event not found' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return an event because there is no accessToken', async () => {
            const getResponse = await apiGet(endpointUrl(initEvents[1].id));
            expectUnauthorizedResponse(getResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return an event because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const getResponse = await apiGetWithAuth(endpointUrl(initEvents[1].id), accessToken);
            expectUnauthorizedResponse(getResponse);
            expectTokenErrorMessageReceived(getResponse);
        });

        test('failed to return an event because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const getResponse = await after1s(apiGetWithAuth, endpointUrl(initEvents[1].id), accessToken);  // accessToken expires after 1 second
            expectUnauthorizedResponse(getResponse);
            expectTokenExpiredErrorMessageReceived(getResponse);
        });
    });

    describe('get all events', () => {
        const endpointUrl = '/events';

        test('all events returned successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl, accessToken);
            expectSuccessfulRequestResponse(getResponse);
            await expectSameArrayBody(getResponse.body, initialEvents, compareEventFunc);
        });

        test('failed to return all events because there is no accessToken', async () => {
            const getResponse = await apiGet(endpointUrl);
            expectUnauthorizedResponse(getResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return all events because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const getResponse = await apiGetWithAuth(endpointUrl, accessToken);
            expectUnauthorizedResponse(getResponse);
            expectTokenErrorMessageReceived(getResponse);
        });

        test('failed to return all events because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const getResponse = await after1s(apiGetWithAuth, endpointUrl, accessToken);  // accessToken expires after 1 second
            expectUnauthorizedResponse(getResponse);
            expectTokenExpiredErrorMessageReceived(getResponse);
        });
    });
});

afterAll(() => {
    sequelize.close();
    server.close();
});