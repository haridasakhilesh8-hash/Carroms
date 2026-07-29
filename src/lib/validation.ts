import { z } from "zod";

export const tournamentCategorySchema = z.enum(["singles", "doubles"]);

export const tournamentFormSchema = z
  .object({
    name: z.string().min(3).max(120),
    description: z.string().max(2000),
    organizerName: z.string().min(2).max(120),
    location: z.string().min(2).max(160),
    startDate: z.string(),
    endDate: z.string(),
    registrationClosesOn: z.string().optional(),
    format: z.enum(["knockout", "round_robin", "group_knockout"]),
    bestOf: z.number().int().positive(),
    visibility: z.enum(["public", "private"]),
    categories: z.array(tournamentCategorySchema).min(1)
  })
  .refine((value) => new Date(value.endDate) >= new Date(value.startDate), {
    message: "End date must be on or after start date",
    path: ["endDate"]
  });

export const playerFormSchema = z.object({
  fullName: z.string().min(2).max(120),
  displayName: z.string().min(2).max(80),
  mobile: z.string().max(20).optional(),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().max(100).optional(),
  organization: z.string().max(120).optional(),
  skillLevel: z.enum(["beginner", "intermediate", "advanced", "professional"])
});

export const doublesTeamSchema = z
  .object({
    name: z.string().min(2).max(120),
    playerOneId: z.string().uuid(),
    playerTwoId: z.string().uuid()
  })
  .refine((value) => value.playerOneId !== value.playerTwoId, {
    message: "A doubles team must contain two distinct players",
    path: ["playerTwoId"]
  });

export const matchGameSchema = z.object({
  gameNumber: z.number().int().positive(),
  sideAScore: z.number().int().min(0),
  sideBScore: z.number().int().min(0)
});

export const matchResultSchema = z
  .object({
    matchId: z.string().uuid(),
    status: z.enum(["scheduled", "live", "completed", "postponed", "cancelled", "abandoned"]),
    resultType: z.enum([
      "normal",
      "walkover",
      "player_withdrawal",
      "team_withdrawal",
      "disqualification",
      "cancelled",
      "abandoned"
    ]),
    winnerSide: z.enum(["side_a", "side_b"]).optional(),
    bestOf: z.number().int().positive(),
    games: z.array(matchGameSchema),
    notes: z.string().max(1000).optional()
  })
  .superRefine((value, ctx) => {
    if (value.status === "completed" && value.resultType !== "cancelled" && value.resultType !== "abandoned" && !value.winnerSide) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Completed matches require a winner",
        path: ["winnerSide"]
      });
    }

    if (value.games.length > value.bestOf) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Game count cannot exceed the best-of limit",
        path: ["games"]
      });
    }
  });
