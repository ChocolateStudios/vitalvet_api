import { sequelize } from '../database/connectdb.js';
import { server } from "../index.js";
import { Owner } from '../models/Owner.js';
import { Patient } from '../models/Patient.js';
import { Profile } from '../models/Profile.js';
import { Species } from '../models/Species.js';
import { User } from '../models/User.js';
import { after1s, api, apiDeleteWithAuth, apiLoginTestUser, apiLoginUser, apiPost, apiPostWithAuth, apiRegisterUser, compareOwnerFunc, comparePatientFunc, compareProfileFunc, compareSpeciesFunc, compareUserFunc, ensureOnlyInitialInstancesExist, expectBadRequestResponse, expectBadRequiredBodyAttribute, expectLengthOfDatabaseInstancesToBeTheSameWith, expectNotFoundResponse, expectOnlyInitialInstancesInDatabase, expectSuccessfulCreation, expectSuccessfulRequestResponse, expectTokenErrorMessageReceived, expectTokenExpiredErrorMessageReceived, expectUnauthorizedResponse, initialOwners, initialPatients, initialProfiles, initialSpecies, initialSubspecies, initialUsers } from './testCommon.js';

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
            const token = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.token;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                dayOfDeath: "2022-06-21",
                mainPicture: "https://www.exampleSiu.com/image.png",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, token, newPatient);
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
            const token = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.token;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, token, newPatient);
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
            const token = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.token;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: 999,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, token, newPatient);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Owner not found' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initialPatients.length);
        });

        test('failed to create a patient because the subspecies does not exist', async () => {
            const token = (await apiLoginUser(initialUsers.find(p => p.email === initUsers[1].email))).body.token;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: 999,
                ownerId: initOwners[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, token, newPatient);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Subspecies not found' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initialPatients.length);
        });

        test('failed to create a patient because the profile does not exist', async () => {
            const newUser = { email: "newemail@example.com", password: "newPassword#123" };
            const token = (await apiRegisterUser(newUser)).body.token;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, token, newPatient);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Profile not found for this user' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initialPatients.length);
        });

        test('failed to create a patient because there is no name, weight and birthday', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const newPatient = { dayOfDeath: "2022-06-21", mainPicture: "https://www.exampleSiu.com/image.png" };
            const createResponse = await apiPostWithAuth(endpointUrl, token, newPatient);
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Name is required");
            expectBadRequiredBodyAttribute(createResponse, "Weight is required");
            expectBadRequiredBodyAttribute(createResponse, "Birthday is required");
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initialPatients.length);
        });

        test('failed to create a patient because the data types of name, weight, birthday, dayOfDeath and mainPicture are incorrect', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;

            const newPatient = {
                name: false,
                weight: false,
                birthday: false,
                dayOfDeath: false,
                mainPicture: false,
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, token, newPatient);
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Weight must be a float number");
            expectBadRequiredBodyAttribute(createResponse, "Birthday must be a date");
            expectBadRequiredBodyAttribute(createResponse, "Day of death must be a date");
            expectBadRequiredBodyAttribute(createResponse, "Main picture must be a url");
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Patient, initialPatients.length);
        });

        test('failed to create a patient because there is no token', async () => {
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

        test('failed to create a patient because the token is not valid', async () => {
            const token = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const createResponse = await apiPostWithAuth(endpointUrl, token, newPatient);
            expectUnauthorizedResponse(createResponse);
            expectTokenErrorMessageReceived(createResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length);
        });

        test('failed to create a patient because the token is expired', async () => {
            const token = (await apiLoginTestUser(initialUsers[1])).body.token;
            const newPatient = {
                name: "Simba",
                weight: 38.4,
                birthday: "2019-10-14",
                subspeciesId: initSubspecies[1].id,
                ownerId: initOwners[1].id,
            };
            const createResponse = await after1s(apiPostWithAuth, endpointUrl, token, newPatient);  // token expires after 1 second
            expectUnauthorizedResponse(createResponse);
            expectTokenExpiredErrorMessageReceived(createResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length);
        });
    });
});

afterAll(() => {
    sequelize.close();
    server.close();
});