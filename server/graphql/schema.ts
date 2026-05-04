import { createSchema } from "graphql-yoga";
import { prisma } from "@/server/db/client";
import type { GraphQLContext } from "@/server/graphql/context";

export const schema = createSchema<GraphQLContext>({
  typeDefs: /* GraphQL */ `
    type Profile {
      id: ID!
      name: String
      email: String
      avatarUrl: String
    }

    type Feed {
      id: ID!
      title: String!
      rssUrl: String!
    }

    type Query {
      feeds: [Feed!]!
      me: Profile!
    }
  `,
  resolvers: {
    Query: {
      feeds: async () => {
        return prisma.feed.findMany();
      },
      me: async (_parent, _args, context) => {
        if (!context.user) {
          throw new Error("Unauthorized");
        }
        return prisma.profile.findUniqueOrThrow({
          where: { id: context.user.id }
        });
      },
    },
  },
});
