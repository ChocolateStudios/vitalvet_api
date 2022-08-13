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

export const expectUnauthorizedActionResponse = (response) => {
    expect(response.ok).toBe(false);
    expect(response.statusCode).toBe(403);
    expect(response.type).toBe('application/json');
};

export const expectTokenErrorMessageReceived = (response) => {
    expect(response.body.message).toBeDefined();

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

export const expectTokenExpiredErrorMessageReceived = (response) => {
    const tokenFailedMessage = 'jwt expired';
    expect(response.body.message).toBe(tokenFailedMessage);
};

export const expectIncompleteRequiredBody = async (route, objectSubmission, messageResponse) => {
    const response = await api.post(route).send(objectSubmission);
    expectBadRequestResponse(response);

    expect(response.body.errors).toBeDefined();

    let errorReceived = false;

    response.body.errors.forEach(error => {
        if (error.msg === messageResponse) {
            errorReceived = true;
        }
    });

    expect(errorReceived).toBe(true);
}

export const expectBadRequiredBodyAttribute = (response, messageResponse) => {
    let errorReceived = false;

    response.body.errors.forEach(error => {
        if (error.msg === messageResponse) {
            errorReceived = true;
        }
    });

    expect(errorReceived).toBe(true);
}

export const expectLengthOfDatabaseRecordsToBeTheSameWith = async (Model, length) => {
    const records = await Model.findAll();
    expect(records.length).toBe(length);
};





/************************************************
***************** Test  Helpers *****************
*************************************************/

export const apiUrl = '/api/v1';

export const apiRegisterUser = async (userBody) => {
    const response = await api.post(`${apiUrl}/auth/register`).send(userBody);
    return response;
};

export const apiLoginUser = async (userBody) => {
    const response = await api.post(`${apiUrl}/auth/login`).send(userBody);
    return response;
};

export const apiLoginTestUser = async (userBody) => {
    const response = await api.post(`${apiUrl}/auth/login/test`).send(userBody);
    return response;
};

export const apiPost = async (route, body) => {
    const response = await api.post(apiUrl + route).send(body);
    return response;
};

export const apiPostWithAuth = async (route, token, body) => {
    const response = await api.post(apiUrl + route).set('Authorization', `Bearer ${token}`).send(body);
    return response;
};

export const apiPut = async (route, body) => {
    const response = await api.put(apiUrl + route).send(body);
    return response;
};

export const apiPutWithAuth = async (route, token, body) => {
    const response = await api.put(apiUrl + route).set('Authorization', `Bearer ${token}`).send(body);
    return response;
};

export const apiDelete = async (route) => {
    const response = await api.delete(apiUrl + route);
    return response;
};

export const apiDeleteWithAuth = async (route, token) => {
    const response = await api.delete(apiUrl + route).set('Authorization', `Bearer ${token}`);
    return response;
};

export const apiGet = async (route) => {
    const response = await api.get(apiUrl + route);
    return response;
};

export const apiGetWithAuth = async (route, token) => {
    const response = await api.get(apiUrl + route).set('Authorization', `Bearer ${token}`);
    return response;
};

export const after1s = (apiFunc, ...args) => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {  resolve(await apiFunc(...args)); }, 1000);
    });
};



/************************************************
***************** Data Examples *****************
*************************************************/

export const initialUsers = [
    { email: "firstemail@example.com", password: "firstPassword#123" },
    { email: "secondemail@example.com", password: "secondPassword#321" }
]

export let initialProfiles = [
    {
        name: 'Primer',
        lastname: 'Ejemplo',
        birthday: "1987-06-24",
        picture: 'http://www.example.com/image.png',
        admin: true,
        college: 'Universidad Nacional de Colombia',
        review: 'Lorem ipsum dolor sit amet, consectetur',
        userId: 1
    },
    {
        name: 'Segundo',
        lastname: 'Ejemplo',
        birthday: "2002-04-15",
        picture: 'http://www.example.com/image.png',
        admin: false,
        college: 'Universidad Nacional de Peru',
        review: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        userId: 2
    }
]



/************************************************
************* Data Examples Helpers *************
*************************************************/


export const getRandInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

export const randName = () => {
    const _array = [
        "Shelby", "Landyn", "Anderson", "Elvis", "Jaydan", "Jaylynn", "Emanuel", "Arjun", "Porter", "Cullen", "Darren", "Branson",
    ];
    return _array[getRandInteger(0, _array.length)];
};

export const randLastname = () => {
    const _array = [
        "Cisneros", "Wilcox", "Dean", "Barrett", "Kline", "Lowery", "Petersen", "Mercer", "Brock", "Hill", "Hicks", "Gates",
    ];
    return _array[getRandInteger(0, _array.length)];
};

export const randDate = () => {
    return new Date(
        getRandInteger(2000, 2022), // year
        getRandInteger(1, 13),      // month
        getRandInteger(1, 31)       // day
    );
};

export const randText = (min, max) => {
    const text = `Lorem Ipsum is simply dummy text of the printing 
    and typesetting industry. Lorem Ipsum has been the industry's 
    standard dummy text ever since the 1500s, when an unknown 
    printer took a galley of type and scrambled it to make a 
    type specimen book. It has survived not only five centuries`;

    if (max > text.length)
        max = text.length;

    return text.substring(0, getRandInteger(min, max));
};