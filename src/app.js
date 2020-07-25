const express = require("express");
require("./db/mongoose");

const usersRouters = require("./routers/users");
const tasksRouters = require("./routers/tasks");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(usersRouters);
app.use(tasksRouters);

app.listen(port, () => {
    console.log("Server is up on port " + port);
});
