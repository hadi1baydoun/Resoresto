import mongoose from "mongoose";

const PlaceSchema = new mongoose.Schema({
    owner:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    title : String,
    address : String,
    photos : [String],
    description : String,
    perks:[String],
    extraInfo: String,
    Open : Number,
    Close : Number,
    numbPers : Number,
});

const PlaceModel = mongoose.model('Place',PlaceSchema);
//module.exports = PlaceModel;
export default PlaceModel;