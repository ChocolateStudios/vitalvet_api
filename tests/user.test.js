import supertest from "supertest";
import { sequelize } from '../database/connectdb.js';
import { app, server } from "../index.js";
import { User } from "../models/User.js";
import { expectSuccessfulCreation, expectUnsuccessfulCreation } from "./testCommon.js";

const api = supertest(app);

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
            const newUser = { email: "secondemail@example.com", password: "newPassword#123" };

            const response = await api.post('/api/v1/auth/register').send(newUser);
            expectUnsuccessfulCreation(response);
            expect(response.statusCode).toBe(400);

            expect(response.body.expiresIn).toBeUndefined();
            expect(response.body.token).toBeUndefined();
            expect(response.body.message).toBe("User already exists with this email");

            const users = await User.findAll();
            expect(users.length).toBe(initialUsers.length);
        });

        test('failed to create user because the email is not valid', async () => {
            const newUser = { email: "newemailexample.com", password: "newPassword#123" };

            const response = await api.post('/api/v1/auth/register').send(newUser);
            expectUnsuccessfulCreation(response);
            expect(response.statusCode).toBe(400);

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
            expectUnsuccessfulCreation(response);
            expect(response.statusCode).toBe(400);

            expect(response.body.expiresIn).toBeUndefined();
            expect(response.body.token).toBeUndefined();
            expect(response.body.errors).toEqual(expect.arrayContaining([
                { value: 'newPa', msg: 'Password must be at least 6 characters', param: 'password', location: 'body' }
            ]));

            const users = await User.findAll();
            expect(users.length).toBe(initialUsers.length);
        });
    });

    describe('update a user', () => {
        test('should test that true === true', async () => {
            expect(true).toBe(true);
        });
    });
});


afterAll(() => {
    sequelize.close();
    server.close();
});