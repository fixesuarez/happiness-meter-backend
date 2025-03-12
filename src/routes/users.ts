import express from "express";
import db from "#src/db/connection";

const router = express.Router();

router.post("/get_or_create/", async (req, res) => {
  if (!db) return;

  const collection = await db.collection("users");
  const query = { email: req.body.email };
  const existingUser = await collection.findOne(query);

  if (!existingUser) {
    const payload = { ...req.body };
    await collection.insertOne(payload);
    res.send(payload).status(204);
  } else {
    res.send(existingUser).status(200);
  }
});

export default router;
