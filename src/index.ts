import express, { Response } from "express";
import cors from "cors";
import users from "#src/routes/users";
import score from "#src/routes/score";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", users);
app.use("/scores", score);

app.get("/", (_, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

app.listen(PORT, () => {
  console.log("The server is running");
});
