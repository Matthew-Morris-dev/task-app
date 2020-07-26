const app = require("./setup");
const port = process.env.PORT;

app.listen(port, () => {
    console.log("Server is up on port " + port);
});
