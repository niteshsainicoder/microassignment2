// models/Data.js
import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  day:String,
  age:String,
  gender:String,
  A:Number,
  B:Number,
  C:Number,
  D:Number,
  E:Number,
  F:Number,
});

const Data =   mongoose.models.Data || mongoose.model('Data', dataSchema);
export default Data;
