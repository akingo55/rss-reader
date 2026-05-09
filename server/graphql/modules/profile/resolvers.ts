import { prisma } from "@/server/db/client";
import type { GraphQLContext } from "@/server/graphql/context";

export const profileResolvers = {
  Query: {
    me: async (
      _parent: unknown,
      _args: Record<string, never>,
      context: GraphQLContext,
    ) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      return prisma.profile.findUniqueOrThrow({
        where: { id: context.user.id },
      });
    },
  },
};
