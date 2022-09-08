import { sequelize } from '../database/connectdb.js';
import { server } from "../index.js";
import { DocumentFile } from '../models/DocumentFile.js';
import { MedicalAttention } from '../models/MedicalAttention.js';
import { Owner } from '../models/Owner.js';
import { Patient } from '../models/Patient.js';
import { Profile } from '../models/Profile.js';
import { Species } from '../models/Species.js';
import { User } from '../models/User.js';
import { after1s, apiDelete, apiDeleteWithAuth, apiGet, apiGetWithAuth, apiLoginTestUser, apiLoginUser, apiPost, apiPostWithAuth, apiPut, apiPutWithAuth, compareDocumentFileFunc, compareMedicalAttentionFunc, compareOwnerFunc, comparePatientFunc, compareProfileFunc, compareSpeciesFunc, compareUserFunc, ensureInitialInstancesChangesWereDetected, ensureOnlyInitialInstancesExist, expectBadRequestResponse, expectBadRequiredBodyAttribute, expectLengthOfDatabaseInstancesToBeTheSameWith, expectNotFoundResponse, expectOnlyInitialInstancesInDatabase, expectSameArrayBody, expectSuccessfulCreation, expectSuccessfulRequestResponse, expectTokenErrorMessageReceived, expectTokenExpiredErrorMessageReceived, expectUnauthorizedResponse, initialMedicalAttentionDocumentFiles, initialMedicalAttentions, initialOwners, initialPatientDocumentFiles, initialPatients, initialProfiles, initialSpecies, initialSubspecies, initialUsers } from './testCommon.js';

const initialSpeciesAndSubspecies = initialSpecies.concat(initialSubspecies);
const initialPatientAndMedicalAttentionDocumentFiles = initialPatientDocumentFiles.concat(initialMedicalAttentionDocumentFiles);

let initUsers = [];
let initProfiles = [];
let initPatients = [];
let initMedicalAttentions = [];
let initPatientDocumentFiles = [];
let initMedicalAttentionDocumentFiles = [];

describe('documentFile endpoints', () => {
    beforeEach(async () => {
        initUsers = await ensureOnlyInitialInstancesExist(User, initialUsers, compareUserFunc);
        initProfiles = await ensureOnlyInitialInstancesExist(Profile, initialProfiles, compareProfileFunc);
        await ensureOnlyInitialInstancesExist(Species, initialSpecies, compareSpeciesFunc);
        await ensureOnlyInitialInstancesExist(Species, initialSpeciesAndSubspecies, compareSpeciesFunc);
        await ensureOnlyInitialInstancesExist(Owner, initialOwners, compareOwnerFunc);
        initPatients = await ensureOnlyInitialInstancesExist(Patient, initialPatients, comparePatientFunc);
        initMedicalAttentions = await ensureOnlyInitialInstancesExist(MedicalAttention, initialMedicalAttentions, compareMedicalAttentionFunc);
        initPatientDocumentFiles = await ensureOnlyInitialInstancesExist(DocumentFile, initialPatientDocumentFiles, compareDocumentFileFunc);
        initMedicalAttentionDocumentFiles = await ensureOnlyInitialInstancesExist(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles, compareDocumentFileFunc);
        initPatientDocumentFiles = initPatientDocumentFiles.filter(dF => dF.patientId);
        initMedicalAttentionDocumentFiles = initMedicalAttentionDocumentFiles.filter(dF => dF.medicalAttentionId);
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

        test('expected initial documentFiles', async () => {
            await expectOnlyInitialInstancesInDatabase(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles, compareDocumentFileFunc);
        });
    });

    describe('register a new patientDocumentFile', () => {
        const endpointUrl = (patientId) => `/patients/${patientId}/documentFiles`;

        test('patientDocumentFile created successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newDocumentFile = {
                name: "foto de la patita",
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const createResponse = await apiPostWithAuth(endpointUrl(initPatients[1].id), accessToken, newDocumentFile);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                name: newDocumentFile.name,
                link: newDocumentFile.link,
                type: newDocumentFile.type,
                patientId: initPatients[1].id,
                createdAt: createResponse.body.createdAt,
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length + 1);
        });

        test('patientDocumentFile created successfully with no name', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const createResponse = await apiPostWithAuth(endpointUrl(initPatients[1].id), accessToken, newDocumentFile);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                name: null,
                link: newDocumentFile.link,
                type: newDocumentFile.type,
                patientId: initPatients[1].id,
                createdAt: createResponse.body.createdAt,
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length + 1);
        });

        test('failed to create a patientDocumentFile because there is already another patientDocumentFile with the same name', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const patientIdWhereDocumentFileHasName = initPatients.find(p => p.id === initPatientDocumentFiles.find(dF => dF.name).patientId).id;
            const newDocumentFile = {
                name: initPatientDocumentFiles.find(dF => dF.name).name,
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const createResponse = await apiPostWithAuth(endpointUrl(patientIdWhereDocumentFileHasName), accessToken, newDocumentFile);
            expectBadRequestResponse(createResponse);
            const expectedBody = { message: 'Document file already exists for this patient' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to create a patientDocumentFile because the patient does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const createResponse = await apiPostWithAuth(endpointUrl(999), accessToken, newDocumentFile);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Patient not found' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to create a patientDocumentFile because there is no link and type', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const newDocumentFile = { name: "something" };
            const createResponse = await apiPostWithAuth(endpointUrl(initPatients[1].id), accessToken, newDocumentFile);
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Link is required");
            expectBadRequiredBodyAttribute(createResponse, "Type is required");
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to create a patientDocumentFile because there is no accessToken', async () => {
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const createResponse = await apiPost(endpointUrl(initPatients[1].id), newDocumentFile);
            expectUnauthorizedResponse(createResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to create a patientDocumentFile because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const createResponse = await apiPostWithAuth(endpointUrl(initPatients[1].id), accessToken, newDocumentFile);
            expectUnauthorizedResponse(createResponse);
            expectTokenErrorMessageReceived(createResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to create a patientDocumentFile because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const createResponse = await after1s(apiPostWithAuth, endpointUrl(initPatients[1].id), accessToken, newDocumentFile);  // accessToken expires after 1 second
            expectUnauthorizedResponse(createResponse);
            expectTokenExpiredErrorMessageReceived(createResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });
    });

    describe('update a patientDocumentFile', () => {
        const endpointUrl = (patientId, documentFileId) => `/patients/${patientId}/documentFiles/${documentFileId}`;

        test('patientDocumentFile updated successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newDocumentFile = {
                name: "foto de la patita",
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initPatients[1].id, initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id).id), accessToken, newDocumentFile);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                name: newDocumentFile.name,
                link: newDocumentFile.link,
                type: newDocumentFile.type,
                patientId: initPatients[1].id,
                createdAt: updateResponse.body.createdAt,
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('patientDocumentFile updated successfully with no name', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initPatients[1].id, initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id).id), accessToken, newDocumentFile);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                name: null,
                link: newDocumentFile.link,
                type: newDocumentFile.type,
                patientId: initPatients[1].id,
                createdAt: updateResponse.body.createdAt,
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a patientDocumentFile because there is already another patientDocumentFile with the same name', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const patientIdWhereDocumentFileHasName = initPatients.find(p => p.id === initPatientDocumentFiles.find(dF => dF.name).patientId).id;
            const newDocumentFile = {
                name: initPatientDocumentFiles.find(dF => dF.name).name,
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const documentFileIdThatWillHaveSameName = initPatientDocumentFiles.find(dF => dF.name !== newDocumentFile.name && dF.patientId === patientIdWhereDocumentFileHasName).id;
            const updateResponse = await apiPutWithAuth(endpointUrl(patientIdWhereDocumentFileHasName, documentFileIdThatWillHaveSameName), accessToken, newDocumentFile);
            expectBadRequestResponse(updateResponse);
            const expectedBody = { message: 'Document file already exists for this patient' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a patientDocumentFile because the patient does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(999, initPatientDocumentFiles[1].id), accessToken, newDocumentFile);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Patient not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a patientDocumentFile because the documentFile does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initPatients[1].id, 999), accessToken, newDocumentFile);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Document file not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a patientDocumentFile because there is no link and type', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const newDocumentFile = { name: "something" };
            const updateResponse = await apiPutWithAuth(endpointUrl(initPatients[1].id, initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id).id), accessToken, newDocumentFile);
            expectBadRequestResponse(updateResponse);
            expectBadRequiredBodyAttribute(updateResponse, "Link is required");
            expectBadRequiredBodyAttribute(updateResponse, "Type is required");
        });

        test('failed to update a patientDocumentFile because there is no accessToken', async () => {
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const updateResponse = await apiPut(endpointUrl(initPatients[1].id, initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id).id), newDocumentFile);
            expectUnauthorizedResponse(updateResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a patientDocumentFile because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initPatients[1].id, initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id).id), accessToken, newDocumentFile);
            expectUnauthorizedResponse(updateResponse);
            expectTokenErrorMessageReceived(updateResponse);
        });

        test('failed to update a patientDocumentFile because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const updateResponse = await after1s(apiPutWithAuth, endpointUrl(initPatients[1].id, initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id).id), accessToken, newDocumentFile);  // accessToken expires after 1 second
            expectUnauthorizedResponse(updateResponse);
            expectTokenExpiredErrorMessageReceived(updateResponse);
        });
    });

    describe('delete a patientDocumentFile', () => {
        const endpointUrl = (patientId, documentFileId) => `/patients/${patientId}/documentFiles/${documentFileId}`;

        test('patientDocumentFile deleted successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const targetDocumentFile = initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id);
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(initPatients[1].id, targetDocumentFile.id), accessToken);
            expectSuccessfulRequestResponse(deleteResponse);
            const expectedBody = {
                id: deleteResponse.body.id,
                name: targetDocumentFile.name ? targetDocumentFile.name : null,
                link: targetDocumentFile.link,
                type: targetDocumentFile.type,
                patientId: targetDocumentFile.patientId,
                createdAt: deleteResponse.body.createdAt,
            };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length - 1);
        });

        test('failed to delete a patientDocumentFile because the patient does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(999, initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id).id), accessToken);
            expectNotFoundResponse(deleteResponse);
            const expectedBody = { message: 'Patient not found' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to delete a patientDocumentFile because the documentFile does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(initPatients[1].id, 999), accessToken);
            expectNotFoundResponse(deleteResponse);
            const expectedBody = { message: 'Document file not found' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to delete a patientDocumentFile because there is no accessToken', async () => {
            const deleteResponse = await apiDelete(endpointUrl(initPatients[1].id, initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id).id));
            expectUnauthorizedResponse(deleteResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to delete a patientDocumentFile because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(initPatients[1].id, initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id).id), accessToken);
            expectUnauthorizedResponse(deleteResponse);
            expectTokenErrorMessageReceived(deleteResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to delete a patientDocumentFile because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const deleteResponse = await after1s(apiDeleteWithAuth, endpointUrl(initPatients[1].id, initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id).id), accessToken);  // accessToken expires after 1 second
            expectUnauthorizedResponse(deleteResponse);
            expectTokenExpiredErrorMessageReceived(deleteResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });
    });

    describe('get a patientDocumentFile by patient id and document file id', () => {
        const endpointUrl = (patientId, documentFileId) => `/patients/${patientId}/documentFiles/${documentFileId}`;

        test('patientDocumentFile returned successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const targetDocumentFile = initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id);
            const getResponse = await apiGetWithAuth(endpointUrl(initPatients[1].id, targetDocumentFile.id), accessToken);
            expectSuccessfulRequestResponse(getResponse);
            const expectedBody = {
                id: getResponse.body.id,
                name: targetDocumentFile.name ? targetDocumentFile.name : null,
                link: targetDocumentFile.link,
                type: targetDocumentFile.type,
                patientId: targetDocumentFile.patientId,
                createdAt: getResponse.body.createdAt,
            };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return a patientDocumentFile because the patient does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(999, initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id).id), accessToken);
            expectNotFoundResponse(getResponse);
            const expectedBody = { message: 'Patient not found' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return a patientDocumentFile because the documentFile does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(initPatients[1].id, 999), accessToken);
            expectNotFoundResponse(getResponse);
            const expectedBody = { message: 'Document file not found' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return a patientDocumentFile because there is no accessToken', async () => {
            const getResponse = await apiGet(endpointUrl(initPatients[1].id, initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id).id));
            expectUnauthorizedResponse(getResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return a patientDocumentFile because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const getResponse = await apiGetWithAuth(endpointUrl(initPatients[1].id, initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id).id), accessToken);
            expectUnauthorizedResponse(getResponse);
            expectTokenErrorMessageReceived(getResponse);
        });

        test('failed to return a patientDocumentFile because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const getResponse = await after1s(apiGetWithAuth, endpointUrl(initPatients[1].id, initPatientDocumentFiles.find(dF => dF.patientId === initPatients[1].id).id), accessToken);  // accessToken expires after 1 second
            expectUnauthorizedResponse(getResponse);
            expectTokenExpiredErrorMessageReceived(getResponse);
        });
    });

    describe('get all patientDocumentFiles by patientId', () => {
        const endpointUrl = (patientId) => `/patients/${patientId}/documentFiles`;

        test('all patientDocumentFiles returned successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(initPatients[1].id), accessToken);
            expectSuccessfulRequestResponse(getResponse);
            const initialPatientDocumentFilesWithChanges = await ensureInitialInstancesChangesWereDetected(initialPatientDocumentFiles);
            const expectedArray = initialPatientDocumentFilesWithChanges.filter(dF => dF.patientId === initPatients[1].id);
            await expectSameArrayBody(getResponse.body, expectedArray, compareDocumentFileFunc);
        });

        test('failed to return all patientDocumentFiles because the patient does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(999), accessToken);
            expectNotFoundResponse(getResponse);
            const expectedBody = { message: 'Patient not found' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return all patientDocumentFiles because there is no accessToken', async () => {
            const getResponse = await apiGet(endpointUrl(initPatients[1].id));
            expectUnauthorizedResponse(getResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return all patientDocumentFiles because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const getResponse = await apiGetWithAuth(endpointUrl(initPatients[1].id), accessToken);
            expectUnauthorizedResponse(getResponse);
            expectTokenErrorMessageReceived(getResponse);
        });

        test('failed to return all patientDocumentFiles because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const getResponse = await after1s(apiGetWithAuth, endpointUrl(initPatients[1].id), accessToken);  // accessToken expires after 1 second
            expectUnauthorizedResponse(getResponse);
            expectTokenExpiredErrorMessageReceived(getResponse);
        });
    });

    describe('register a new medicalAttentionDocumentFile', () => {
        const endpointUrl = (medicalAttentionId) => `/medicalAttentions/${medicalAttentionId}/documentFiles`;

        test('medicalAttentionDocumentFile created successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newDocumentFile = {
                name: "foto de la patita",
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const createResponse = await apiPostWithAuth(endpointUrl(initMedicalAttentions[1].id), accessToken, newDocumentFile);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                name: newDocumentFile.name,
                link: newDocumentFile.link,
                type: newDocumentFile.type,
                medicalAttentionId: initMedicalAttentions[1].id,
                createdAt: createResponse.body.createdAt,
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length + 1);
        });

        test('medicalAttentionDocumentFile created successfully with no name', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const createResponse = await apiPostWithAuth(endpointUrl(initMedicalAttentions[1].id), accessToken, newDocumentFile);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                name: null,
                link: newDocumentFile.link,
                type: newDocumentFile.type,
                medicalAttentionId: initMedicalAttentions[1].id,
                createdAt: createResponse.body.createdAt,
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length + 1);
        });

        test('failed to create a medicalAttentionDocumentFile because there is already another medicalAttentionDocumentFile with the same name', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const medicalAttentionIdWhereDocumentFileHasName = initMedicalAttentions.find(p => p.id === initMedicalAttentionDocumentFiles.find(dF => dF.name).medicalAttentionId).id;
            const newDocumentFile = {
                name: initMedicalAttentionDocumentFiles.find(dF => dF.name).name,
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const createResponse = await apiPostWithAuth(endpointUrl(medicalAttentionIdWhereDocumentFileHasName), accessToken, newDocumentFile);
            expectBadRequestResponse(createResponse);
            const expectedBody = { message: 'Document file already exists for this medical attention' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to create a medicalAttentionDocumentFile because the medicalAttention does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const createResponse = await apiPostWithAuth(endpointUrl(999), accessToken, newDocumentFile);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Medical attention not found' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to create a medicalAttentionDocumentFile because there is no link and type', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const newDocumentFile = { name: "something" };
            const createResponse = await apiPostWithAuth(endpointUrl(initMedicalAttentions[1].id), accessToken, newDocumentFile);
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Link is required");
            expectBadRequiredBodyAttribute(createResponse, "Type is required");
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to create a medicalAttentionDocumentFile because there is no accessToken', async () => {
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const createResponse = await apiPost(endpointUrl(initMedicalAttentions[1].id), newDocumentFile);
            expectUnauthorizedResponse(createResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to create a medicalAttentionDocumentFile because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const createResponse = await apiPostWithAuth(endpointUrl(initMedicalAttentions[1].id), accessToken, newDocumentFile);
            expectUnauthorizedResponse(createResponse);
            expectTokenErrorMessageReceived(createResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to create a medicalAttentionDocumentFile because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const createResponse = await after1s(apiPostWithAuth, endpointUrl(initMedicalAttentions[1].id), accessToken, newDocumentFile);  // accessToken expires after 1 second
            expectUnauthorizedResponse(createResponse);
            expectTokenExpiredErrorMessageReceived(createResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });
    });

    describe('update a medicalAttentionDocumentFile', () => {
        const endpointUrl = (medicalAttentionId, documentFileId) => `/medicalAttentions/${medicalAttentionId}/documentFiles/${documentFileId}`;

        test('medicalAttentionDocumentFile updated successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newDocumentFile = {
                name: "foto de la patita",
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initMedicalAttentions[1].id, initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id).id), accessToken, newDocumentFile);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                name: newDocumentFile.name,
                link: newDocumentFile.link,
                type: newDocumentFile.type,
                medicalAttentionId: initMedicalAttentions[1].id,
                createdAt: updateResponse.body.createdAt,
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('medicalAttentionDocumentFile updated successfully with no name', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initMedicalAttentions[1].id, initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id).id), accessToken, newDocumentFile);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                name: null,
                link: newDocumentFile.link,
                type: newDocumentFile.type,
                medicalAttentionId: initMedicalAttentions[1].id,
                createdAt: updateResponse.body.createdAt,
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a medicalAttentionDocumentFile because there is already another medicalAttentionDocumentFile with the same name', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const medicalAttentionIdWhereDocumentFileHasName = initMedicalAttentions.find(p => p.id === initMedicalAttentionDocumentFiles.find(dF => dF.name).medicalAttentionId).id;
            const newDocumentFile = {
                name: initMedicalAttentionDocumentFiles.find(dF => dF.name).name,
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const documentFileIdThatWillHaveSameName = initMedicalAttentionDocumentFiles.find(dF => dF.name !== newDocumentFile.name && dF.medicalAttentionId === medicalAttentionIdWhereDocumentFileHasName).id;
            const updateResponse = await apiPutWithAuth(endpointUrl(medicalAttentionIdWhereDocumentFileHasName, documentFileIdThatWillHaveSameName), accessToken, newDocumentFile);
            expectBadRequestResponse(updateResponse);
            const expectedBody = { message: 'Document file already exists for this medical attention' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a medicalAttentionDocumentFile because the medical attention does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(999, initMedicalAttentionDocumentFiles[1].id), accessToken, newDocumentFile);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Medical attention not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a medicalAttentionDocumentFile because the documentFile does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initMedicalAttentions[1].id, 999), accessToken, newDocumentFile);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Document file not found' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a medicalAttentionDocumentFile because there is no link and type', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const newDocumentFile = { name: "something" };
            const updateResponse = await apiPutWithAuth(endpointUrl(initMedicalAttentions[1].id, initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id).id), accessToken, newDocumentFile);
            expectBadRequestResponse(updateResponse);
            expectBadRequiredBodyAttribute(updateResponse, "Link is required");
            expectBadRequiredBodyAttribute(updateResponse, "Type is required");
        });

        test('failed to update a medicalAttentionDocumentFile because there is no accessToken', async () => {
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const updateResponse = await apiPut(endpointUrl(initMedicalAttentions[1].id, initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id).id), newDocumentFile);
            expectUnauthorizedResponse(updateResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update a medicalAttentionDocumentFile because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const updateResponse = await apiPutWithAuth(endpointUrl(initMedicalAttentions[1].id, initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id).id), accessToken, newDocumentFile);
            expectUnauthorizedResponse(updateResponse);
            expectTokenErrorMessageReceived(updateResponse);
        });

        test('failed to update a medicalAttentionDocumentFile because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const newDocumentFile = {
                link: "https://www.example.com/imagePatita.png",
                type: "IMAGE_PNG",
            };
            const updateResponse = await after1s(apiPutWithAuth, endpointUrl(initMedicalAttentions[1].id, initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id).id), accessToken, newDocumentFile);  // accessToken expires after 1 second
            expectUnauthorizedResponse(updateResponse);
            expectTokenExpiredErrorMessageReceived(updateResponse);
        });
    });

    describe('delete a medicalAttentionDocumentFile', () => {
        const endpointUrl = (medicalAttentionId, documentFileId) => `/medicalAttentions/${medicalAttentionId}/documentFiles/${documentFileId}`;

        test('medicalAttentionDocumentFile deleted successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const targetDocumentFile = initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id);
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(initMedicalAttentions[1].id, targetDocumentFile.id), accessToken);
            expectSuccessfulRequestResponse(deleteResponse);
            const expectedBody = {
                id: deleteResponse.body.id,
                name: targetDocumentFile.name ? targetDocumentFile.name : null,
                link: targetDocumentFile.link,
                type: targetDocumentFile.type,
                medicalAttentionId: targetDocumentFile.medicalAttentionId,
                createdAt: deleteResponse.body.createdAt,
            };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length - 1);
        });

        test('failed to delete a medicalAttentionDocumentFile because the medicalAttention does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(999, initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id).id), accessToken);
            expectNotFoundResponse(deleteResponse);
            const expectedBody = { message: 'Medical attention not found' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to delete a medicalAttentionDocumentFile because the documentFile does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(initMedicalAttentions[1].id, 999), accessToken);
            expectNotFoundResponse(deleteResponse);
            const expectedBody = { message: 'Document file not found' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to delete a medicalAttentionDocumentFile because there is no accessToken', async () => {
            const deleteResponse = await apiDelete(endpointUrl(initMedicalAttentions[1].id, initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id).id));
            expectUnauthorizedResponse(deleteResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to delete a medicalAttentionDocumentFile because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const deleteResponse = await apiDeleteWithAuth(endpointUrl(initMedicalAttentions[1].id, initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id).id), accessToken);
            expectUnauthorizedResponse(deleteResponse);
            expectTokenErrorMessageReceived(deleteResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });

        test('failed to delete a medicalAttentionDocumentFile because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const deleteResponse = await after1s(apiDeleteWithAuth, endpointUrl(initMedicalAttentions[1].id, initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id).id), accessToken);  // accessToken expires after 1 second
            expectUnauthorizedResponse(deleteResponse);
            expectTokenExpiredErrorMessageReceived(deleteResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(DocumentFile, initialPatientAndMedicalAttentionDocumentFiles.length);
        });
    });

    describe('get a medicalAttentionDocumentFile by medicalAttention id and document file id', () => {
        const endpointUrl = (medicalAttentionId, documentFileId) => `/medicalAttentions/${medicalAttentionId}/documentFiles/${documentFileId}`;

        test('medicalAttentionDocumentFile returned successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const targetDocumentFile = initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id);
            const getResponse = await apiGetWithAuth(endpointUrl(initMedicalAttentions[1].id, targetDocumentFile.id), accessToken);
            expectSuccessfulRequestResponse(getResponse);
            const expectedBody = {
                id: getResponse.body.id,
                name: targetDocumentFile.name ? targetDocumentFile.name : null,
                link: targetDocumentFile.link,
                type: targetDocumentFile.type,
                medicalAttentionId: targetDocumentFile.medicalAttentionId,
                createdAt: getResponse.body.createdAt,
            };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return a medicalAttentionDocumentFile because the medicalAttention does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(999, initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id).id), accessToken);
            expectNotFoundResponse(getResponse);
            const expectedBody = { message: 'Medical attention not found' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return a medicalAttentionDocumentFile because the documentFile does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(initMedicalAttentions[1].id, 999), accessToken);
            expectNotFoundResponse(getResponse);
            const expectedBody = { message: 'Document file not found' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return a medicalAttentionDocumentFile because there is no accessToken', async () => {
            const getResponse = await apiGet(endpointUrl(initMedicalAttentions[1].id, initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id).id));
            expectUnauthorizedResponse(getResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return a medicalAttentionDocumentFile because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const getResponse = await apiGetWithAuth(endpointUrl(initMedicalAttentions[1].id, initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id).id), accessToken);
            expectUnauthorizedResponse(getResponse);
            expectTokenErrorMessageReceived(getResponse);
        });

        test('failed to return a medicalAttentionDocumentFile because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const getResponse = await after1s(apiGetWithAuth, endpointUrl(initMedicalAttentions[1].id, initMedicalAttentionDocumentFiles.find(dF => dF.medicalAttentionId === initMedicalAttentions[1].id).id), accessToken);  // accessToken expires after 1 second
            expectUnauthorizedResponse(getResponse);
            expectTokenExpiredErrorMessageReceived(getResponse);
        });
    });

    describe('get all medicalAttentionDocumentFile by medicalAttentionId', () => {
        const endpointUrl = (medicalAttentionId) => `/medicalAttentions/${medicalAttentionId}/documentFiles`;

        test('all medicalAttentionDocumentFiles returned successfully', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(initMedicalAttentions[1].id), accessToken);
            expectSuccessfulRequestResponse(getResponse);
            const initialMedicalAttentionDocumentFilesWithChanges = await ensureInitialInstancesChangesWereDetected(initialMedicalAttentionDocumentFiles);
            const expectedArray = initialMedicalAttentionDocumentFilesWithChanges.filter(dF => dF.medicalAttentionId === initMedicalAttentions[1].id);
            await expectSameArrayBody(getResponse.body, expectedArray, compareDocumentFileFunc);
        });

        test('failed to return all medicalAttentionDocumentFiles because the medicalAttention does not exist', async () => {
            const accessToken = (await apiLoginUser(initialUsers[1])).body.accessToken;
            const getResponse = await apiGetWithAuth(endpointUrl(999), accessToken);
            expectNotFoundResponse(getResponse);
            const expectedBody = { message: 'Medical attention not found' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return all medicalAttentionDocumentFiles because there is no accessToken', async () => {
            const getResponse = await apiGet(endpointUrl(initMedicalAttentions[1].id));
            expectUnauthorizedResponse(getResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return all medicalAttentionDocumentFiles because the accessToken is not valid', async () => {
            const accessToken = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const getResponse = await apiGetWithAuth(endpointUrl(initMedicalAttentions[1].id), accessToken);
            expectUnauthorizedResponse(getResponse);
            expectTokenErrorMessageReceived(getResponse);
        });

        test('failed to return all medicalAttentionDocumentFiles because the accessToken is expired', async () => {
            const accessToken = (await apiLoginTestUser(initialUsers[1])).body.accessToken;
            const getResponse = await after1s(apiGetWithAuth, endpointUrl(initMedicalAttentions[1].id), accessToken);  // accessToken expires after 1 second
            expectUnauthorizedResponse(getResponse);
            expectTokenExpiredErrorMessageReceived(getResponse);
        });
    });
});

afterAll(() => {
    sequelize.close();
    server.close();
});