const express = require("express");
require("./db/mongoose");

const usersRouters = require("./routers/users");
const tasksRouters = require("./routers/tasks");

const app = express();

app.use(express.json());
app.use(usersRouters);
app.use(tasksRouters);

module.exports = app;
