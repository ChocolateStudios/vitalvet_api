import supertest from "supertest";
import { app } from "../index.js";
import { jest } from '@jest/globals';
import { User } from "../models/User.js";
import { Species } from "../models/Species.js";

jest.setTimeout(60000); // 60 seconds
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

export const expectLengthOfDatabaseInstancesToBeTheSameWith = async (Model, length) => {
    const instancesInDatabase = await Model.findAll();
    expect(instancesInDatabase.length).toBe(length);
};

export const expectOnlyInitialInstancesInDatabase = async (Model, initialInstances, compareFunc) => {
    let instancesInDatabase = await Model.findAll();
    expect(instancesInDatabase.length).toBe(initialInstances.length);

    for (let initialInstance of initialInstances) {
        let isInitialInstance = false;
        for (let instanceInDatabase of instancesInDatabase) {
            const condition = await compareFunc(instanceInDatabase, initialInstance);
            if (condition) {
                isInitialInstance = true;
                instancesInDatabase.splice(instancesInDatabase.indexOf(instanceInDatabase), 1);
                break;
            }
        }
        expect(isInitialInstance).toBe(true);
    }
};

export const expectSameArrayBody = async (bodyArray, expectedArray, compareFunc) => {
    let _bodyArray = bodyArray.map(element => { return { ...element } });
    let _expectedArray = expectedArray.map(element => { return { ...element } });
    await detectInitialInstancesChanges(_expectedArray);

    for (let bodyElement of _bodyArray) {
        let isInitialInstance = false;
        for (let initialInstance of _expectedArray) {
            const condition = await compareFunc(bodyElement, initialInstance);
            if (condition) {
                isInitialInstance = true;
                _bodyArray.splice(_bodyArray.indexOf(bodyElement), 1);
                break;
            }
        }
        expect(isInitialInstance).toBe(true);
    }
}





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
        setTimeout(async () => { resolve(await apiFunc(...args)); }, 1000);
    });
};





/************************************************
***************** Data Examples *****************
*************************************************/

export const initialUsers = [
    { email: "firstemail@example.com", password: "firstPassword#123" },
    { email: "secondemail@example.com", password: "secondPassword#321" }
]

export const initialProfiles = [
    {
        name: 'Primer',
        lastname: 'Ejemplo',
        birthday: "1987-06-24",
        picture: 'http://www.example.com/image.png',
        admin: true,
        college: 'Universidad Nacional de Colombia',
        review: 'Lorem ipsum dolor sit amet, consectetur',
        replaceWithFunc: async () => {
            const user = await User.findOne({ where: { email: 'firstemail@example.com' } });
            return { name: "userId", value: user.id };
        }
    },
    {
        name: 'Segundo',
        lastname: 'Ejemplo',
        birthday: "2002-04-15",
        picture: 'http://www.example.com/image.png',
        admin: false,
        college: 'Universidad Nacional de Peru',
        review: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        replaceWithFunc: async () => {
            const user = await User.findOne({ where: { email: 'secondemail@example.com' } });
            return { name: "userId", value: user.id };
        }
    }
]

export const initialSpecies = [
    { name: "Gato" }, { name: "Perro" }
]

export const initialSubspecies = [
    { 
        name: "Bulldog",
        replaceWithFunc: async () => {
            const species = await Species.findOne({ where: { name: 'Perro' } });
            return { name: "speciesId", value: species.id };
        }
    },
    { 
        name: "Pastor alemán",
        replaceWithFunc: async () => {
            const species = await Species.findOne({ where: { name: 'Perro' } });
            return { name: "speciesId", value: species.id };
        }
    },
]

export const initialOwners = [
    { 
        name: "Hugo",
        lastname: "Parker",
        birthday: "2020-01-01",
        direction: "Av. Example 123 - Bogota",
        phone: "999544555",
        dni: "760987654",
        email: "hugo@example.com"
    },
    { 
        name: "Jorge",
        lastname: "Panza",
        birthday: "2018-11-19",
        direction: "Av. Example 578 - Canada",
        phone: "997898555",
        dni: "760457687",
        email: "jorge@example.com"
    },
]





/************************************************
***************** Other Helpers *****************
*************************************************/

const detectInitialInstancesChanges = async (initialInstances) => {
    for (let initialInstance of initialInstances) {
        for (const propertyOfInstance in initialInstance) {
            if (propertyOfInstance.includes('replaceWithFunc')) {
                const { name, value } = await initialInstance[propertyOfInstance]();
                delete initialInstance[propertyOfInstance];
                initialInstance[name] = value;
            }
        }
    }
};

export const ensureOnlyInitialInstancesExist = async (Model, initialInstances, compareFunc) => {
    let instancesInDatabase = await Model.findAll();
    let _initialInstances = initialInstances.map(element => { return { ...element } });
    await detectInitialInstancesChanges(_initialInstances);

    for (let instanceInDatabase of instancesInDatabase) {
        let isInitialInstance = false;
        for (let initialInstance of _initialInstances) {
            const condition = await compareFunc(instanceInDatabase, initialInstance);
            if (condition) {
                isInitialInstance = true;
                break;
            }
        }
        if (!isInitialInstance) {
            await instanceInDatabase.destroy();
            instancesInDatabase.splice(instancesInDatabase.indexOf(instanceInDatabase), 1);
        }
    }

    for (let initialInstance of _initialInstances) {
        let isMissingInstance = true;
        for (let instanceInDatabase of instancesInDatabase) {
            const condition = await compareFunc(instanceInDatabase, initialInstance);
            if (condition) {
                isMissingInstance = false;
                break;
            }
        }
        if (isMissingInstance) {
            let createdInstance = await Model.create(initialInstance);
            instancesInDatabase.push(createdInstance);
        }
    }
    return instancesInDatabase;
}





/************************************************
***************** Other Helpers *****************
*************************************************/

export const compareUserFunc = async (userInDatabase, initialUser) => {
    const sameEmail = userInDatabase.email === initialUser.email;
    const samePassword = await userInDatabase.comparePassword(initialUser.password);
    return sameEmail && samePassword;
};

export const compareProfileFunc = async (profileInDatabase, initialProfile) => {
    const sameName = profileInDatabase.name === initialProfile.name;
    const sameLastname = profileInDatabase.lastname === initialProfile.lastname;
    return sameName && sameLastname;
};

export const compareSpeciesFunc = async (speciesInDatabase, initialSpecies) => {
    const sameName = speciesInDatabase.name === initialSpecies.name;
    return sameName;
};

export const compareSpeciesWithSubspeciesFunc = async (speciesInDatabase, initialSpecies) => {
    const sameName = speciesInDatabase.name === initialSpecies.name;
    let sameSubspecies = false;
    for (let subspecies of speciesInDatabase.subspecies) {
        for (let initialSubspecies of initialSpecies.subspecies) {
            if (subspecies.name === initialSubspecies.name) {
                sameSubspecies = true;
                break;
            }
        }
        if (!sameSubspecies) {
            return false;
        }
    }
    return sameName;
};

export const compareOwnerFunc = async (ownerInDatabase, initialOwner) => {
    const sameName = ownerInDatabase.name === initialOwner.name;
    const sameLastame = ownerInDatabase.lastname === initialOwner.lastname;
    const sameDirection = ownerInDatabase.direction === initialOwner.direction;
    const sameEmail = ownerInDatabase.email === initialOwner.email;
    return sameName && sameLastame && sameDirection && sameEmail;
};





/************************************************
************** Data Random Helpers **************
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