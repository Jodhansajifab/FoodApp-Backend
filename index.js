import express  from 'express';
import mongoose  from'mongoose';
import bodyParser from 'body-parser';
import * as dotenv from "dotenv";
import Food from './mongodb/models/food.js';
import Order from './mongodb/models/order.js';

dotenv.config();

import connectDB from './mongodb/connect.js';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send("Welcome to Food App");
});

app.get('/food', async (req, res) => {
  const { type, maxdeliverytime } = req.query;
  const query = Food.find();
  if (type) {
    query.where('type', type);
  }
  if (maxdeliverytime) {
    query.where('deliveryTime').lte(parseInt(maxdeliverytime));
  }
  const foodItems = await query.exec();
  res.json(foodItems);
});

app.get('/food/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const foodItem = await Food.findById(id);
    if (foodItem) {
      res.json(foodItem);
    } else {
      res.status(404).json({ error: `Food item with ID ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/food', async (req, res) => {
  const { type, maxdeliverytime } = req.query;
  const query = Food.find();
  if (type) {
    query.where('type', type);
  }
  if (maxdeliverytime) {
    query.where('deliveryTime').lte(parseInt(maxdeliverytime));
  }
  const foodItems = await query.exec();
  res.json(foodItems);
});


app.get('/food/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const foodItem = await Food.findById(id);
    if (foodItem) {
      res.json(foodItem);
    } else {
      res.status(404).json({ error: `Food item with ID ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/food', async (req, res) => {
  const { name, type, deliveryTime, price } = req.body;
  const foodItem = new Food({ name, type, deliveryTime, price });
  try {
    const savedItem = await foodItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/food/:id', async (req, res) => {
  const id = req.params.id;
  const { name, type, deliveryTime, price } = req.body;
  try {
    const foodItem = await Food.findByIdAndUpdate(id, { name, type, deliveryTime, price }, { new: true });
    if (foodItem) {
      res.json(foodItem);
    } else {
      res.status(404).json({ error: `Food item with ID ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/food/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) {
      return res.status(404).send({ message: 'Food not found' });
    }
    res.send({ message: 'Food deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.post('/food/order', async (req, res) => {
  try {
    const { foodId } = req.body;
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).send({ message: 'Food not found' });
    }
    const order = new Order({ foodId, status: 'Placed' });
    await order.save();
    res.send({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.put('/food/order/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }
    res.send({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.put('/food/order/cancelled/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }
    res.send({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.get('/food/orders', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const orders = await Order.find(query);
    res.send({ orders });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

const startServer = async () => {
    try {
      connectDB(process.env.MONGODB_URL);
      app.listen(8080, () => {
        console.log("server has started...");
      });
    } catch (error) {
      console.log(error);
    }
  };

  startServer();
