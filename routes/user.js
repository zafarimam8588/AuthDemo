const express = require("express");
const router = express.Router();

const {login,signup,loginPage,signupPage, homePage} = require("../controllers/Auth");
const {auth} = require("../middleware/auth");
router.get("/signup",signupPage)
router.get("/login",loginPage)
router.get("/homepage",homePage)
router.post("/login", login);
router.post("/signup", signup);
module.exports = router;