import { createSchema } from "graphql-yoga"
import { resolvers } from "./resolvers"

export const schema = createSchema<{ isAdmin: boolean }>({
  typeDefs: `
    enum Choice {
      pour
      contre
      abstention
    }

    type Owner {
      id: Int!
      name: String!
      email: String!
      tantiemes: Float!
    }

    type TokenInfo {
      tokenId: Int!
      weight: Float!
    }

    type Resolution {
      id: Int!
      title: String!
      description: String
    }

    type VoteResult {
      resolutionId: Int!
      choice: Choice!
      totalWeight: Float!
      votesCount: Int!
    }

    type Vote {
      resolutionId: Int!
      choice: Choice!
    }

    type Query {
      resolutions: [Resolution!]!
      adminResults: [VoteResult!]!
      myVotes(token: String!): [Vote!]!
    }

    input VoteInput {
      resolutionId: Int!
      choice: Choice!
    }

    type Mutation {
      login(token: String!): TokenInfo
      vote(token: String!, votes: [VoteInput!]!): Boolean
    }
  `,
  resolvers,
})
