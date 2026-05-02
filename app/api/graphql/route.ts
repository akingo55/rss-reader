import { createYoga } from "graphql-yoga";
import { schema } from "@/server/graphql/schema";

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
});

export { yoga as GET, yoga as POST };
