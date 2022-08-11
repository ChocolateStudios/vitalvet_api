import "supertest";

export const expectSuccessfulCreation = (response) => {
    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(201);
    expect(response.type).toBe('application/json');
};

export const expectUnsuccessfulCreation = (response) => {
    expect(response.ok).toBe(false);
    expect(response.type).toBe('application/json');
};