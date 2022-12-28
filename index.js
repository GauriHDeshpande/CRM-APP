const express = require("express");
const mongoose = require("mongoose");
const dbConfig = require("./configs/db.config");
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route")
const User = require("./models/user.model");
const bcrypt = require("bcrypt"); 
const constants = require("./utils/constant");

const app = express();
app.use(express.json());

async function init(){
    let user = await User.findOne({userId : "admin"})
    if(user) {
        console.log("Admin user already present");
        return
    }
    try{
        let user = await User.create({
            name : "Gauri",
            userId: "Admin",
            email: "admin@gmail.com",
            userType: "ADMIN",
            password: bcrypt.hashSync("Welcome", 8),
            userStatus: constants.userStatus.approved
        })
        console.log(user);
    }catch(err){
        console.log(err.message);
    }
}

mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection
db.on("error", () => console.log("Can't connect to DB"));
db.once("open", () => {
    console.log("Conected to mongoDB")
    init();
});

authRouter(app);
userRouter(app);

app.get('/', (req, res) => res.send("Hello World...!"));

app.listen(3333, () => console.log("Listning to localhost 3333"));