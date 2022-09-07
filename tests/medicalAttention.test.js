import { sequelize } from '../database/connectdb.js';
import { server } from "../index.js";
import { MedicalAttention } from '../models/MedicalAttention.js';
import { Owner } from '../models/Owner.js';
import { Patient } from '../models/Patient.js';
import { Profile } from '../models/Profile.js';
import { Species } from '../models/Species.js';
import { User } from '../models/User.js';
import { after1s, apiDelete, apiDeleteWithAuth, apiGet, apiGetWithAuth, apiLoginTestUser, apiLoginUser, apiPost, apiPostWithAuth, apiPut, apiPutWithAuth, apiRegisterUser, compareEventFunc, compareEventTypeFunc, compareMedicalAttentionFunc, compareOwnerFunc, comparePatientFunc, compareProfileFunc, compareSpeciesFunc, compareUserFunc, ensureOnlyInitialInstancesExist, expectBadRequestResponse, expectBadRequiredBodyAttribute, expectLengthOfDatabaseInstancesToBeTheSameWith, expectNotFoundResponse, expectOnlyInitialInstancesInDatabase, expectSameArrayBody, expectSuccessfulCreation, expectSuccessfulRequestResponse, expectTokenErrorMessageReceived, expectTokenExpiredErrorMessageReceived, expectUnauthorizedResponse, initialEvents, initialEventTypes, initialMedicalAttentions, initialOwners, initialPatients, initialProfiles, initialSpecies, initialSubspecies, initialUsers } from './testCommon.js';

const initialSpeciesAndSubspecies = initialSpecies.concat(initialSubspecies);

let initUsers = [];
let initProfiles = [];
let initPatients = [];
let initMedicalAttentions = [];

describe('medicalAttention endpoints', () => {
    beforeEach(async () => {
        initUsers = await ensureOnlyInitialInstancesExist(User, initialUsers, compareUserFunc);
        initProfiles = await ensureOnlyInitialInstancesExist(Profile, initialProfiles, compareProfileFunc);
        await ensureOnlyInitialInstancesExist(Species, initialSpecies, compareSpeciesFunc);
        await ensureOnlyInitialInstancesExist(Species, initialSpeciesAndSubspecies, compareSpeciesFunc);
        await ensureOnlyInitialInstancesExist(Owner, initialOwners, compareOwnerFunc);
        initPatients = await ensureOnlyInitialInstancesExist(Patient, initialPatients, comparePatientFunc);
        initMedicalAttentions = await ensureOnlyInitialInstancesExist(MedicalAttention, initialMedicalAttentions, compareMedicalAttentionFunc);

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

        test('expected initial medicalAttentions', async () => {
            await expectOnlyInitialInstancesInDatabase(MedicalAttention, initialMedicalAttentions, compareMedicalAttentionFunc);
        });
    });

    describe('register a new medicalAttention', () => {
        const endpointUrl = '/medicalAttentions';

        test('medicalAttention created successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newMedicalAttention = {
                weight: 80,
                description: "El paciente tiene tos",
                date: "2020-03-17",
                resultNotes: "Si hay cura",
                patientId: initPatients[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newMedicalAttention);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                weight: `${newMedicalAttention.weight}`,
                description: newMedicalAttention.description,
                date: newMedicalAttention.date,
                resultNotes: newMedicalAttention.resultNotes,
                patientId: `${initPatients[1].id}`,
                profileId: initProfiles.find(p => p.userId === initUsers[1].id).id,
                createdAt: createResponse.body.createdAt,
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(MedicalAttention, initialMedicalAttentions.length + 1);
        });

        test('failed to create a medicalAttention because the patient does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newMedicalAttention = {
                weight: 80,
                description: "El paciente tiene tos",
                date: "2020-03-17",
                resultNotes: "Si hay cura",
                patientId: 999,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newMedicalAttention);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Patient not found' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(MedicalAttention, initialMedicalAttentions.length);
        });

        test('failed to create a medicalAttention because the profile does not exist', async () => {
            const newUser = { email: "newemail@example.com", password: "newPassword#123" };
            const accessToken = (await apiRegisterUser(newUser)).body.accessToken;
            const newMedicalAttention = {
                weight: 80,
                description: "El paciente tiene tos",
                date: "2020-03-17",
                resultNotes: "Si hay cura",
                patientId: initPatients[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newMedicalAttention);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Profile not found for this user' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(MedicalAttention, initialMedicalAttentions.length);
        });

        test('failed to create a medicalAttention because there is no weight, description, date, resultNotes and patientId', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, {});
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Weight is required");
            expectBadRequiredBodyAttribute(createResponse, "Description is required");
            expectBadRequiredBodyAttribute(createResponse, "Date is required");
            expectBadRequiredBodyAttribute(createResponse, "Result notes are required");
            expectBadRequiredBodyAttribute(createResponse, "Patient id is required");
            await expectLengthOfDatabaseInstancesToBeTheSameWith(MedicalAttention, initialMedicalAttentions.length);
        });

        test('failed to create a medicalAttention because there is no accessToken', async () => {
            const newMedicalAttention = {
                weight: 80,
                description: "El paciente tiene tos",
                date: "2020-03-17",
                resultNotes: "Si hay cura",
                patientId: initPatients[1].id,
            };
            const createResponse = await apiPost(endpointUrl, newMedicalAttention);
            expectUnauthorizedResponse(createResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(MedicalAttention, initialMedicalAttentions.length);
        });

        test('failed to create a medicalAttention because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const newMedicalAttention = {
                weight: 80,
                description: "El paciente tiene tos",
                date: "2020-03-17",
                resultNotes: "Si hay cura",
                patientId: initPatients[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, accessToken, newMedicalAttention);
            expectUnauthorizedResponse(createResponse);
            expectTokenErrorMessageReceived(createResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(MedicalAttention, initialMedicalAttentions.length);
        });

        test('failed to create a medicalAttention because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const newMedicalAttention = {
                weight: 80,
                description: "El paciente tiene tos",
                date: "2020-03-17",
                resultNotes: "Si hay cura",
                patientId: initPatients[1].id,
            };
            const createResponse = await after1s(apiPostWithAuth, endpointUrl, accessToken, newMedicalAttention);  // accessToken expires after 1 second
            expectUnauthorizedResponse(createResponse);
            expectTokenExpiredErrorMessageReceived(createResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(MedicalAttention, initialMedicalAttentions.length);
        });
    });

    describe('update a medicalAttention', () => {
        const endpointUrl = (medicalAttentionId) => `/medicalAttentions/${medicalAttentionId}`;

        test('medicalAttention updated successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newMedicalAttention = {
                weight: 80,
                description: "El paciente tiene tos",
                date: "2020-03-17",
                resultNotes: "Si hay cura",
                patientId: initPatients[1].id,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initMedicalAttentions[1].id), accessToken, newMedicalAttention);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                weight: `${newMedicalAttention.weight}`,
                description: newMedicalAttention.description,
                date: newMedicalAttention.date,
                resultNotes: newMedicalAttention.resultNotes,
                patientId: `${initPatients[1].id}`,
                profileId: initProfiles.find(p => p.userId === initUsers[1].id).id,
                createdAt: updateResponse.body.createdAt,
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a medicalAttention because the patient does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newMedicalAttention = {
                weight: 80,
                description: "El paciente tiene tos",
                date: "2020-03-17",
                resultNotes: "Si hay cura",
                patientId: 999,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initMedicalAttentions[1].id), accessToken, newMedicalAttention);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Patient not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a medicalAttention because the profile does not exist', async () => {
            const newUser = { email: "newemail@example.com", password: "newPassword#123" };
            const accessToken = (await apiRegisterUser(newUser)).body.accessToken;
            const newMedicalAttention = {
                weight: 80,
                description: "El paciente tiene tos",
                date: "2020-03-17",
                resultNotes: "Si hay cura",
                patientId: initPatients[1].id,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initMedicalAttentions[1].id), accessToken, newMedicalAttention);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Profile not found for this user' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a medicalAttention because the medicalAttention does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newMedicalAttention = {
                weight: 80,
                description: "El paciente tiene tos",
                date: "2020-03-17",
                resultNotes: "Si hay cura",
                patientId: initPatients[1].id,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(999), accessToken, newMedicalAttention);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Medical attention not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a medicalAttention because there is no weight, description, date, resultNotes and patientId', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const updateResponse = await apiPutWithAuth(endpointUrl(initMedicalAttentions[1].id), accessToken, {});
            expectBadRequestResponse(updateResponse);
            expectBadRequiredBodyAttribute(updateResponse, "Weight is required");
            expectBadRequiredBodyAttribute(updateResponse, "Description is required");
            expectBadRequiredBodyAttribute(updateResponse, "Date is required");
            expectBadRequiredBodyAttribute(updateResponse, "Result notes are required");
            expectBadRequiredBodyAttribute(updateResponse, "Patient id is required");
        });

        test('failed to update a medicalAttention because there is no accessToken', async () => {
            const newMedicalAttention = {
                weight: 80,
                description: "El paciente tiene tos",
                date: "2020-03-17",
                resultNotes: "Si hay cura",
                patientId: initPatients[1].id,
            };
            const updateResponse = await apiPut(endpointUrl(initMedicalAttentions[1].id), newMedicalAttention);
            expectUnauthorizedResponse(updateResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a medicalAttention because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const newMedicalAttention = {
                weight: 80,
                description: "El paciente tiene tos",
                date: "2020-03-17",
                resultNotes: "Si hay cura",
                patientId: initPatients[1].id,
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initMedicalAttentions[1].id), accessToken, newMedicalAttention);
            expectUnauthorizedResponse(updateResponse);
            expectTokenErrorMessageReceived(updateResponse);
        });

        test('failed to update a medicalAttention because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const newMedicalAttention = {
                weight: 80,
                description: "El paciente tiene tos",
                date: "2020-03-17",
                resultNotes: "Si hay cura",
                patientId: initPatients[1].id,
            };
            const updateResponse = await after1s(apiPutWithAuth, endpointUrl(initMedicalAttentions[1].id), accessToken, newMedicalAttention);  // accessToken expires after 1 second
            expectUnauthorizedResponse(updateResponse);
            expectTokenExpiredErrorMessageReceived(updateResponse);
        });
    });

    describe('delete a medicalAttention', () => {
        const endpointUrl = (medicalAttentionId) => `/medicalAttentions/${medicalAttentionId}`;

        test('medicalAttention deleted successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(initMedicalAttentions[1].id), accessToken);
            expectSuccessfulRequestResponse(deleteResponse);
            const expectedBody = {
                id: deleteResponse.body.id,
                weight: initMedicalAttentions[1].weight,
                description: initMedicalAttentions[1].description,
                date: initMedicalAttentions[1].date,
                resultNotes: initMedicalAttentions[1].resultNotes,
                patientId: initMedicalAttentions[1].patientId,
                profileId: initMedicalAttentions[1].profileId,
                createdAt: deleteResponse.body.createdAt,
            };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(MedicalAttention, initialMedicalAttentions.length - 1);
        });

        test('failed to delete a medicalAttention because the medicalAttention does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(999), accessToken);
            expectNotFoundResponse(deleteResponse);
            const expectedBody = { message: 'Medical attention not found' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(MedicalAttention, initialMedicalAttentions.length);
        });

        test('failed to delete an event because there is no accessToken', async () => {
            const deleteResponse = await apiDelete(endpointUrl(initMedicalAttentions[1].id));
            expectUnauthorizedResponse(deleteResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(MedicalAttention, initialMedicalAttentions.length);
        });

        test('failed to delete an event because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(initMedicalAttentions[1].id), accessToken);
            expectUnauthorizedResponse(deleteResponse);
            expectTokenErrorMessageReceived(deleteResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(MedicalAttention, initialMedicalAttentions.length);
        });

        test('failed to delete an event because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const deleteResponse = await after1s(apiDeleteWithAuth, endpointUrl(initMedicalAttentions[1].id), accessToken);  // accessToken expires after 1 second
            expectUnauthorizedResponse(deleteResponse);
            expectTokenExpiredErrorMessageReceived(deleteResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(MedicalAttention, initialMedicalAttentions.length);
        });
    });

    describe('get a medicalAttention by id', () => {
        const endpointUrl = (medicalAttentionId) => `/medicalAttentions/${medicalAttentionId}`;

        test('medicalAttention returned successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(initMedicalAttentions[1].id), accessToken);
            expectSuccessfulRequestResponse(getResponse);
            const expectedBody = {
                id: getResponse.body.id,
                weight: initMedicalAttentions[1].weight,
                description: initMedicalAttentions[1].description,
                date: initMedicalAttentions[1].date,
                resultNotes: initMedicalAttentions[1].resultNotes,
                patientId: initMedicalAttentions[1].patientId,
                profileId: initMedicalAttentions[1].profileId,
                createdAt: getResponse.body.createdAt,
            };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return a medicalAttention because the medicalAttention does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(999), accessToken);
            expectNotFoundResponse(getResponse);
            const expectedBody = { message: 'Medical attention not found' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return a medicalAttention because there is no accessToken', async () => {
            const getResponse = await apiGet(endpointUrl(initMedicalAttentions[1].id));
            expectUnauthorizedResponse(getResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return a medicalAttention because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const getResponse = await apiGetWithAuth(endpointUrl(initMedicalAttentions[1].id), accessToken);
            expectUnauthorizedResponse(getResponse);
            expectTokenErrorMessageReceived(getResponse);
        });

        test('failed to return a medicalAttention because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const getResponse = await after1s(apiGetWithAuth, endpointUrl(initMedicalAttentions[1].id), accessToken);  // accessToken expires after 1 second
            expectUnauthorizedResponse(getResponse);
            expectTokenExpiredErrorMessageReceived(getResponse);
        });
    });

    describe('get all medicalAttentions by patientId', () => {
        const endpointUrl = (patientId) => `/medicalAttentions/patient/${patientId}`;

        test('all medicalAttentions returned successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(initPatients[1].id), accessToken);
            expectSuccessfulRequestResponse(getResponse);
            await expectSameArrayBody(getResponse.body, initialMedicalAttentions, compareMedicalAttentionFunc);
        });

        test('failed to return all medicalAttentions because the patient does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(999), accessToken);
            expectNotFoundResponse(getResponse);
            const expectedBody = { message: 'Patient not found' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return all medicalAttentions because there is no accessToken', async () => {
            const getResponse = await apiGet(endpointUrl(initPatients[1].id));
            expectUnauthorizedResponse(getResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return all medicalAttentions because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const getResponse = await apiGetWithAuth(endpointUrl(initPatients[1].id), accessToken);
            expectUnauthorizedResponse(getResponse);
            expectTokenErrorMessageReceived(getResponse);
        });

        test('failed to return all events because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const getResponse = await after1s(apiGetWithAuth, endpointUrl(initPatients[1].id), accessToken);  // accessToken expires after 1 second
            expectUnauthorizedResponse(getResponse);
            expectTokenExpiredErrorMessageReceived(getResponse);
        });
    });
});

afterAll(() => {
    sequelize.close();
    server.close();
});