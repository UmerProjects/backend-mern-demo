const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

let url =
  "mongodb+srv://Demo:Demo123@cluster0.zkqeg0k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// MongoDB Connection
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Schema & Model
const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model("Item", ItemSchema);

app.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({error: "Fetching items"})
  }
});

// Routes
app.get("/api/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post("/api/items", async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

app.put("/api/items/:id", async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedItem);
});

app.delete("/api/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
});

// Start Server
app.listen(PORT, (req, res) => {
  console.log(`Server running on http://localhost:${PORT}`);
});
