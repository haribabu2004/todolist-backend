const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TaskSchema = require("./Models/Task");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/TodoList")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

app.use(express.json());

app.use("/update", require("./Controller/TaskComplete"));
app.use("/auth", require("./Controller/Authentication"));

app.post("/add", async (req, res) => {
  try {
    const task = req.body.task;

    const check = await TaskSchema.findOne({ task });
    if (check) {
      res.status(409);
      return res.json("task already exists");
    }

    const newTask = await TaskSchema.create({ task });

    res.status(201).json(newTask);
  } catch (err) {
    console.log(err);
  }
});

app.get("/get", (req, res) => {
  TaskSchema.find()
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

// const todoRoutes = require("./Controller");
// app.use("/api/todos", todoRoutes);

module.exports = app; 

// port = process.env.port || 3002;
// app.listen(port, () => {
//   console.log(`Running in ${port}`);
// });
