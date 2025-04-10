const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema({
    
  location: { 
    type: String, 
    required: true }, // Location name or address
  
  latitude: { 
    type: Number, 
    required: true }, // Latitude of crime location
  
  longitude: { 
    type: Number, 
    required: true }, // Longitude of crime location

});

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;