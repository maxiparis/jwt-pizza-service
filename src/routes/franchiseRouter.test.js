const request = require('supertest');
const app = require('../service');
const {registerRandomUser, generateRandomString, registerRandomAdmin} = require("./testingUtils");

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

test("create-franchise-bad", async () => {
    const myUser = await registerRandomUser()

    const res = await request(app)
        .post(`/api/franchise`)
        .set('Authorization', `Bearer ${myUser.token}`)

    expect(res.status).toBe(403);
})


test("create-franchise-and-get-franchise", async () => {
    /**
     * Steps to create franchisee:
     * Admin creates a franchise with a diner email. Once the email is validated successfully
     * the diner is made a franchisee.
     */

    //register as admin
    const adminUser = await registerRandomAdmin()
    expect(adminUser.token).toBeDefined();

    //register a user
    const diner = await registerRandomUser()
    expect(diner.user.email).toBeDefined();
    expect(diner.user.id).toBeDefined();
    expect(diner.token).toBeDefined();

    //creates franchise
    let res = await request(app)
        .post(`/api/franchise`)
        .set('Authorization', `Bearer ${adminUser.token}`)
        .send({name: "franchise " + generateRandomString(), admins: [{email: diner.user.email}]})

    expect(res.status).toBe(200);

    //gets franchises for user diner
    res = await request(app)
        .get(`/api/franchise/${diner.user.id}`)
        .set('Authorization', `Bearer ${diner.token}`)

    expect(res.status).toBe(200);
    expect(res._body.length).toBeGreaterThan(0)

})
