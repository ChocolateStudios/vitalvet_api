import { sequelize } from '../database/connectdb.js';
import { server } from "../index.js";
import { User } from "../models/User.js";
import { api, expectSuccessfulCreation, expectBadRequestResponse, expectSuccessfulRequestResponse, expectNotFoundResponse, expectIncompleteRequiredBody, expectUnauthorizedResponse, expectTokenErrorMessageReceived, initialUsers, apiPost, expectLengthOfDatabaseRecordsToBeTheSameWith, expectBadRequiredBodyAttribute, apiLoginUser, apiDeleteWithAuth, apiDelete, apiLoginTestUser, after1s, expectTokenExpiredErrorMessageReceived } from "./testCommon.js";

describe('user enpoints', () => {
    beforeEach(async () => {
        await User.destroy({ where: {} });

        for (let user of initialUsers) {
            await User.create(user);
        }
    });

    describe('test scenary ready', () => {
        test('expected number of initial users', async () => {
            const users = await User.findAll();
            expect(users.length).toBe(initialUsers.length);
        });

        test('expected initial users', async () => {
            const users = await User.findAll();

            for (let i = 0; i < users.length; i++) {
                expect(users[i].email).toBe(initialUsers[i].email);
            }
        });
    });

    describe('register a new user', () => {
        const endpointUrl = '/auth/register';

        test('user created successfully', async () => {
            const newUser = { email: "newemail@example.com", password: "newPassword#123" };
            const createResponse = await apiPost(endpointUrl, newUser);
            expectSuccessfulCreation(createResponse);
            expect(createResponse.body.expiresIn).toBe(900);
            expect(createResponse.body.token.length).toBeGreaterThan(0);
            await expectLengthOfDatabaseRecordsToBeTheSameWith(User, initialUsers.length + 1);
        });

        test('failed to create user because there is already another user with the same email', async () => {
            const createResponse = await apiPost(endpointUrl, initialUsers[1]);
            expectBadRequestResponse(createResponse);
            const expectedBody = { message: 'User already exists with this email' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseRecordsToBeTheSameWith(User, initialUsers.length);
        });

        test('failed to create user because the email is not valid', async () => {
            const newUser = { email: "newemailexample.com", password: "newPassword#123" };
            const createResponse = await apiPost(endpointUrl, newUser);
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Email must be valid");
            await expectLengthOfDatabaseRecordsToBeTheSameWith(User, initialUsers.length);
        });

        test('failed to create user because because the password is less than 6 characters', async () => {
            const newUser = { email: "newemail@example.com", password: "newPa" };
            const createResponse = await apiPost(endpointUrl, newUser);
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Password must be at least 6 characters");
            await expectLengthOfDatabaseRecordsToBeTheSameWith(User, initialUsers.length);
        });

        test('failed to create the user because there is no email and password', async () => {
            const createResponse = await apiPost(endpointUrl, {});
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Email is required");
            expectBadRequiredBodyAttribute(createResponse, "Password is required");
            await expectLengthOfDatabaseRecordsToBeTheSameWith(User, initialUsers.length);
        });
    });

    describe('login a user', () => {
        const endpointUrl = '/auth/login';

        test('user logged in successfully', async () => {
            const createResponse = await apiPost(endpointUrl, initialUsers[1]);
            expectSuccessfulRequestResponse(createResponse);
            expect(createResponse.body.expiresIn).toBe(900);
            expect(createResponse.body.token.length).toBeGreaterThan(0);
        });

        test('failed to login the user because there is no user with the email', async () => {
            const user = { email: "newemail@example.com", password: initialUsers[1].password };
            const createResponse = await apiPost(endpointUrl, user);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Invalid email or password' };
            expect(createResponse.body).toEqual(expectedBody);
        });

        test('failed to login the user because the password is incorrect', async () => {
            const user = { email: initialUsers[1].email, password: "newPassword#123" };
            const createResponse = await apiPost(endpointUrl, user);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Invalid email or password' };
            expect(createResponse.body).toEqual(expectedBody);
        });

        test('failed to login the user because there is no email and password', async () => {
            const createResponse = await apiPost(endpointUrl, {});
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Email is required");
            expectBadRequiredBodyAttribute(createResponse, "Password is required");
        });
    });

    describe('delete a logged in user', () => {
        const endpointUrl = '/auth';

        test('user deleted successfully', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const deleteResponse = await apiDeleteWithAuth(endpointUrl, token);
            expectSuccessfulRequestResponse(deleteResponse);
            const expectedBody = { message: 'Account deleted' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseRecordsToBeTheSameWith(User, initialUsers.length - 1);
        });

        test('failed to delete a user because the user does not exist', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const deleteResponse = await apiDeleteWithAuth(endpointUrl, token);
            expectSuccessfulRequestResponse(deleteResponse);
            const deleteResponse2 = await apiDeleteWithAuth(endpointUrl, token);
            expectNotFoundResponse(deleteResponse2);
            const expectedBody = { message: 'Invalid user' };
            expect(deleteResponse2.body).toEqual(expectedBody);
            await expectLengthOfDatabaseRecordsToBeTheSameWith(User, initialUsers.length - 1);
        });

        test('failed to delete a user because the token is not valid', async () => {
            const token = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const deleteResponse = await apiDeleteWithAuth(endpointUrl, token);
            expectUnauthorizedResponse(deleteResponse);
            expectTokenErrorMessageReceived(deleteResponse);
            await expectLengthOfDatabaseRecordsToBeTheSameWith(User, initialUsers.length);
        });

        test('failed to delete a user because there is no token', async () => {
            const deleteResponse = await apiDelete(endpointUrl);
            expectUnauthorizedResponse(deleteResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseRecordsToBeTheSameWith(User, initialUsers.length);
        });

        test('failed to delete a user because the token is expired', async () => {
            const token = (await apiLoginTestUser(initialUsers[1])).body.token;
            const deleteResponse = await after1s(apiDeleteWithAuth,endpointUrl, token);  // token expires after 1 second
            expectUnauthorizedResponse(deleteResponse);
            expectTokenExpiredErrorMessageReceived(deleteResponse);
            await expectLengthOfDatabaseRecordsToBeTheSameWith(User, initialUsers.length);
        });
    });

    describe.skip('refresh a token', () => {
        test('token refreshed successfully', async () => {
            expect(true).toBe(true);
        });
    });

    describe.skip('logout a user', () => {
        test('user logged out successfully', async () => {
            expect(true).toBe(true);
        });
    });
});


afterAll(() => {
    sequelize.close();
    server.close();
});