import { createYoga } from "graphql-yoga";
import { schema } from "@/server/graphql/schema";
import { createClient } from "@/lib/supabase/server";
import type { GraphQLContext } from "@/server/graphql/context";
import { createGraphQLObservabilityPlugin } from "@/server/graphql/observability";

type ServerContext = Record<never, never>;
const yoga = createYoga<ServerContext, GraphQLContext>({
  schema,
  graphqlEndpoint: "/api/graphql",
  plugins: [createGraphQLObservabilityPlugin()],
  context: async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return { user };
  },
});

export async function GET(request: Request) {
  return yoga.handleRequest(request, {});
}

export async function POST(request: Request) {
  return yoga.handleRequest(request, {});
}
