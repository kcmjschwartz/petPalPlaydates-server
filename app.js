require('dotenv').config();
const Express = require('express');
const app = Express()
const dbConnection = require("./db");

const controllers = require("./controllers");

app.use(Express.json());
app.use(require('./middleware/headers'));
app.use("/user", controllers.userController);
app.use("/pet", controllers.petController);


dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(4000, () => {
            console.log(`[Server]: Bless! App is listening on 4000.`);
        });
    })
    .catch((err) => {
        console.log(`[Server]: Uh oh! Server crashed.  Error = ${err}`);
    });

