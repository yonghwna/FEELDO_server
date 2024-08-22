import express, { json } from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  const user = JSON.parse(req.headers["user-code"]);

  let collection = await db.collection("todoList");
  let results = await collection.find({ author: { $eq: user } }).toArray();

  res.send(results).status(200);
});

router.post("/", async (req, res) => {
  let collection = await db.collection("todoList");
  const user = JSON.parse(req.headers["user-code"]);

  let newDocument = req.body;
  newDocument.author = user;
  newDocument.createdAt = new Date();
  newDocument.isComplete = false;

  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

router.patch("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };

  let collection = await db.collection("todoList");
  let targetDocument = await collection.findOne(query);

  const updates = {
    text: req.body.text,
    priority: req.body.priority,
    feel: req.body.feel,
    author: targetDocument.author,
    createdAt: targetDocument.createdAt,
    isComplete: req.body.isComplete,
  };

  try {
    let result = await collection.replaceOne(query, updates);
    res.send(result).status(200);
  } catch (error) {
    console.log(111);
    throw new Error(error);
  }
});

router.delete("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  const collection = db.collection("todoList");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;
