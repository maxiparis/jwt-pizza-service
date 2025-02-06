const request = require('supertest');
const app = require('../service');



test("get-menu", async () => {
    const res = await request(app)
        .get("/api/order/menu")

    expect(res.status).toBe(200);
})