import { prisma } from "@/server/db/client";
import type { GraphQLContext } from "@/server/graphql/context";

type SubscribeFeedArgs = {
  feedId: string;
};

export const subscriptionResolvers = {
  Query: {
    myFeeds: async (
      _parent: unknown,
      _args: Record<string, never>,
      context: GraphQLContext,
    ) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      return prisma.feed.findMany({
        where: {
          userFeeds: {
            some: {
              profileId: context.user.id,
            },
          },
        },
      });
    },
  },
  Mutation: {
    subscribeFeed: async (
      _parent: unknown,
      args: SubscribeFeedArgs,
      context: GraphQLContext,
    ) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      const feedId = Number(args.feedId);

      await prisma.userFeed.upsert({
        where: {
          profileId_feedId: {
            profileId: context.user.id,
            feedId: feedId,
          },
        },
        create: {
          profileId: context.user.id,
          feedId: feedId,
        },
        update: {},
      });

      return prisma.feed.findUniqueOrThrow({
        where: { id: feedId },
      });
    },
  },
};
