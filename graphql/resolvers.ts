import prisma from "../lib/prisma"
import { z } from "zod"

// Validation schémas
const VoteInput = z.object({
  resolutionId: z.number().int().positive(),
  choice: z.enum(["pour", "contre", "abstention"]),
})

const VoteArray = z.array(VoteInput).min(1)

export const resolvers = {
  Query: {
    resolutions: async () =>
      prisma.resolution.findMany({ orderBy: { id: "asc" } }),

    adminResults: async (_: unknown, __: unknown, ctx: { isAdmin?: boolean }) => {
      if (!ctx?.isAdmin) throw new Error("Not authorized")

      const raw = await prisma.$queryRaw<
        {
          resolution_id: number
          choice: string
          total_weight: bigint
          votes_count: bigint
        }[]
      >`
        SELECT r.id as resolution_id, v.choice, SUM(v.weight) as total_weight, COUNT(v.id) as votes_count
        FROM "Vote" v
        JOIN "Resolution" r ON r.id = v."resolutionId"
        GROUP BY r.id, v.choice
        ORDER BY r.id;
      `

      return raw.map((r) => ({
        resolutionId: r.resolution_id,
        choice: r.choice,
        totalWeight: Number(r.total_weight), // bigint → number
        votesCount: Number(r.votes_count),   // bigint → number
      }))
    },
  },

  Mutation: {
    login: async (_: unknown, args: { token: string }) => {
      const tokenSchema = z.string().uuid()
      tokenSchema.parse(args.token)

      const t = await prisma.token.findUnique({
        where: { token: args.token },
        include: { owner: true },
      })
      if (!t) throw new Error("Token invalide")
      if (t.usedAt) throw new Error("Token déjà utilisé")

      return { tokenId: t.id, weight: t.owner.tantiemes }
    },

    vote: async (_: unknown, args: { token: string; votes: unknown }) => {
      // validate token and votes payload
      const tokenSchema = z.string().uuid()
      tokenSchema.parse(args.token)
      const parsedVotes = VoteArray.parse(args.votes)

      return await prisma.$transaction(async (tx) => {
        const t = await tx.token.findUnique({
          where: { token: args.token },
          include: { owner: true },
        })
        if (!t) throw new Error("Token invalide")
        if (t.usedAt) throw new Error("Token déjà utilisé")

        // Vérifie que toutes les résolutions existent avant de créer les votes
        const resolutions = await tx.resolution.findMany({
          where: { id: { in: parsedVotes.map((v) => v.resolutionId) } },
        })
        const existingIds = new Set(resolutions.map((r) => r.id))
        for (const v of parsedVotes) {
          if (!existingIds.has(v.resolutionId)) {
            throw new Error(`Resolution ${v.resolutionId} inconnue`)
          }
        }

        // Enregistre les votes
        await tx.vote.createMany({
          data: parsedVotes.map((v) => ({
            choice: v.choice,
            weight: t.owner.tantiemes,
            tokenId: t.id,
            resolutionId: v.resolutionId,
          })),
        })

        // Marque le token comme utilisé
        await tx.token.update({
          where: { id: t.id },
          data: { usedAt: new Date() },
        })

        return true
      })
    },
  },
}
