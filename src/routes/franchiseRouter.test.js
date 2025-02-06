const request = require('supertest');
const app = require('../service');
const {registerRandomUser, generateRandomString, registerRandomAdmin} = require("./testingUtils");

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

describe("franchises",  () => {
    let newFranchisee;
    let adminUser;
    let franchises;
    let store;

    let badId = 52394502

    test("create-franchise", async() => {
        /**
         * Steps to create franchisee:
         * Admin creates a franchise with a diner email. Once the email is validated successfully
         * the diner is made a franchisee.
         */

        //register as admin
        adminUser = await registerRandomAdmin()
        expect(adminUser.token).toBeDefined();

        //register a user
        newFranchisee = await registerRandomUser()
        expect(newFranchisee.user.email).toBeDefined();
        expect(newFranchisee.user.id).toBeDefined();
        expect(newFranchisee.token).toBeDefined();

        //creates franchise
        let res = await request(app)
            .post(`/api/franchise`)
            .set('Authorization', `Bearer ${adminUser.token}`)
            .send({name: "franchise " + generateRandomString(), admins: [{email: newFranchisee.user.email}]})

        expect(res.status).toBe(200);
    });

    test("get-franchises", async () => {
        let res = await request(app)
            .get(`/api/franchise/${newFranchisee.user.id}`)
            .set('Authorization', `Bearer ${newFranchisee.token}`)

        expect(res.status).toBe(200);
        expect(res._body.length).toBeGreaterThan(0)

        franchises = res._body
    });

    test("create-store", async () => {
        expect(franchises[0].id).toBeDefined();

        let res = await request(app)
            .post(`/api/franchise/${franchises[0].id}/store`) //TODO: pass id store
            .set('Authorization', `Bearer ${adminUser.token}`)
            .send({franchiseId: franchises[0].id, "name":"SLC"})

        expect(res.status).toBe(200);
        store = res.body

        expect(store).toBeDefined()
    });

    test("create-store-bad", async () => {

        expect(franchises[0].id).toBeDefined();

        let res = await request(app)
            .post(`/api/franchise/${badId}/store`) //TODO: pass id store
            .set('Authorization', `Bearer ${adminUser.token}`)
            .send({franchiseId: franchises[0].id, "name":"SLC"})

        expect(res.status).toBe(500);
    })

    test("delete-store", async () => {
        expect(store.id).toBeDefined()

        const res = await request(app)
            .delete(`/api/franchise/${franchises[0].id}/store/${store.id}`)
            .set('Authorization', `Bearer ${adminUser.token}`)

        expect(res.status).toBe(200);
    })

    test("delete-store-bad", async () => {
        const res = await request(app)
            .delete(`/api/franchise/asdf/store/asdf`)

        expect(res.status).toBe(401);
    })

    test("delete-franchise-bad", async () => {
        expect(newFranchisee.token).toBeDefined()

        let res = await request(app)
            .delete(`/api/franchise/12391239}`) //Bad id
            .set('Authorization', `Bearer ${newFranchisee.token}`) //wrong token passed

        expect(res.status).toBe(403);
    })

    test("delete-franchise", async () => {
        expect(franchises[0].id).toBeDefined()

        let res = await request(app)
            .delete(`/api/franchise/${franchises[0].id}`)
            .set('Authorization', `Bearer ${adminUser.token}`)

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('franchise deleted');
    })
})

