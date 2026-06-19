import type { Request, Response } from "express";
import {
  createMatchSchema,
  listMatchesQuerySchema,
  matchIdParamSchema,
} from "../validations/matches.validations";
import { db } from "../database/db";
import { matches } from "../database/schema";
import { getMatchStatus } from "../utils/match.status";
import { desc } from "drizzle-orm";

// ==================== Get All Matches ====================
export const getMatches = async (req: Request, res: Response) => {
  const { data, error, success } = listMatchesQuerySchema.safeParse(req.query);

  if (!success) {
    return res
      .status(400)
      .json({ error: "Invalid query parameters", details: error.issues });
  }

  const limit = Math.min(data.limit || 50, 100);

  try {
    const matchesList = await db
      .select()
      .from(matches)
      .limit(limit)
      .orderBy(desc(matches.createdAt));

    res.status(200).json({ data: matchesList });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch matches",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

// ==================== Create a New Match ====================
export const createMatch = async (req: Request, res: Response) => {
  const { data, error, success } = createMatchSchema.safeParse(req.body);

  if (!success) {
    return res
      .status(400)
      .json({ error: "Invalid match data", details: error.issues });
  }

  try {
    const [event] = await db
      .insert(matches)
      .values({
        sport: data.sport,
        homeTeam: data.homeTeam,
        awayTeam: data.awayTeam,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        homeScore: data.homeScore,
        awayScore: data.awayScore,
        status: getMatchStatus(data.startTime, data.endTime) || "scheduled",
      })
      .returning();

    res
      .status(201)
      .json({ data: event, message: "Match created successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create match",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
