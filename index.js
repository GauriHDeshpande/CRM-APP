const express = require("express");
const mongoose = require("mongoose");
const dbConfig = require("./configs/db.config");
const authController = require("./controllers/auth.controller");

const app = express();
app.use(express.json());

mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection
db.on("Error", () => console.log("Can't connect to DB"));
db.once("Open", () => console.log("Conected to mongoDB"));

app.post('/crm/api/auth/signup', authController.signup);

app.get('/', (req, res) => res.send("Hello World...!"));
app.listen(3333, () => console.log("Listning to localhost 3333"));