import { GraphQLError } from "graphql";
import prisma from "@/lib/prisma";
import { z } from "zod";

// --- Validation des inputs ---
const ChoiceInput = z.object({
  id: z.number().int().positive(),
  title: z.string(),
});

const VoteInputZod = z.object({
  resolutionId: z.number().int().positive(),
  choiceId: z.number().int().positive(),
});

const VoteArrayZod = z.array(VoteInputZod).min(1);

export const resolvers = {
  Query: {
    resolutions: async () =>
      prisma.resolution.findMany({ orderBy: { id: "asc" }, include: { choices: true } }),

    adminResults: async (_: unknown, __: unknown, ctx: { isAdmin?: boolean }) => {
      if (!ctx?.isAdmin) throw new Error("Not authorized");

      const raw = await prisma.$queryRaw<
        {
          resolution_id: number;
          choice: string;
          total_weight: bigint;
          votes_count: bigint;
        }[]
      >`
        SELECT r.id as resolution_id, v.choice, SUM(v.weight) as total_weight, COUNT(v.id) as votes_count
        FROM "Vote" v
        JOIN "Resolution" r ON r.id = v."resolutionId"
        GROUP BY r.id, v.choice
        ORDER BY r.id;
      `;

      return raw.map((r) => ({
        resolutionId: r.resolution_id,
        choice: r.choice,
        totalWeight: Number(r.total_weight), // bigint → number
        votesCount: Number(r.votes_count), // bigint → number
      }));
    },
  },

  Mutation: {
    login: async (_: unknown, args: { token: string }, ctx) => {
      // ctx est bien typé : ctx.prisma + ctx.isAdmin
      const token = await ctx.prisma.token.findUnique({
        where: { token: args.token },
        include: { owner: true, assembly: true },
      });

      if (!token) {
        throw new GraphQLError("Token invalide", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      if (token.usedAt) {
        throw new GraphQLError("Token déjà utilisé", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const lastAssembly = await ctx.prisma.assembly.findFirst({
        orderBy: { date: "desc" },
      });

      if (!lastAssembly || token.assemblyId !== lastAssembly.id) {
        throw new Error("Assemblée non créée");
      }

      return token.owner;
    },

    vote: async (
      _: unknown,
      args: { token: string; votes: { resolutionId: number; choiceId: number }[] }
    ) => {
      const { token, votes } = args;

      // Vérif du token
      const tokenRecord = await prisma.token.findUnique({
        where: { token },
        include: { owner: true },
      });

      if (!tokenRecord) {
        throw new GraphQLError("Token invalide", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      if (tokenRecord.usedAt) {
        throw new GraphQLError("Token déjà utilisé", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // Vérif résolutions/choices
      for (const v of votes) {
        const choice = await prisma.choice.findUnique({
          where: { id: v.choiceId },
          include: { resolution: true },
        });
        if (!choice || choice.resolutionId !== v.resolutionId) {
          throw new Error("Choix ou résolution invalide");
        }
      }

      // Création des votes
      const createdVotes = await Promise.all(
        votes.map((v) =>
          prisma.vote.create({
            data: {
              resolutionId: v.resolutionId,
              choiceId: v.choiceId,
              ownerId: tokenRecord.owner.id,
            },
            include: {
              resolution: true,
              choice: true,
            },
          })
        )
      );

      // Marquer le token comme utilisé
      await prisma.token.update({
        where: { id: tokenRecord.id },
        data: { usedAt: new Date() },
      });

      return createdVotes;
    },
  },
};
