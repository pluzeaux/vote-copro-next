import { gql } from "graphql-tag";

export const VoteDocument = gql`
  mutation Vote($token: String!, $votes: [VoteInput!]!) {
    vote(token: $token, votes: $votes) {
      resolution {
        id
        title
        description
      }
      choice {
        id
        title
      }
    }
  }
`;
