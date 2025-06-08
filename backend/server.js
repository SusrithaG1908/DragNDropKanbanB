const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Task schema & model
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ["todo", "inprogress", "done"], default: "todo" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  order: Number,
});

const Task = mongoose.model("Task", taskSchema);

// API endpoints

// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find().sort({ order: 1 });
  res.json(tasks);
});

// Add new task
app.post("/tasks", async (req, res) => {
  const { title, description, status, priority, order } = req.body;
  const newTask = new Task({ title, description, status, priority, order });
  await newTask.save();
  res.json(newTask);
});

// Update task
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
  res.json(updatedTask);
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ message: "Task deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});