const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");

module.exports.isLoggedIn = ((req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","user must be logged in");
        return res.redirect("/login");
    }
    next();
});

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have the permission");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateListingAdd = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
};
module.exports.validateListingEdit = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body.listing);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
};

module.exports. validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
};

module.exports.isAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if((!res.locals.currUser) || (res.locals.currUser && !review.author.equals(res.locals.currUser._id))){
        req.flash("error","You don't have the permission");
        return res.redirect(`/listing/${id}`);
    }
    next();
}