const request = require("supertest");
const app = require("../app");

async function registerAndGetToken() {
  const email = `habits_${Date.now()}_${Math.random().toString(16).slice(2)}@example.com`;
  const password = "secret123";

  const registerRes = await request(app)
    .post("/api/auth/register")
    .send({ email, password });

  expect(registerRes.statusCode).toBe(201);
  return registerRes.body.token;
}

describe("Habits routes", () => {
  it("creates a habit and returns it in the list", async () => {
    const token = await registerAndGetToken();

    const createRes = await request(app)
      .post("/api/habits")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Read 10 pages", description: "Night reading" });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body.name).toBe("Read 10 pages");

    const listRes = await request(app)
      .get("/api/habits")
      .set("Authorization", `Bearer ${token}`);

    expect(listRes.statusCode).toBe(200);
    const created = listRes.body.find((habit) => habit.id === createRes.body.id);
    expect(created).toBeDefined();
    expect(created.completed_today).toBe(false);
  });

  it("marks and unmarks completion for today", async () => {
    const token = await registerAndGetToken();

    const createRes = await request(app)
      .post("/api/habits")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Stretch", description: "5 minutes" });

    const habitId = createRes.body.id;

    const completeRes = await request(app)
      .post(`/api/habits/${habitId}/complete`)
      .set("Authorization", `Bearer ${token}`);

    expect(completeRes.statusCode).toBe(201);

    const uncompleteRes = await request(app)
      .delete(`/api/habits/${habitId}/complete`)
      .set("Authorization", `Bearer ${token}`);

    expect(uncompleteRes.statusCode).toBe(204);
  });

  it("updates and deletes a habit", async () => {
    const token = await registerAndGetToken();

    const createRes = await request(app)
      .post("/api/habits")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Walk", description: "15 min" });

    const habitId = createRes.body.id;

    const updateRes = await request(app)
      .put(`/api/habits/${habitId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Walk Outside", description: "20 min" });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.name).toBe("Walk Outside");

    const deleteRes = await request(app)
      .delete(`/api/habits/${habitId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.statusCode).toBe(204);
  });

  it("returns streak and timestamp history", async () => {
    const token = await registerAndGetToken();

    const createRes = await request(app)
      .post("/api/habits")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Journal", description: "Write one line" });

    const habitId = createRes.body.id;

    await request(app)
      .post(`/api/habits/${habitId}/complete`)
      .set("Authorization", `Bearer ${token}`);

    const streakRes = await request(app)
      .get(`/api/habits/${habitId}/streak`)
      .set("Authorization", `Bearer ${token}`);

    expect(streakRes.statusCode).toBe(200);
    expect(typeof streakRes.body.streak).toBe("number");

    const historyRes = await request(app)
      .get(`/api/habits/${habitId}/history`)
      .set("Authorization", `Bearer ${token}`);

    expect(historyRes.statusCode).toBe(200);
    expect(Array.isArray(historyRes.body.history)).toBe(true);
    expect(historyRes.body.history.length).toBeGreaterThan(0);
    expect(typeof historyRes.body.history[0]).toBe("string");
  });
});
