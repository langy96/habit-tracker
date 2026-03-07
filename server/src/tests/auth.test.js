const request = require("supertest");
const app = require("../app");

describe("Auth routes", () => {
  it("registers a new user", async () => {
    const email = `register_${Date.now()}@example.com`;
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password: "secret123" });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(email);
    expect(typeof res.body.token).toBe("string");
    expect(res.body.token.length).toBeGreaterThan(20);
  });

  it("logs in an existing user", async () => {
    const email = `login_${Date.now()}@example.com`;
    const password = "secret123";

    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({ email, password });

    expect(registerRes.statusCode).toBe(201);

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email, password });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.user.email).toBe(email);
    expect(typeof loginRes.body.token).toBe("string");
  });
});

describe("Protected habits route", () => {
  it("returns 401 when no token is provided", async () => {
    const res = await request(app).get("/api/habits");
    expect(res.statusCode).toBe(401);
  });
});
