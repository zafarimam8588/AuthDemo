const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
require("dotenv").config();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


require("./config/database").connect();
const user = require("./routes/user");
app.use("/", user);

app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT} port`)
})
