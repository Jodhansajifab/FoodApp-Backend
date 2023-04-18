import mongoose from "mongoose";

const Food = mongoose.model('Food', {
    name: String,
    type: String,
    description: String,
    price: Number,
    deliveryTime: Number,
  });

export default Food;