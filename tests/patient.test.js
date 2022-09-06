import { sequelize } from '../database/connectdb.js';
import { server } from "../index.js";
import { Owner } from '../models/Owner.js';
import { Patient } from '../models/Patient.js';
import { Profile } from '../models/Profile.js';
import { Species } from '../models/Species.js';
import { User } from '../models/User.js';
import { after1s, apiDelete, apiDeleteWithAuth, apiGet, apiGetWithAuth, apiLoginTestUser, apiLoginUser, apiPost, apiPostWithAuth, apiPut, apiPutWithAuth, apiRegisterUser, compareOwnerFunc, comparePatientFunc, compareProfileFunc, compareSpeciesFunc, compareUserFunc, ensureOnlyInitialInstancesExist, expectBadRequestResponse, expectBadRequiredBodyAttribute, expectLengthOfDatabaseInstancesToBeTheSameWith, expectNotFoundResponse, expectOnlyInitialInstancesInDatabase, expectSameArrayBody, expectSuccessfulCreation, expectSuccessfulRequestResponse, expectTokenErrorMessageReceived, expectTokenExpiredErrorMessageReceived, expectUnauthorizedResponse, initialOwners, initialPatients, initialProfiles, initialSpecies, initialSubspecies, initialUsers } from './testCommon.js';

const initialSpeciesAndSubspecies = initialSpecies.concat(initialSubspecies);

let initUsers = [];
let initProfiles = [];
let initOwners = [];
let initSubspecies = [];
let initPatients = [];

describe('patient endpoints', () => {
    beforeEach(async () => {
        initUsers = await ensureOnlyInitialInstancesExist(User, initialUsers, compareUserFunc);
        initProfiles = await ensureOnlyInitialInstancesExist(Profile, initialProfiles, compareProfileFunc);
        await ensureOnlyInitialInstancesExist(Species, initialSpecies, compareSpeciesFunc);
        initSubspecies = await ensureOnlyInitialInstancesExist(Species, initialSpeciesAndSubspecies, compareSpeciesFunc);
        initOwners = await ensureOnlyInitialInstancesExist(Owner, initialOwners, compareOwnerFunc);
        initPatients = await ensureOnlyInitialInstancesExist(Patient, initialPatients, comparePatientFunc);
        
        initSubspecies = initSubspecies.filter(s => (s.speciesId));
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
    });

    describe('register a new patient', () => {
        const endpointUrl = '/patients';

        test('patient created successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                dayOfDeath: "2022-06-21",
                mainPicture: "https://www.exampleSiu.com/image.png",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newPatient);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                name: newPatient.name,
                weight: `${newPatient.weight}`,
                birthday: newPatient.birthday,
                dayOfDeath: newPatient.dayOfDeath,
                mainPicture: newPatient.mainPicture,
                subspeciesId: `${initSubspecies[1].id}`,
                ownerId: `${initOwners[1].id}`,
                profileId: initProfiles[1].id,
                createdAt: `${createResponse.body.createdAt}`,
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initialPatients.length + 1);
        });

        test('patient created successfully with no dayOfDeath, mainPicture', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newPatient);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                name: newPatient.name,
                weight: `${newPatient.weight}`,
                birthday: newPatient.birthday,
                dayOfDeath: null,
                mainPicture: null,
                subspeciesId: `${initSubspecies[1].id}`,
                ownerId: `${initOwners[1].id}`,
                profileId: initProfiles[1].id,
                createdAt: `${createResponse.body.createdAt}`,
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initialPatients.length + 1);
        });

        test('failed to create a patient because the owner does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: 999,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newPatient);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Owner not found' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initialPatients.length);
        });

        test('failed to create a patient because the subspecies does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: 999,
                ownerId: initOwners[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newPatient);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Subspecies not found' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initialPatients.length);
        });

        test('failed to create a patient because the profile does not exist', async () => {
            const newUser = { email: "newemail@example.com", password: "newPassword#123" };
            const accessToken = (await apiRegisterUser(newUser)).body.accessToken;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newPatient);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Profile not found for this user' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initialPatients.length);
        });

        test('failed to create a patient because there is no name, weight and birthday', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const newPatient = { dayOfDeath: "2022-06-21", mainPicture: "https://www.exampleSiu.com/image.png" };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newPatient);
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Name is required");
            expectBadRequiredBodyAttribute(createResponse, "Weight is required");
            expectBadRequiredBodyAttribute(createResponse, "Birthday is required");
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initialPatients.length);
        });

        test('failed to create a patient because the data types of name, weight, birthday, dayOfDeath and mainPicture are incorrect', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;

            const newPatient = {
                name: false,
                weight: false,
                birthday: false,
                dayOfDeath: false,
                mainPicture: false,
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newPatient);
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Weight must be a float number");
            expectBadRequiredBodyAttribute(createResponse, "Birthday must be a date");
            expectBadRequiredBodyAttribute(createResponse, "Day of death must be a date");
            expectBadRequiredBodyAttribute(createResponse, "Main picture must be a url");
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initialPatients.length);
        });

        test('failed to create a patient because there is no accessToken', async () => {
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const createResponse = await apiPost(endpointUrl, newPatient);
            expectUnauthorizedResponse(createResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initialPatients.length);
        });

        test('failed to create a patient because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newPatient);
            expectUnauthorizedResponse(createResponse);
            expectTokenErrorMessageReceived(createResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length);
        });

        test('failed to create a patient because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const createResponse = await after1s(apiPostWithAuth, endpointUrl, accessToken, newPatient);  // accessToken expires after 1 second
            expectUnauthorizedResponse(createResponse);
            expectTokenExpiredErrorMessageReceived(createResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length);
        });
    });

    describe('update a patient', () => {
        const endpointUrl = (patientId) => `/patients/${patientId}`;

        test('patient updated successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                dayOfDeath: "2022-06-21",
                mainPicture: "https://www.exampleSiu.com/image.png",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initPatients[1].id), accessToken, newPatient);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                name: newPatient.name,
                weight: `${newPatient.weight}`,
                birthday: newPatient.birthday,
                dayOfDeath: newPatient.dayOfDeath,
                mainPicture: newPatient.mainPicture,
                subspeciesId: `${initSubspecies[1].id}`,
                ownerId: `${initOwners[1].id}`,
                profileId: updateResponse.body.profileId,
                createdAt: `${updateResponse.body.createdAt}`,
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('patient updated successfully with no dayOfDeath, mainPicture', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initPatients[1].id), accessToken, newPatient);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                name: newPatient.name,
                weight: `${newPatient.weight}`,
                birthday: newPatient.birthday,
                dayOfDeath: null,
                mainPicture: null,
                subspeciesId: `${initSubspecies[1].id}`,
                ownerId: `${initOwners[1].id}`,
                profileId: updateResponse.body.profileId,
                createdAt: `${updateResponse.body.createdAt}`,
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a patient because the patient does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: 999,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(999), accessToken, newPatient);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Patient not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a patient because the owner does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: 999,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initPatients[1].id), accessToken, newPatient);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Owner not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a patient because the subspecies does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: 999,
                ownerId: initOwners[1].id,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initPatients[1].id), accessToken, newPatient);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Subspecies not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a patient because there is no name, weight and birthday', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const newPatient = { dayOfDeath: "2022-06-21", mainPicture: "https://www.exampleSiu.com/image.png" };
            const updateResponse = await apiPutWithAuth(endpointUrl(initPatients[1].id), accessToken, newPatient);
            expectBadRequestResponse(updateResponse);
            expectBadRequiredBodyAttribute(updateResponse, "Name is required");
            expectBadRequiredBodyAttribute(updateResponse, "Weight is required");
            expectBadRequiredBodyAttribute(updateResponse, "Birthday is required");
        });

        test('failed to update a patient because the data types of name, weight, birthday, dayOfDeath and mainPicture are incorrect', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const newPatient = {
                name: false,
                weight: false,
                birthday: false,
                dayOfDeath: false,
                mainPicture: false,
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initPatients[1].id), accessToken, newPatient);
            expectBadRequestResponse(updateResponse);
            expectBadRequiredBodyAttribute(updateResponse, "Weight must be a float number");
            expectBadRequiredBodyAttribute(updateResponse, "Birthday must be a date");
            expectBadRequiredBodyAttribute(updateResponse, "Day of death must be a date");
            expectBadRequiredBodyAttribute(updateResponse, "Main picture must be a url");
        });

        test('failed to update a patient because there is no accessToken', async () => {
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const updateResponse = await apiPut(endpointUrl(initPatients[1].id), newPatient);
            expectUnauthorizedResponse(updateResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a patient because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initPatients[1].id), accessToken, newPatient);
            expectUnauthorizedResponse(updateResponse);
            expectTokenErrorMessageReceived(updateResponse);
        });

        test('failed to update a patient because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const updateResponse = await after1s(apiPutWithAuth, endpointUrl(initPatients[1].id), accessToken, newPatient);  // accessToken expires after 1 second
            expectUnauthorizedResponse(updateResponse);
            expectTokenExpiredErrorMessageReceived(updateResponse);
        });
    });

    describe('delete a patient', () => {
        const endpointUrl = (patientId) => `/patients/${patientId}`;

        test('patient deleted successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(initPatients[1].id), accessToken);
            expectSuccessfulRequestResponse(deleteResponse);
            const expectedBody = {
                id: deleteResponse.body.id,
                name: initPatients[1].name,
                weight: initPatients[1].weight,
                birthday: initPatients[1].birthday,
                dayOfDeath: initPatients[1].dayOfDeath,
                mainPicture: initPatients[1].mainPicture,
                subspeciesId: initPatients[1].subspeciesId,
                ownerId: initPatients[1].ownerId,
                profileId: initPatients[1].profileId,
                createdAt: `${deleteResponse.body.createdAt}`,
            };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initPatients.length - 1);
        });

        test('failed to delete a patient because the patient does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(999), accessToken);
            expectNotFoundResponse(deleteResponse);
            const expectedBody = { message: 'Patient not found' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initPatients.length);
        });

        test('failed to delete a patient because there is no accessToken', async () => {
            const deleteResponse = await apiDelete(endpointUrl(initPatients[1].id));
            expectUnauthorizedResponse(deleteResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initPatients.length);
        });

        test('failed to delete a patient because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(initPatients[1].id), accessToken);
            expectUnauthorizedResponse(deleteResponse);
            expectTokenErrorMessageReceived(deleteResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initPatients.length);
        });

        test('failed to delete a patient because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const deleteResponse = await after1s(apiDeleteWithAuth, endpointUrl(initPatients[1].id), accessToken);  // accessToken expires after 1 second
            expectUnauthorizedResponse(deleteResponse);
            expectTokenExpiredErrorMessageReceived(deleteResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initPatients.length);
        });
    });

    describe('get a patient by id', () => {
        const endpointUrl = (patientId) => `/patients/${patientId}`;

        test('patient returned successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(initPatients[1].id), accessToken);
            expectSuccessfulRequestResponse(getResponse);
            const expectedBody = {
                id: getResponse.body.id,
                name: initPatients[1].name,
                weight: initPatients[1].weight,
                birthday: initPatients[1].birthday,
                dayOfDeath: initPatients[1].dayOfDeath,
                mainPicture: initPatients[1].mainPicture,
                subspeciesId: initPatients[1].subspeciesId,
                ownerId: initPatients[1].ownerId,
                profileId: initPatients[1].profileId,
                createdAt: `${getResponse.body.createdAt}`,
            };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return a patient because the patient does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(999), accessToken);
            expectNotFoundResponse(getResponse);
            const expectedBody = { message: 'Patient not found' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return a patient because there is no accessToken', async () => {
            const getResponse = await apiGet(endpointUrl(initPatients[1].id));
            expectUnauthorizedResponse(getResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return a patient because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const getResponse = await apiGetWithAuth(endpointUrl(initPatients[1].id), accessToken);
            expectUnauthorizedResponse(getResponse);
            expectTokenErrorMessageReceived(getResponse);
        });

        test('failed to return a patient because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const getResponse = await after1s(apiGetWithAuth, endpointUrl(initPatients[1].id), accessToken);  // accessToken expires after 1 second
            expectUnauthorizedResponse(getResponse);
            expectTokenExpiredErrorMessageReceived(getResponse);
        });
    });

    describe('get all patients', () => {
        const endpointUrl = '/patients';

        test('all patients returned successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl, accessToken);
            expectSuccessfulRequestResponse(getResponse);
            await expectSameArrayBody(getResponse.body, initialPatients, comparePatientFunc);
        });

        test('failed to return all patients because there is no accessToken', async () => {
            const getResponse = await apiGet(endpointUrl);
            expectUnauthorizedResponse(getResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return all patients because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const getResponse = await apiGetWithAuth(endpointUrl, accessToken);
            expectUnauthorizedResponse(getResponse);
            expectTokenErrorMessageReceived(getResponse);
        });

        test('failed to return all patients because the accessToken is expired', async () => {
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