const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/users");
const Task = require("../../src/models/tasks");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "Mike",
    email: "mike@example.com",
    password: "testPass010",
    tokens: [
        {
            token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
        },
    ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: "Jeffrey",
    email: "jeff@example.com",
    password: "testPass011",
    tokens: [
        {
            token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
        },
    ],
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "This is the first test task",
    completed: false,
    user_id: userOne._id,
};

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "This is the second test task",
    completed: true,
    user_id: userOne._id,
};

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "This is the third test task",
    completed: false,
    user_id: userTwo._id,
};

const populateDatabase = async () => {
    await User.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await Task.deleteMany();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
};

module.exports = { userOneId, userOne, userTwo, userTwoId, taskOne, taskTwo, taskThree, populateDatabase };
