const mongoose = require("mongoose");
const initData= require("./data.js");
const Listing=require("../models/listing.js");
const mbxGeocodingClient = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = "pk.eyJ1IjoiLWRpdnlhbnNodWstIiwiYSI6ImNseTJsOHhlbDFjODgya3I2aDFjYW1yNTEifQ.NJXhXzZBmLjqIzZaPoCXqA";
const geocodingClient = mbxGeocodingClient({accessToken:mapToken});

 
main()
.then(()=>{console.log("Connected");})
.catch((err)=>{console.log(err);});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/lust");
}

const initDB= async()=>{
    await Listing.deleteMany({});
    let listings = [...initData.data];  
    listings = listings.map((obj)=>({...obj,owner:'668116e5f049091ba7d9149e'}));
    for(listing of listings){
        let response = await geocodingClient.forwardGeocode({
            query: listing.location,
            limit: 1
          })
            .send()
        
        // listing.geometry={coordinates:[80.944581,26.847976]};
        listing.geometry = response.body.features[0].geometry;
    }
    await Listing.insertMany(listings);
    console.log("data was initialised");

}

initDB();
