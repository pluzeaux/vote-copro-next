import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Choice = {
  __typename?: 'Choice';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login?: Maybe<Owner>;
  vote: Array<Vote>;
};


export type MutationLoginArgs = {
  token: Scalars['String']['input'];
};


export type MutationVoteArgs = {
  token: Scalars['String']['input'];
  votes: Array<VoteInput>;
};

export type Owner = {
  __typename?: 'Owner';
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  tantiemes: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  adminResults: Array<VoteResult>;
  myVotes: Array<Vote>;
  resolutions: Array<Resolution>;
};


export type QueryMyVotesArgs = {
  token: Scalars['String']['input'];
};

export type Resolution = {
  __typename?: 'Resolution';
  choices: Array<Choice>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type Vote = {
  __typename?: 'Vote';
  choice: Choice;
  resolution: Resolution;
};

export type VoteInput = {
  choiceId: Scalars['Int']['input'];
  resolutionId: Scalars['Int']['input'];
};

export type VoteResult = {
  __typename?: 'VoteResult';
  choice: Choice;
  resolutionId: Scalars['Int']['output'];
  totalWeight: Scalars['Float']['output'];
  votesCount: Scalars['Int']['output'];
};

export type VoteMutationVariables = Exact<{
  token: Scalars['String']['input'];
  votes: Array<VoteInput> | VoteInput;
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: Array<{ __typename?: 'Vote', resolution: { __typename?: 'Resolution', id: number, title: string, description?: string | null }, choice: { __typename?: 'Choice', id: number, title: string } }> };


export const VoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Vote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"votes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VoteInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"votes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"votes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resolution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"choice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<VoteMutation, VoteMutationVariables>;