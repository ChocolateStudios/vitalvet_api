import { sequelize } from '../database/connectdb.js';
import { server } from "../index.js";
import { Profile } from '../models/Profile.js';
import { User } from '../models/User.js';
import { api, initialUsers, initialProfiles, expectSuccessfulCreation, expectBadRequestResponse, expectUnauthorizedResponse, expectSuccessfulRequestResponse, expectNotFoundResponse, expectBadRequiredBodyAttribute, expectTokenErrorMessageReceived, expectTokenExpiredErrorMessageReceived, apiLoginUser, apiGetWithAuth, apiLoginTestUser, after1s, apiGet, apiDeleteWithAuth, apiDelete, apiPut, apiPutWithAuth, apiPost, apiRegisterUser, apiPostWithAuth, expectLengthOfDatabaseInstancesToBeTheSameWith, expectUnauthorizedActionResponse, ensureOnlyInitialInstancesExist, compareUserFunc, compareProfileFunc, expectOnlyInitialInstancesInDatabase, expectSameArrayBody } from './testCommon.js';

describe('profile endpoints', () => {
    beforeEach(async () => {
        await ensureOnlyInitialInstancesExist(User, initialUsers, compareUserFunc);
        await ensureOnlyInitialInstancesExist(Profile, initialProfiles, compareProfileFunc);
    });

    describe('test scenary ready', () => {
        test('expected initial users', async () => {
            await expectOnlyInitialInstancesInDatabase(User, initialUsers, compareUserFunc);
        });

        test('expected initial profiles', async () => {
            await expectOnlyInitialInstancesInDatabase(Profile, initialProfiles, compareProfileFunc);
        });
    });

    describe('register profile of logged in user', () => {
        const endpointUrl = '/profiles';

        test('profile created successfully', async () => {
            const newUser = { email: "newemail@example.com", password: "newPassword#123" };
            const token = (await apiRegisterUser(newUser)).body.token;
            const newProfile = {
                name: 'Nuevo',
                lastname: 'Ejemplo',
                birthday: "2008-10-27",
                picture: 'http://www.example.com/image.png',
                college: 'Universidad Nacional de Canada',
                review: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
            };
            const createResponse = await apiPostWithAuth(endpointUrl, token, newProfile);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                name: newProfile.name,
                lastname: newProfile.lastname,
                birthday: newProfile.birthday,
                picture: newProfile.picture,
                admin: false,
                college: newProfile.college,
                review: newProfile.review,
                user: {
                    id: createResponse.body.user.id,
                    email: newUser.email
                }
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length + 1);
        });

        test('profile created successfully with no picture', async () => {
            const newUser = { email: "newemail@example.com", password: "newPassword#123" };
            const token = (await apiRegisterUser(newUser)).body.token;
            const newProfile = {
                name: 'Nuevo',
                lastname: 'Ejemplo',
                birthday: "2008-10-27",
                college: 'Universidad Nacional de Canada',
                review: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
            };
            const createResponse = await apiPostWithAuth(endpointUrl, token, newProfile);
            expectSuccessfulCreation(createResponse);
            const expectedBody = {
                id: createResponse.body.id,
                name: newProfile.name,
                lastname: newProfile.lastname,
                birthday: newProfile.birthday,
                picture: null,
                admin: false,
                college: newProfile.college,
                review: newProfile.review,
                user: {
                    id: createResponse.body.user.id,
                    email: newUser.email
                }
            };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length + 1);
        });

        test('failed to create a profile because a profile already exists for this user', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const newProfile = {
                name: 'Nuevo',
                lastname: 'Ejemplo',
                birthday: "2008-10-27",
                college: 'Universidad Nacional de Canada',
                review: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
            };
            const createResponse = await apiPostWithAuth(endpointUrl, token, newProfile);
            expectBadRequestResponse(createResponse);
            const expectedBody = { message: 'Profile already exists for this user' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length);
        });

        test('failed to create a profile because the user does not exist', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const deleteResponse = await apiDeleteWithAuth('/auth', token);
            expectSuccessfulRequestResponse(deleteResponse);
            const newProfile = {
                name: 'Nuevo',
                lastname: 'Ejemplo',
                birthday: "2008-10-27",
                college: 'Universidad Nacional de Canada',
                review: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
            };
            const createResponse = await apiPostWithAuth(endpointUrl, token, newProfile);
            expectNotFoundResponse(createResponse);
            const expectedBody = { message: 'Invalid user' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length - 1);
        });

        test('failed to create a profile because the user is not logged in', async () => {
            const newProfile = {
                name: 'Nuevo',
                lastname: 'Ejemplo',
                birthday: "2008-10-27",
                picture: 'http://www.example.com/image.png',
                college: 'Universidad Nacional de Canada',
                review: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
            };
            const createResponse = await apiPost(endpointUrl, newProfile);
            expectUnauthorizedResponse(createResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(createResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length);
        });

        test('failed to create a profile because there is no name, lastname, birthday, college and review', async () => {
            const newUser = { email: "newemail@example.com", password: "newPassword#123" };
            const token = (await apiRegisterUser(newUser)).body.token;
            const newProfile = { picture: 'http://www.example.com/image.png' };
            const createResponse = await apiPostWithAuth(endpointUrl, token, newProfile);
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Name is required");
            expectBadRequiredBodyAttribute(createResponse, "Lastname is required");
            expectBadRequiredBodyAttribute(createResponse, "Birthday is required");
            expectBadRequiredBodyAttribute(createResponse, "College is required");
            expectBadRequiredBodyAttribute(createResponse, "Review is required");
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length);
        });

        test('failed to create a profile because the data types of name, lastname, birthday, picture, college and review are incorrect', async () => {
            const newUser = { email: "newemail@example.com", password: "newPassword#123" };
            const token = (await apiRegisterUser(newUser)).body.token;
            const newProfile = {
                name: false,
                lastname: false,
                birthday: false,
                picture: false,
                college: false,
                review: false
            };
            const createResponse = await apiPostWithAuth(endpointUrl, token, newProfile);
            expectBadRequestResponse(createResponse);
            expectBadRequiredBodyAttribute(createResponse, "Birthday must be a date");
            expectBadRequiredBodyAttribute(createResponse, "Picture must be a url");
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length);
        });
    });

    describe('update profile of logged in user', () => {
        const endpointUrl = '/profiles';

        test('profile updated successfully', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const newProfile = {
                name: 'Ejemplo',
                lastname: 'Actualizado',
                birthday: "2008-10-27",
                picture: 'http://www.example.com/image.png',
                college: 'Universidad Nacional de Canada',
                review: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
            };
            const updateResponse = await apiPutWithAuth(endpointUrl, token, newProfile);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                name: newProfile.name,
                lastname: newProfile.lastname,
                birthday: newProfile.birthday,
                picture: newProfile.picture,
                admin: false,
                college: newProfile.college,
                review: newProfile.review,
                user: {
                    id: updateResponse.body.user.id,
                    email: initialUsers[1].email
                }
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('profile updated successfully with no picture', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const newProfile = {
                name: 'Ejemplo',
                lastname: 'Actualizado',
                birthday: "2008-10-27",
                college: 'Universidad Nacional de Canada',
                review: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
            };
            const updateResponse = await apiPutWithAuth(endpointUrl, token, newProfile);
            expectSuccessfulRequestResponse(updateResponse);
            const expectedBody = {
                id: updateResponse.body.id,
                name: newProfile.name,
                lastname: newProfile.lastname,
                birthday: newProfile.birthday,
                picture: null,
                admin: false,
                college: newProfile.college,
                review: newProfile.review,
                user: {
                    id: updateResponse.body.user.id,
                    email: initialUsers[1].email
                }
            };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update the profile because the profile does not exist', async () => {
            const newUser = { email: "newemail@example.com", password: "newPassword#123" };
            const token = (await apiRegisterUser(newUser)).body.token;
            const newProfile = {
                name: 'Nuevo',
                lastname: 'Ejemplo',
                birthday: "2008-10-27",
                college: 'Universidad Nacional de Canada',
                review: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
            };
            const updateResponse = await apiPutWithAuth(endpointUrl, token, newProfile);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Profile not found for this user' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update the profile because the user does not exist', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const deleteResponse = await apiDeleteWithAuth('/auth', token);
            expectSuccessfulRequestResponse(deleteResponse);

            const newProfile = {
                name: 'Nuevo',
                lastname: 'Ejemplo',
                birthday: "2008-10-27",
                college: 'Universidad Nacional de Canada',
                review: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
            };
            const updateResponse = await apiPutWithAuth(endpointUrl, token, newProfile);
            expectNotFoundResponse(updateResponse);
            const expectedBody = { message: 'Invalid user' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update the profile because the user is not logged in', async () => {
            const newProfile = {
                name: 'Nuevo',
                lastname: 'Ejemplo',
                birthday: "2008-10-27",
                picture: 'http://www.example.com/image.png',
                college: 'Universidad Nacional de Canada',
                review: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
            };
            const updateResponse = await apiPut(endpointUrl, newProfile);
            expectUnauthorizedResponse(updateResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(updateResponse.body).toEqual(expectedBody);
        });

        test('failed to update the profile because there is no name, lastname, birthday, college and review', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const newProfile = { picture: 'http://www.example.com/image.png' };
            const updateResponse = await apiPutWithAuth(endpointUrl, token, newProfile);
            expectBadRequestResponse(updateResponse);
            expectBadRequiredBodyAttribute(updateResponse, "Name is required");
            expectBadRequiredBodyAttribute(updateResponse, "Lastname is required");
            expectBadRequiredBodyAttribute(updateResponse, "Birthday is required");
            expectBadRequiredBodyAttribute(updateResponse, "College is required");
            expectBadRequiredBodyAttribute(updateResponse, "Review is required");
        });

        test('failed to update a profile because the data types of name, lastname, birthday, picture, college and review are incorrect', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;

            const newProfile = {
                name: false,
                lastname: false,
                birthday: false,
                picture: false,
                college: false,
                review: false
            };
            const updateResponse = await apiPutWithAuth(endpointUrl, token, newProfile);
            expectBadRequestResponse(updateResponse);
            expectBadRequiredBodyAttribute(updateResponse, "Birthday must be a date");
            expectBadRequiredBodyAttribute(updateResponse, "Picture must be a url");
        });
    });

    describe('delete profile of logged in user', () => {
        const endpointUrl = '/profiles';

        test('profile deleted successfully', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const deleteResponse = await apiDeleteWithAuth(endpointUrl, token);
            expectSuccessfulRequestResponse(deleteResponse);

            const expectedBody = {
                id: deleteResponse.body.id,
                name: initialProfiles[1].name,
                lastname: initialProfiles[1].lastname,
                birthday: initialProfiles[1].birthday,
                picture: initialProfiles[1].picture,
                admin: initialProfiles[1].admin,
                college: initialProfiles[1].college,
                review: initialProfiles[1].review,
                user: {
                    id: deleteResponse.body.user.id,
                    email: initialUsers[1].email
                }
            };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length - 1);
        });

        test('failed to delete the profile because the profile does not exist', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const deleteResponse = await apiDeleteWithAuth(endpointUrl, token);
            expectSuccessfulRequestResponse(deleteResponse);
            const deleteResponse2 = await apiDeleteWithAuth(endpointUrl, token);
            expectNotFoundResponse(deleteResponse2);
            const expectedBody = { message: 'Profile not found for this user' };
            expect(deleteResponse2.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length - 1);
        });

        test('failed to delete the profile because the user does not exist', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const deleteResponse = await apiDeleteWithAuth('/auth', token);
            expectSuccessfulRequestResponse(deleteResponse);
            const deleteResponse2 = await apiDeleteWithAuth(endpointUrl, token);
            expectNotFoundResponse(deleteResponse2);
            const expectedBody = { message: 'Invalid user' };
            expect(deleteResponse2.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length - 1);
        });

        test('failed to delete the profile because the token is not valid', async () => {
            const token = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const deleteResponse = await apiDeleteWithAuth(endpointUrl, token);
            expectUnauthorizedResponse(deleteResponse);
            expectTokenErrorMessageReceived(deleteResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length);
        });

        test('failed to delete the profile because there is no token', async () => {
            const deleteResponse = await apiDelete(endpointUrl);
            expectUnauthorizedResponse(deleteResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(deleteResponse.body).toEqual(expectedBody);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length);
        });

        test('failed to delete the profile because the token is expired', async () => {
            const token = (await apiLoginTestUser(initialUsers[1])).body.token;
            const deleteResponse = await after1s(apiDeleteWithAuth, endpointUrl, token);  // token expires after 1 second
            expectUnauthorizedResponse(deleteResponse);
            expectTokenExpiredErrorMessageReceived(deleteResponse);
            await expectLengthOfDatabaseInstancesToBeTheSameWith(Profile, initialProfiles.length);
        });
    });

    describe('get profile of logged in user', () => {
        const endpointUrl = '/profiles';

        test('profile returned successfully', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const getResponse = await apiGetWithAuth(endpointUrl, token);
            expectSuccessfulRequestResponse(getResponse);

            const expectedBody = {
                id: getResponse.body.id,
                name: initialProfiles[1].name,
                lastname: initialProfiles[1].lastname,
                birthday: initialProfiles[1].birthday,
                picture: initialProfiles[1].picture,
                admin: initialProfiles[1].admin,
                college: initialProfiles[1].college,
                review: initialProfiles[1].review,
                user: {
                    id: getResponse.body.user.id,
                    email: initialUsers[1].email
                }
            };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return the profile because the profile does not exist', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const deleteResponse = await apiDeleteWithAuth('/profiles', token);
            expectSuccessfulRequestResponse(deleteResponse);
            const getResponse = await apiGetWithAuth(endpointUrl, token);
            expectNotFoundResponse(getResponse);
            const expectedBody = { message: 'Profile not found for this user' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return the profile because the user does not exist', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const deleteResponse = await apiDeleteWithAuth('/auth', token);
            expectSuccessfulRequestResponse(deleteResponse);
            const getResponse = await apiGetWithAuth(endpointUrl, token);
            expectNotFoundResponse(getResponse);
            const expectedBody = { message: 'Invalid user' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return the profile because the token is not valid', async () => {
            const token = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const getResponse = await apiGetWithAuth(endpointUrl, token);
            expectUnauthorizedResponse(getResponse);
            expectTokenErrorMessageReceived(getResponse);
        });

        test('failed to return the profile because there is no token', async () => {
            const getResponse = await apiGet(endpointUrl);
            expectUnauthorizedResponse(getResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return the profile because the token is expired', async () => {
            const token = (await apiLoginTestUser(initialUsers[1])).body.token;
            const getResponse = await after1s(apiGetWithAuth, endpointUrl, token); // token expires after 1 second
            expectUnauthorizedResponse(getResponse);
            expectTokenExpiredErrorMessageReceived(getResponse);
        });
    });

    describe('get all profiles if logged in user is admin', () => {
        const endpointUrl = '/profiles/all';

        test('all profiles returned successfully', async () => {
            const token = (await apiLoginUser(initialUsers[0])).body.token;
            const getResponse = await apiGetWithAuth(endpointUrl, token);
            expectSuccessfulRequestResponse(getResponse);
            await expectSameArrayBody(getResponse.body, initialProfiles.map(profile => {
                return { ...profile,
                    user: {
                        id: profile.userId,
                        replaceWithFunc: async () => { return { name: "email", value: (await User.findOne({ where: { id: userId } })).email }}
            }}}), compareProfileFunc);
        });

        test('failed to return all profiles because the profile is not an admin', async () => {
            const token = (await apiLoginUser(initialUsers[1])).body.token;
            const getResponse = await apiGetWithAuth(endpointUrl, token);
            expectUnauthorizedActionResponse(getResponse);
            const expectedBody = { message: 'You are not authorized to do this action' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return all profiles because the profile does not exist', async () => {
            const token = (await apiLoginUser(initialUsers[0])).body.token;
            const deleteResponse = await apiDeleteWithAuth('/profiles', token);
            expectSuccessfulRequestResponse(deleteResponse);
            const getResponse = await apiGetWithAuth(endpointUrl, token);
            expectNotFoundResponse(getResponse);
            const expectedBody = { message: 'Profile not found for this user' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return all profiles because the user does not exist', async () => {
            const token = (await apiLoginUser(initialUsers[0])).body.token;
            const deleteResponse = await apiDeleteWithAuth('/auth', token);
            expectSuccessfulRequestResponse(deleteResponse);
            const getResponse = await apiGetWithAuth(endpointUrl, token);
            expectNotFoundResponse(getResponse);
            const expectedBody = { message: 'Invalid user' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return all profiles because the token is not valid', async () => {
            const token = 'invalidToken#74.a6sd56_78942.#sdad@dsaf';
            const getResponse = await apiGetWithAuth(endpointUrl, token);
            expectUnauthorizedResponse(getResponse);
            expectTokenErrorMessageReceived(getResponse);
        });

        test('failed to return all profiles because there is no token', async () => {
            const getResponse = await apiGet(endpointUrl);
            expectUnauthorizedResponse(getResponse);
            const expectedBody = { message: 'Not authorized' };
            expect(getResponse.body).toEqual(expectedBody);
        });

        test('failed to return all profiles because the token is expired', async () => {
            const token = (await apiLoginTestUser(initialUsers[0])).body.token;
            const getResponse = await after1s(apiGetWithAuth, endpointUrl, token); // token expires after 1 second
            expectUnauthorizedResponse(getResponse);
            expectTokenExpiredErrorMessageReceived(getResponse);
        });
    });
});


afterAll(() => {
    sequelize.close();
    server.close();
});