import { Router } from "express";
import db from "#src/db/connection";
import {
  ExistingScoreQuery,
  ScoreEntry,
  ScorePayload,
} from "#src/models/score";
import { ObjectId } from "mongodb";
import { fillMissingSundays } from "#src/controllers/score";
import { getUTCDate } from "#src/utils/dates";
import dayjs from "dayjs";

const router = Router();

router.post("/", async (req, res) => {
  if (!db) return;

  const body: ScorePayload = {
    ...req.body,
    user_id: new ObjectId(req.body.user_id as string),
    date: getUTCDate(req.body.date),
  };

  const existingScoreQuery: ExistingScoreQuery = {
    user_id: body.user_id,
    date: body.date,
  };
  const collection = await db.collection("scores");
  const existingScore = await collection.findOne(existingScoreQuery);
  if (existingScore) {
    res.status(400).send({ error: "A score already exists for this week" });
  } else {
    await collection.insertOne(body);
    res.status(201).send(body);
  }
});
router.patch("/:id", async (req, res) => {
  if (!db) return;

  const body: ScorePayload = {
    ...req.body,
    _id: new ObjectId(req.body._id as string),
    user_id: new ObjectId(req.body.user_id as string),
    date: getUTCDate(req.body.date),
  };

  const existingScoreQuery: ExistingScoreQuery = {
    _id: body._id,
    user_id: body.user_id,
    date: body.date,
  };
  const collection = await db.collection("scores");
  const existingScore = await collection.findOne(existingScoreQuery);
  if (!existingScore) {
    res.status(404).send({ error: "Score not found" });
  } else {
    await collection.updateOne(existingScoreQuery, {
      $set: {
        score: body.score,
        comment: body.comment,
      },
    });
    res.status(200).send(body);
  }
});
router.get("/:user_id/", async (req, res) => {
  if (!db) return;

  const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
  const collection = db.collection("scores");
  const results = await collection
    .find({
      user_id: new ObjectId(req.params.user_id),
      date: { $gt: firstDayOfYear },
    })
    .toArray();
  const userScores: ScoreEntry[] = results.map((item) => ({
    _id: item._id,
    date: item.date,
    score: item.score,
    comment: item.comment,
  }));

  const scoresFilled = fillMissingSundays(userScores).map((item) => ({
    ...item,
    date: dayjs(item.date).format("DD-MM-YYYY"),
  }));

  res.status(200).send(scoresFilled);
});

export default router;
