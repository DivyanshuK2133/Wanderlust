const express = require("express");
const router = express.Router({ mergeParams:true});
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview} = require("../utils/isLoggedIn.js")
const {isLoggedIn,isAuthor} = require("../utils/isLoggedIn.js");
const reviewController = require("../controller/review.js");

router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.addReview));

router.delete("/:reviewId",isAuthor,wrapAsync(reviewController.destroyReview));

module.exports= router;