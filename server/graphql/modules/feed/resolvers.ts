import { prisma } from "@/server/db/client";

export const feedResolvers = {
  Query: {
    feeds: async () => {
      return prisma.feed.findMany();
    },
  },
};
