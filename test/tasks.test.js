
const request = require("supertest");
const createApp = require("../src/app");

describe("Task Manager API", () => {
  let app;

  // Create a fresh application for each test.
  beforeEach(() => {
    app = createApp();
  });

  test("GET /health should return healthy status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("healthy");
  });

  test("GET /api/tasks should return an empty array initially", async () => {
    const response = await request(app).get("/api/tasks");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });

  test("POST /api/tasks should create a task", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "Learn Docker" });

    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("Learn Docker");
    expect(response.body.data.completed).toBe(false);
  });

  test("POST /api/tasks should reject an empty title", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "" });

    expect(response.status).toBe(400);
  });

  test("GET /api/tasks/:id should return a task", async () => {
    await request(app)
      .post("/api/tasks")
      .send({ title: "Learn Kubernetes" });

    const response = await request(app).get("/api/tasks/1");

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe("Learn Kubernetes");
  });

  test("PUT /api/tasks/:id should update a task", async () => {
    await request(app)
      .post("/api/tasks")
      .send({ title: "Learn Git" });

    const response = await request(app)
      .put("/api/tasks/1")
      .send({ completed: true });

    expect(response.status).toBe(200);
    expect(response.body.data.completed).toBe(true);
  });

  test("DELETE /api/tasks/:id should delete a task", async () => {
    await request(app)
      .post("/api/tasks")
      .send({ title: "Learn CI/CD" });

    const response = await request(app).delete("/api/tasks/1");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Task deleted successfully");
  });

  test("GET /api/tasks/:id should return 404 for missing task", async () => {
    const response = await request(app).get("/api/tasks/999");

    expect(response.status).toBe(404);
  });
});
