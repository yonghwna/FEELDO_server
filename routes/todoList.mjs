import express, { json } from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

/**모든 todo가져오기 */
router.get("/", async (req, res) => {
  const user = JSON.parse(req.headers["user-code"]);

  let collection = await db.collection("todoList");
  let results = await collection.find({ author: { $eq: user } }).toArray();
  let results2 = await collection.find().toArray();
  console.log("🚀 results:", results, results2);

  res.send(results).status(200);
});

/**새로운 todo 추가하기 */
router.post("/", async (req, res) => {
  let collection = await db.collection("todoList");
  const user = JSON.parse(req.headers["user-code"]);
  console.log("🚀 ~ router.post ~ user:", user);
  let newDocument = req.body;
  /**기본값 설정 */
  newDocument.author = user;
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
  const user = JSON.parse(req.headers["user-code"]);
  console.log(`aa`, user);

  const updates = {
    text: req.body.text,
    priority: req.body.priority,
    author: targetDocument.author,
    createdAt: targetDocument.createdAt,
    isComplete: req.body.isComplete,
    feel: req.body.feel,
  };
  console.log(`asdf`, updates);
  try {
    let result = await collection.replaceOne(query, updates);
    res.send(result).status(200);
  } catch (error) {
    console.log(111);
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
