import { prisma } from "@/server/db/client";
import { createArticleInputSchema } from "@/server/graphql/modules/article/validation";
import { toGraphQLError } from "@/server/graphql/errors";

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
      try {
        const { feedId, title, url, summary, publishedAt } = createArticleInputSchema.parse(args.input);
        const feed = await prisma.feed.findUniqueOrThrow({
          where: { id: Number(feedId) },
        });

        return await prisma.article.create({
          data: {
            feedId: feed.id,
            title: title,
            url: url,
            summary: summary ?? null,
            publishedAt: publishedAt ? new Date(publishedAt) : null,
          },
        });
      } catch (error) {
        throw toGraphQLError(error);
      }
    }
  }
}
