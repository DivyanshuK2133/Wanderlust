const express = require("express");
const User = require("../models/user.js");
const passport = require("passport");
const router = express.Router();
const {saveRedirectUrl}=require("../utils/isLoggedIn.js");
const { renderSignupForm } = require("../controller/user.js");
const userController = require("../controller/user.js");


// router.get("/signup", userController.renderSignupForm);

// router.post("/signup", userController.signup);

// router.get("/login",userController.renderLoginForm);

// router.post("/login", saveRedirectUrl, passport.authenticate('local',{failureRedirect:"/login", failureFlash: true }),userController.login);

// router.get("/logout",userController.logout);


router.route("/signup")
    .get(userController.renderSignupForm)
    .post(userController.signup);

router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate('local',{failureRedirect:"/login", failureFlash: true }),userController.login);

router.route("/logout")
    .get(userController.logout);

module.exports = router;    
