import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

/**모든 todo가져오기 */
router.get("/", async (req, res) => {
  let collection = await db.collection("todoList");

  // let results = await collection.find({}).limit(50).toArray();
  let results = await collection.find({}).toArray();

  res.send(results).status(200);
});

/**새로운 todo 추가하기 */
router.post("/", async (req, res) => {
  let collection = await db.collection("todoList");

  let newDocument = req.body;
  /**기본값 설정 */
  newDocument.createdAt = new Date();
  newDocument.isComplete = false;
  newDocument.feel = "neutral";

  let result = await collection.insertOne(newDocument);

  res.send(result).status(204);
});

/**기존의 todo 중 req의 id와 일치하는 todo 수정하기 */
router.patch("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };
  let collection = await db.collection("todoList");
  let targetDocument = await collection.findOne(query);

  const updates = {
    text: req.body.text,
    priority: req.body.priority,
    createdAt: targetDocument.createdAt,
    isComplete: req.body.isComplete,
    feel: req.body.feel,
  };

  try {
    let result = await collection.replaceOne(query, updates);
    res.send(result).status(200);
  } catch (error) {
    throw new Error(error);
  }
});

/**기존의 todo 중 req의 id와 일치하는 todo 삭제하기 */
router.delete("/:id", async (req, res) => {
  const query = { _id: ObjectId(req.params.id) };

  const collection = db.collection("todoList");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;
