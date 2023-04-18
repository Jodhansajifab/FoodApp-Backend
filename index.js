import express  from 'express';
import mongoose  from'mongoose';
import bodyParser from 'body-parser';
import * as dotenv from "dotenv";
import Food from './mongodb/models/post.js';

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

  try {
    let foods;

    if (type && maxdeliverytime) {
      foods = await Food.find({
        type: type,
        deliveryTime: { $lte: maxdeliverytime },
      });
    } else if (type) {
      foods = await Food.find({ type: type });
    } else {
      foods = await Food.find();
    }

    res.send(foods);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/food/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).send();
    }

    res.send(food);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/food', async (req, res) => {
  const food = new Food(req.body);

  try {
    await food.save();
    res.status(201).send(food);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put('/food/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const food = await Food.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!food) {
      return res.status(404).send();
    }

    res.send(food);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/food/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const food = await Food.findByIdAndDelete(id);

    if (!food) {
      return res.status(404).send();
    }

    res.send(food);
  } catch (err) {
    res.status(500).send(err);
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