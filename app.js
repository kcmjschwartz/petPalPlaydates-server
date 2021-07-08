require('dotenv').config();
const Express = require('express');
const app = Express()
const dbConnection = require("./db");

const controllers = require("./controllers");

app.use(Express.json());
app.use(require('./middleware/headers'));
app.use("/user", controllers.userController);
app.use("/pet", controllers.petController);
app.use("/request", controllers.requestController);
app.use("/review", controllers.reviewController);


dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server]: Bless! App is listening on ${process.env.PORT}.`);
        });
    })
    .catch((err) => {
        console.log(`[Server]: Uh oh! Server crashed.  Error = ${err}`);
    });

