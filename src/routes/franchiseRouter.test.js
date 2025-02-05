const request = require('supertest');
const app = require('../service');
const {registerRandomUser, generateRandomString} = require("./testingUtils");

// let newUser;
//
// beforeAll(async () => {
//     // newUser = registerRandomUser()
//     // token = newUser.token
// })

test("get-franchises-all", async () => {
    const res = await request(app).get('/api/franchise')
    expect(res.status).toBe(200);
})
//
// test("get-franchises-by-id", async () => {
//     const res = await request(app)
//         .set('Authorization', `Bearer ${token}`)
//         .get(`/api/franchise/${newUser.user.id}`)
//
//
//     //TODO: we need to make some franchises for that user
//     expect(res.status).toBe(200);
// })

test("create-franchise-bad", async () => {
    const myUser = await registerRandomUser()

    const res = await request(app)
        .post(`/api/franchise`)
        .set('Authorization', `Bearer ${myUser.token}`)

    expect(res.status).toBe(403);
})

test("create-franchise", async () => {
    //login as admin
    const adminUser = await request(app).put('/api/auth').send({email: "a@jwt.com", password: "admin"});
    expect(adminUser.status).toBe(200);
    expect(adminUser.body.token).toBeDefined();



    const res = await request(app)
        .post(`/api/franchise`)
        .set('Authorization', `Bearer ${adminUser.body.token}`)
        .send({name: "franchise " + generateRandomString(), admins: [{email: "f@jwt.com"}]})

    expect(res.status).toBe(200);
})



// test('updateUser', async () => {
//     const newUser = await registerRandomUser()
//     const { user: { id }, token } = newUser;
//
//     const changes = {email: generateRandomEmail(), password: generateRandomString()};
//     const response = await request(app)
//         .put(`/api/auth/${id}`)
//         .set('Authorization', `Bearer ${token}`)
//         .send(changes);
//
//     expect(response.status).toBe(200);
//     expect(response.body.id).toBe(newUser.user.id)
//     expect(response.body.name).toBe(newUser.user.name)
//     expect(response.body.email).toBe(changes.email)
//
// });
//
//
//
//
