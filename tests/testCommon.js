import supertest from "supertest";
import { app } from "../index.js";
import { jest } from '@jest/globals'

jest.setTimeout(20000); // 20 second
export const api = supertest(app);


/************************************************
************** Api Request Expects **************
*************************************************/

export const expectSuccessfulCreation = (response) => {
    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(201);
    expect(response.type).toBe('application/json');
};

export const expectSuccessfulRequestResponse = (response) => {
    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('application/json');
};

export const expectBadRequestResponse = (response) => {
    expect(response.ok).toBe(false);
    expect(response.statusCode).toBe(400);
    expect(response.type).toBe('application/json');
};

export const expectNotFoundResponse = (response) => {
    expect(response.ok).toBe(false);
    expect(response.statusCode).toBe(404);
    expect(response.type).toBe('application/json');
};

export const expectUnauthorizedResponse = (response) => {
    expect(response.ok).toBe(false);
    expect(response.statusCode).toBe(401);
    expect(response.type).toBe('application/json');
};

export const expectTokenErrorMessageReceived = (response) => {
    expect(response.body.message).toBeTruthy();

    const tokenFailedMessages = [
        'jwt malformed',
        'invalid signature',
        'jwt expired',
        'jwt not before',
        'invalid token'
    ];
    
    let tokenErrorReceived = false;

    tokenFailedMessages.forEach(message => {
        if (response.body.message.includes(message))
            tokenErrorReceived = true;
    });

    expect(tokenErrorReceived).toBe(true);
};

export const expectIncompleteRequiredBody = async (route, objectSubmission, messageResponse) => {
    const response = await api.post(route).send(objectSubmission);
    expectBadRequestResponse(response);

    expect(response.body.errors).toBeTruthy();

    let errorReceived = false;

    response.body.errors.forEach(error => {
        if (error.msg === messageResponse) {
            errorReceived = true;
        }
    });

    expect(errorReceived).toBe(true);
}