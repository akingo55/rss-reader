import { feedResolvers } from "@/server/graphql/modules/feed/resolvers";
import {
  feedQueryTypeDefs,
  feedTypeDefs,
  feedMutationTypeDefs,
} from "@/server/graphql/modules/feed/typeDefs";
import { profileResolvers } from "@/server/graphql/modules/profile/resolvers";
import {
  profileQueryTypeDefs,
  profileTypeDefs,
} from "@/server/graphql/modules/profile/typeDefs";
import { subscriptionResolvers } from "@/server/graphql/modules/subscription/resolvers";
import {
  subscriptionMutationTypeDefs,
  subscriptionQueryTypeDefs,
} from "@/server/graphql/modules/subscription/typeDefs";
import { commonTypeDefs } from "@/server/graphql/modules/common/typeDefs";
import {
  articleTypeDefs,
  articleMutationTypeDefs
} from "@/server/graphql/modules/article/typeDefs";
import { articleResolvers } from "@/server/graphql/modules/article/resolvers";

export const typeDefs = /* GraphQL */ `
  ${commonTypeDefs}
  ${profileTypeDefs}
  ${feedTypeDefs}
  ${articleTypeDefs}

  type Query {
    ${feedQueryTypeDefs}
    ${profileQueryTypeDefs}
    ${subscriptionQueryTypeDefs}
  }

  type Mutation {
    ${subscriptionMutationTypeDefs}
    ${feedMutationTypeDefs}
    ${articleMutationTypeDefs}
  }
`;

export const resolvers = {
  Query: {
    ...feedResolvers.Query,
    ...profileResolvers.Query,
    ...subscriptionResolvers.Query,
  },
  Mutation: {
    ...subscriptionResolvers.Mutation,
    ...feedResolvers.Mutation,
    ...articleResolvers.Mutation,
  },
  Feed: {
    ...feedResolvers.Feed,
  },
};
