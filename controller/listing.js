 const Listing = require("../models/listing.js");
 const mbxGeocodingClient = require('@mapbox/mapbox-sdk/services/geocoding');
 const mapToken = process.env.MAP_TOKEN;
 const geocodingClient = mbxGeocodingClient({accessToken:mapToken});
 
module.exports.addListing = async(req,res)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()

        
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url+".."+filename)
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    newListing.geometry = response.body.features[0].geometry;
      
    let savedListing = await newListing.save();

    req.flash("success","New Listing Created!");
    res.redirect("/listing");   
}

 module.exports.index = async (req,res)=>{
    let allListings =await Listing.find({}); 
    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderEditForm=async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing doesn't exist");
        res.redirect("/listing");
    }
    res.render("./listings/edit.ejs",{listing});
}

module.exports.renderAddForm = async(req,res)=>{
    res.render("./listings/add.ejs");
};

module.exports.showListing=async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing doesn't exist");
        res.redirect("/listing");
    }
    res.render("./listings/show.ejs",{listing});
}

module.exports.updateListing = async (req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body});

    if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();    
    }    
    req.flash("success","Listing Edited Successfully!");
    res.redirect(`/listing/${id}`);
} 

module.exports.destroyListing = async(req,res)=>{
    let {id}= req.params;
    await Listing.deleteOne({_id:id});
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listing");
}