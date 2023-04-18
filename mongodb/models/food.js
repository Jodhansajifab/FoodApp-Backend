import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: String,
  type: {
    type: String,
    enum: ['delicious food', 'nutritious food', 'fast food', 'beverages', 'dessert']
  },
  deliveryTime: Number,
  price: { type: Number, required: true }
});
const Food = mongoose.model('Food', foodSchema);

export default Food;