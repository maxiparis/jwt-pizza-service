const request = require('supertest');
const app = require('../service');

const testUser = { name: 'pizza diner', email: 'reg@test.com', password: 'a' };
let testUserAuthToken;
jest.setTimeout(60 * 1000 * 5); // 5 minutes

async function registerRandomUser() {
    testUser.email = Math.random().toString(36).substring(2, 12) + '@test.com';
    const registerRes = await request(app).post('/api/auth').send(testUser);
    expect(registerRes.status).toBe(200);
    return registerRes;
}

beforeAll(async () => {
    const registerRes = await registerRandomUser();
    testUserAuthToken = registerRes.body.token;
    expectValidJwt(testUserAuthToken);
});

test('register-bad', async () => {
    const badUser = { name: 'pizza diner', email: 'reg@test.com', password: '' };
    const badRegisterRes = await request(app).post('/api/auth').send(badUser);
    expect(badRegisterRes.status).toBe(400);
})

test("bad-logout", async () => {
    //sending
    const resp = await request(app)
        .delete('/api/auth')
        .set('Authorization', `Bearer BAD-TOKEN`);
    expect(resp.status).toBe(401);
})

test("good-logout", async () => {
    const registerRes = await registerRandomUser();

    const token = registerRes.body.token
    const resp = await request(app)
        .delete('/api/auth')
        .set('Authorization', `Bearer ${token}`);

    expect(resp.status).toBe(200);
})

test('login', async () => {
    const loginRes = await request(app).put('/api/auth').send(testUser);
    expect(loginRes.status).toBe(200);
    expectValidJwt(loginRes.body.token);

    const expectedUser = { ...testUser, roles: [{ role: 'diner' }] };
    delete expectedUser.password;
    expect(loginRes.body.user).toMatchObject(expectedUser);
});

function expectValidJwt(potentialJwt) {
    expect(potentialJwt).toMatch(/^[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*\.[a-zA-Z0-9\-_]*$/);
}