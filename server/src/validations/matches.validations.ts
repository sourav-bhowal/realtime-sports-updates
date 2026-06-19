import { z } from "zod";

const isoDateStringSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Must be a valid ISO date string",
  });

export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
} as const;

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createMatchSchema = z
  .object({
    sport: z.string().trim().min(1, "Sport is required"),
    homeTeam: z.string().trim().min(1, "Home team is required"),
    awayTeam: z.string().trim().min(1, "Away team is required"),
    startTime: isoDateStringSchema,
    endTime: isoDateStringSchema,
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    const startTime = new Date(data.startTime).getTime();
    const endTime = new Date(data.endTime).getTime();

    if (endTime <= startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "endTime must be after startTime",
      });
    }
  });

export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});

export type ListMatchesQuery = z.infer<typeof listMatchesQuerySchema>;
export type MatchIdParam = z.infer<typeof matchIdParamSchema>;
export type CreateMatchInput = z.infer<typeof createMatchSchema>;
export type UpdateScoreInput = z.infer<typeof updateScoreSchema>;
