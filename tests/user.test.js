const request = require("supertest");
const app = require("../src/setup");
const User = require("../src/models/users");
const { userOneId, userOne, populateDatabase } = require("./fixtures/db");

beforeEach(populateDatabase);

test("Test signup a new user", async () => {
    const response = await request(app)
        .post("/users")
        .send({
            name: "Andrew",
            email: "andrew@example.com",
            password: "MyPass777!",
        })
        .expect(201);

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: { name: "Andrew", email: "andrew@example.com" },
        token: user.tokens[0].token,
    });
});

test("Test login existing user", async () => {
    await request(app)
        .post("/users/login")
        .send({
            email: userOne.email,
            password: userOne.password,
        })
        .expect(200);
});

test("Test fail login with bad credentials", async () => {
    await request(app)
        .post("/users/login")
        .send({
            email: "notanemail@example.com",
            password: "notapssword",
        })
        .expect(400);
});

test("Test get user profile", async () => {
    await request(app).get("/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send().expect(200);
});

test("Test fail getting profile for unauthorizated user", async () => {
    await request(app).get("/users/me").send().expect(401);
});

test("Test delete user profile", async () => {
    await request(app).delete("/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send().expect(200);
});

test("Test fail to delete user profile", async () => {
    await request(app).delete("/users/me").send().expect(401);
});

test("Test upload user avatar", async () => {
    await request(app).post("/users/me/avatar").set("Authorization", `Bearer ${userOne.tokens[0].token}`).attach("avatar", "tests/fixtures/profile-pic.jpg").expect(200);
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Test fail to upload user avatar due to file size > 1MB", async () => {
    await request(app).post("/users/me/avatar").set("Authorization", `Bearer ${userOne.tokens[0].token}`).attach("avatar", "tests/fixtures/fall.jpg").expect(400);
});

test("Test update user info", async () => {
    await request(app).patch("/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send({ name: "Mike", email: "wowmikesnewemail@example.com" }).expect(200);
    const user = await User.findById(userOneId);
    expect(user.name).toBe("Mike");
    expect(user.email).toBe("wowmikesnewemail@example.com");
});

test("Test fail to update user info location field does not exist", async () => {
    await request(app).patch("/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send({ location: "Test island" }).expect(400);
});
