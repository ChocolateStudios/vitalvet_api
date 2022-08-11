import { sequelize } from '../database/connectdb.js';
import { server } from "../index.js";
import { User } from "../models/User.js";
import { api, expectSuccessfulCreation, expectBadRequestResponse, expectSuccessfulRequestResponse, expectNotFoundResponse, expectIncompleteRequiredBody, expectUnauthorizedResponse, expectTokenErrorMessageReceived } from "./testCommon.js";

const initialUsers = [
    { email: "firstemail@example.com", password: "firstPassword#123" },
    { email: "secondemail@example.com", password: "secondPassword#321" }
]

beforeEach(async () => {
    await User.destroy({ where: {} });

    for (let user of initialUsers) {
        await User.create(user);
    }
});

describe('user enpoints', () => {
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
        test('user created successfully', async () => {
            const newUser = { email: "newemail@example.com", password: "newPassword#123" };

            const response = await api.post('/api/v1/auth/register').send(newUser);

            expectSuccessfulCreation(response);

            expect(response.body.expiresIn).toBeTruthy();
            expect(response.body.expiresIn).toBe(900);
            expect(response.body.token).toBeTruthy();
            expect(response.body.token.length).toBeGreaterThan(0);

            const users = await User.findAll();
            expect(users.length).toBe(initialUsers.length + 1);
        });

        test('failed to create user because there is already another user with the same email', async () => {
            const newUser = { email: initialUsers[1].email, password: "newPassword#123" };

            const response = await api.post('/api/v1/auth/register').send(newUser);

            expectBadRequestResponse(response);

            expect(response.body.expiresIn).toBeUndefined();
            expect(response.body.token).toBeUndefined();
            expect(response.body.message).toBe("User already exists with this email");

            const users = await User.findAll();
            expect(users.length).toBe(initialUsers.length);
        });

        test('failed to create user because the email is not valid', async () => {
            const newUser = { email: "newemailexample.com", password: "newPassword#123" };

            const response = await api.post('/api/v1/auth/register').send(newUser);

            expectBadRequestResponse(response);

            expect(response.body.expiresIn).toBeUndefined();
            expect(response.body.token).toBeUndefined();
            expect(response.body.errors).toEqual(expect.arrayContaining([
                { value: 'newemailexample.com', msg: 'Email must be valid', param: 'email', location: 'body' }
            ]));

            const users = await User.findAll();
            expect(users.length).toBe(initialUsers.length);
        });

        test('failed to create user because because the password is less than 6 characters', async () => {
            const newUser = { email: "newemail@example.com", password: "newPa" };

            const response = await api.post('/api/v1/auth/register').send(newUser);

            expectBadRequestResponse(response);

            expect(response.body.expiresIn).toBeUndefined();
            expect(response.body.token).toBeUndefined();
            expect(response.body.errors).toEqual(expect.arrayContaining([
                { value: 'newPa', msg: 'Password must be at least 6 characters', param: 'password', location: 'body' }
            ]));

            const users = await User.findAll();
            expect(users.length).toBe(initialUsers.length);
        });

        test('failed to create the user because there is no email', async () => {
            await expectIncompleteRequiredBody(
                '/api/v1/auth/register',
                { password: "newPassword#123" },
                'Email is required'
            );
        });

        test('failed to create the user because there is no password', async () => {
            await expectIncompleteRequiredBody(
                '/api/v1/auth/register',
                { email: "newemail@example.com" },
                'Password is required'
            );
        });
    });

    describe('login a user', () => {
        test('user logged in successfully', async () => {
            const user = { email: initialUsers[1].email, password: initialUsers[1].password };

            const response = await api.post('/api/v1/auth/login').send(user);

            expectSuccessfulRequestResponse(response);

            expect(response.body.expiresIn).toBeTruthy();
            expect(response.body.expiresIn).toBe(900);
            expect(response.body.token).toBeTruthy();
            expect(response.body.token.length).toBeGreaterThan(0);
        });

        test('failed to login the user because there is no user with the email', async () => {
            const user = { email: "newemail@example.com", password: initialUsers[1].password };

            const response = await api.post('/api/v1/auth/login').send(user);

            expectNotFoundResponse(response);

            expect(response.body.expiresIn).toBeUndefined();
            expect(response.body.token).toBeUndefined();
            expect(response.body.message).toBe("Invalid email or password");
        });

        test('failed to login the user because the password is incorrect', async () => {
            const user = { email: initialUsers[1].email, password: "newPassword#123" };

            const response = await api.post('/api/v1/auth/login').send(user);

            expectNotFoundResponse(response);

            expect(response.body.expiresIn).toBeUndefined();
            expect(response.body.token).toBeUndefined();
            expect(response.body.message).toBe("Invalid email or password");
        });

        test('failed to login the user because there is no email', async () => {
            await expectIncompleteRequiredBody(
                '/api/v1/auth/login',
                { password: "newPassword#123" },
                'Email is required'
            );
        });

        test('failed to login the user because there is no password', async () => {
            await expectIncompleteRequiredBody(
                '/api/v1/auth/login',
                { email: "newemail@example.com" },
                'Password is required'
            );
        });
    });

    describe('delete a logged in user', () => {
        test('user deleted successfully', async () => {
            const user = { email: initialUsers[1].email, password: initialUsers[1].password };

            const response = await api.post('/api/v1/auth/login').send(user);
            expectSuccessfulRequestResponse(response);

            const token = response.body.token;
            const responseDelete = await api.delete('/api/v1/auth').set('Authorization', `Bearer ${token}`);

            expectSuccessfulRequestResponse(responseDelete);

            expect(responseDelete.body.message).toBeTruthy();
            expect(responseDelete.body.message).toBe("Account deleted");

            const users = await User.findAll();
            expect(users.length).toBe(initialUsers.length - 1);
        });

        test('failed to delete a user because the user does not exist', async () => {
            const user = { email: initialUsers[1].email, password: initialUsers[1].password };

            const response = await api.post('/api/v1/auth/login').send(user);

            expectSuccessfulRequestResponse(response);

            const token = response.body.token;
            const responseDelete = await api.delete('/api/v1/auth').set('Authorization', `Bearer ${token}`);

            expectSuccessfulRequestResponse(responseDelete);

            const responseDelete2 = await api.delete('/api/v1/auth').set('Authorization', `Bearer ${token}`);

            expectNotFoundResponse(responseDelete2);

            expect(responseDelete2.body.message).toBeTruthy();
            expect(responseDelete2.body.message).toBe("Invalid user");

            const users = await User.findAll();
            expect(users.length).toBe(initialUsers.length - 1);
        });

        test('failed to delete a user because the token is not valid', async () => {
            const user = { email: initialUsers[1].email, password: initialUsers[1].password };

            const response = await api.post('/api/v1/auth/login').send(user);

            expectSuccessfulRequestResponse(response);

            const token = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const responseDelete = await api.delete('/api/v1/auth').set('Authorization', `Bearer ${token}`);

            expectUnauthorizedResponse(responseDelete);
            expectTokenErrorMessageReceived(responseDelete);

            const users = await User.findAll();
            expect(users.length).toBe(initialUsers.length);
        });

        test('failed to delete a user because there is no token', async () => {
            const user = { email: initialUsers[1].email, password: initialUsers[1].password };

            const response = await api.post('/api/v1/auth/login').send(user);

            expectSuccessfulRequestResponse(response);

            const responseDelete = await api.delete('/api/v1/auth');

            expectUnauthorizedResponse(responseDelete);

            expect(responseDelete.body.message).toBeTruthy();
            expect(responseDelete.body.message).toBe("Not authorized");

            const users = await User.findAll();
            expect(users.length).toBe(initialUsers.length);
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