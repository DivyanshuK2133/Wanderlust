const express = require("express");
const router = express.Router();
const Listing=require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListingAdd,validateListingEdit} = require("../utils/isLoggedIn.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListingAdd,wrapAsync(listingController.addListing));

// Add
router.get("/new",isLoggedIn,wrapAsync(listingController.renderAddForm));

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isOwner,isLoggedIn,upload.single('listing[image]'),validateListingEdit,wrapAsync(listingController.updateListing))
.delete(isOwner,isLoggedIn,wrapAsync(listingController.destroyListing));

// EditForm
router.get("/:id/edit",isOwner,isLoggedIn,wrapAsync(listingController.renderEditForm));

module.exports=router;