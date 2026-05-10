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
import { articleTypeDefs } from "@/server/graphql/modules/article/typeDefs";

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
  },
  Feed: {
    ...feedResolvers.Feed,
  },
};
