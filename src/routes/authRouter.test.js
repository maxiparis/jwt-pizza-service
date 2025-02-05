const request = require('supertest');
const app = require('../service');
const {registerRandomUser, expectValidJwt, generateRandomEmail, generateRandomString} = require("./testingUtils");

let testUserAuthToken;
jest.setTimeout(60 * 1000 * 5); // 5 minutes

beforeAll(async () => {
    const registerRes = await registerRandomUser();
    testUserAuthToken = registerRes.token;
    expectValidJwt(testUserAuthToken);
});

test('register-bad', async () => {
    const badUser = { name: 'pizza diner', email: 'reg@test.com', password: '' };
    const badRegisterRes = await request(app).post('/api/auth').send(badUser);
    expect(badRegisterRes.status).toBe(400);
})

test("logout-bad", async () => {
    //sending
    const resp = await request(app)
        .delete('/api/auth')
        .set('Authorization', `Bearer BAD-TOKEN`);
    expect(resp.status).toBe(401);
})

test("logout", async () => {
    const registerRes = await registerRandomUser();

    const token = registerRes.token
    const resp = await request(app)
        .delete('/api/auth')
        .set('Authorization', `Bearer ${token}`);

    expect(resp.status).toBe(200);
})

test('login', async () => {
    const newUser = await registerRandomUser()

    const loginRes = await request(app).put('/api/auth').send({email: newUser.user.email, password: newUser.user.password});
    expect(loginRes.status).toBe(200);
    expectValidJwt(loginRes.body.token);

    expect(loginRes.body.user.id).toBe(newUser.user.id);
    expect(loginRes.body.user.name).toBe(newUser.user.name);
    expect(loginRes.body.user.email).toBe(newUser.user.email);
    expect(loginRes.body.user.roles.role).toBe(newUser.user.roles.role);
});

test('login-bad', async () => {
    const newUser = await registerRandomUser()

    const loginRes = await request(app).put('/api/auth').send({email: newUser.user.email, password: "BAD-PASS"});
    expect(loginRes.status).toBe(404);
});

test('updateUser', async () => {
    const newUser = await registerRandomUser()
    const { user: { id }, token } = newUser;

    const changes = {email: generateRandomEmail(), password: generateRandomString()};
    const response = await request(app)
        .put(`/api/auth/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(changes);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(newUser.user.id)
    expect(response.body.name).toBe(newUser.user.name)
    expect(response.body.email).toBe(changes.email)

});

test('updateUser-bad', async () => {
    const newUser = await registerRandomUser()
    const { token } = newUser;

    const changes = {email: generateRandomEmail(), password: generateRandomString()};
    const response = await request(app)
        .put(`/api/auth/99999`) //bad id
        .set('Authorization', `Bearer ${token}`)
        .send(changes);

    expect(response.status).toBe(403);
});
