import { createSchema } from "graphql-yoga";
import { prisma } from "@/server/db/client";

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Feed {
      id: ID!
      title: String!
      rssUrl: String!
    }

    type Query {
      feeds: [Feed!]!
    }
  `,
  resolvers: {
    Query: {
      feeds: async () => {
        return prisma.feed.findMany();
      },
    },
  },
});
