import { createSchema } from "graphql-yoga";
import type { GraphQLContext } from "@/server/graphql/context";
import { resolvers, typeDefs } from "@/server/graphql/modules";

export const schema = createSchema<GraphQLContext>({
  typeDefs,
  resolvers,
});
