import { Router } from "express";
import { getMatches, createMatch } from "../controllers/match.controllers";

const matchesRouter = Router();

matchesRouter.route("/").get(getMatches).post(createMatch);

export default matchesRouter;
