import { prisma } from "@/server/db/client";

export const feedResolvers = {
  Query: {
    feeds: async () => {
      return prisma.feed.findMany();
    },
    feed: async (_parent: unknown, args: { id: number }) => {
      return prisma.feed.findUniqueOrThrow({
        where: { id: Number(args.id) },
      });
    }
  },
  Feed: {
    articles: async (parent: { id: number }, args: { input?: { page?: number; perPage?: number } }) => {
    const page = args.input?.page ?? 1;
    const perPage = args.input?.perPage ?? 30;

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where: { feedId: parent.id },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { publishedAt: "desc" },
      }),
      prisma.article.count({
        where: { feedId: parent.id },
      }),
    ]);

    return {
      nodes: articles,
      pageInfo: {
        page,
        perPage,
        totalCount,
        totalPages: Math.ceil(totalCount / perPage),
        hasNextPage: page * perPage < totalCount,
        hasPreviousPage: page > 1,
      },
    };
  },
}};
