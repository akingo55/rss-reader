import { prisma } from "@/server/db/client";

type CreateArticleArgs = {
  input: {
    feedId: string;
    title: string;
    url: string;
    summary?: string | null;
    publishedAt?: string | null;
  }
}

export const articleResolvers = {
  Mutation: {
    createArticle: async (_parent: unknown, args: CreateArticleArgs) => {
      const { feedId, title, url, summary, publishedAt } = args.input;
      const feed = await prisma.feed.findUniqueOrThrow({
        where: { id: Number(feedId) },
      });

      return prisma.article.create({
        data: {
          feedId: feed.id,
          title: title,
          url: url,
          summary: summary ?? null,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        },
      });
    }
  }
}
