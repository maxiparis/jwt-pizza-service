const request = require("supertest");
const app = require("../service");

function expectValidJwt(potentialJwt) {
    expect(potentialJwt).toMatch(/^[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*$/);
}

function generateRandomEmail() {
    return generateRandomString() + '@test.com';
}

function generateRandomString() {
    return Math.random().toString(36).substring(2, 12);
}

async function registerRandomUser() {
    const user = { name: `test ${generateRandomEmail()}`, email: generateRandomEmail(), password: generateRandomString() };

    const registerRes = await request(app).post('/api/auth').send(user);
    expect(registerRes.status).toBe(200);
    registerRes.body.user.password = user.password;
    return registerRes.body;
}

async function registerRandomAdmin() {
    const user = { name: `admin ${generateRandomEmail()}`, email: generateRandomEmail(), password: generateRandomString() };

    const registerRes = await request(app).post('/api/auth/admin').send(user);
    expect(registerRes.status).toBe(200);
    registerRes.body.user.password = user.password;
    return registerRes.body;
}

async function registerRandomFranchisee() {
    const user = { name: `franchisee ${generateRandomEmail()}`, email: generateRandomEmail(), password: generateRandomString() };

    const registerRes = await request(app).post('/api/auth/franchisee').send(user);
    expect(registerRes.status).toBe(200);
    registerRes.body.user.password = user.password;
    return registerRes.body;
}

module.exports = {
    registerRandomUser,
    generateRandomEmail,
    generateRandomString,
    expectValidJwt,
    registerRandomAdmin,
    registerRandomFranchisee
};
