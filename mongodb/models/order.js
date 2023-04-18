import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    status: {
      type: String,
      enum: ['Placed', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Placed',
      price: { type: Number, required: true }
    }
  });
  
  const Order = mongoose.model('Order', orderSchema);
  
 export default Order;