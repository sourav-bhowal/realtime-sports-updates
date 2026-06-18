import { Router } from "express";
import { getMatches, getMatchById } from "../controllers/match.controllers";

const matchesRouter = Router();

matchesRouter.get("/", getMatches);
matchesRouter.get("/:id", getMatchById);

export default matchesRouter;
