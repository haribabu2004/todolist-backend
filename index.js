const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TaskSchema = require("./Models/Task");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("Mongo URI →", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/test")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

app.use(express.json());

app.use("/update", require("./Controller/TaskComplete"));
app.use("/auth", require("./Controller/Authentication"));

app.post("/add", async (req, res) => {
  try {
    const { task, userId } = req.body.task;

    const check = await TaskSchema.findOne({ task, userId });
    if (check) {
      res.status(409);
      return res.json("task already exists");
    }

    const newTask = await TaskSchema.create({ task, userId });
    // await newTask.save();

    res.status(201).json(newTask);
  } catch (err) {
    console.log(err);
  }
});

app.get("/get/:userId", (req, res) => {
  const {userId} = req.params;

  TaskSchema.find(userId)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/delete/:id", (req, res) => {
  TaskSchema.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

port = process.env.port || 3002;
app.listen(port, () => {
  // console.log("Mongo URI:", process.env.MONGO_URI);
  console.log(`Running in ${port}`);
});
