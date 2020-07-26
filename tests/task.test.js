const request = require("supertest");
const app = require("../src/setup");
const Task = require("../src/models/tasks");
const { userOneId, userOne, userTwoId, userTwo, taskOne, taskTwo, taskThree, populateDatabase } = require("./fixtures/db");

beforeEach(populateDatabase);

test("Test should create task for user", async () => {
    const response = await request(app).post("/tasks").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send({ description: "From a test" }).expect(201);
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test("Test should get all tasks for user", async () => {
    const response = await request(app).get("/tasks").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send().expect(200);
    expect(response.body.length).toEqual(2);
});

test("Test user cannot delete another users task", async () => {
    await request(app).delete(`/tasks/${taskOne._id}`).set("Authorization", `Bearer ${userTwo.tokens[0].token}`).send().expect(404);
    const taskOneInDB = Task.findById(taskOne._id);
    expect(taskOneInDB).not.toBeNull();
});
