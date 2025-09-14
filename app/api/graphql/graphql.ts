import { createYoga } from 'graphql-yoga';
import { schema } from '@/graphql/schema'; // ton schema GraphQL
import { NextRequest, NextResponse } from 'next/server';

// Création du serveur GraphQL
const yoga = createYoga({
  schema,
  graphiql: true, // active GraphiQL pour le dev
});

// Export des méthodes HTTP
export async function GET(request: NextRequest) {
  return yoga.handleNodeRequest(request);
}

export async function POST(request: NextRequest) {
  return yoga.handleNodeRequest(request);
}
