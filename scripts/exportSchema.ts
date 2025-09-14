// scripts/exportSchema.ts
import { schema } from "@/graphql/schema";
import { writeFileSync } from "fs";
import { printSchema } from "graphql";

writeFileSync("graphql/schema.graphql", printSchema(schema));
console.log("✅ Schéma GraphQL exporté vers schema.graphql");
