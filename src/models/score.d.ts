import { ObjectId } from "mongodb";

export interface ExistingScoreQuery {
  _id?: ObjectId;
  user_id: string | ObjectId;
  date: string;
}

export interface ScorePayload {
  _id?: ObjectId;
  score: number;
  comment: string | null;
  user_id: string | ObjectId;
  date: string;
}
export interface ScoreEntry {
  _id?: ObjectId;
  date: Date;
  score: number | null;
  comment?: string;
}
