import express, { type Application, type Response } from "express";
import matchesRouter from "./src/routes/matches.routes";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res: Response) => {
  res.send("Hello, World!");
});

app.use("/matches", matchesRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Server is running at http://localhost:${PORT}`);
});
