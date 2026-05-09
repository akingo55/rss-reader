import { feedResolvers } from "@/server/graphql/modules/feed/resolvers";
import {
  feedQueryTypeDefs,
  feedTypeDefs,
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

export const typeDefs = /* GraphQL */ `
  ${commonTypeDefs}
  ${profileTypeDefs}
  ${feedTypeDefs}

  type Query {
    ${feedQueryTypeDefs}
    ${profileQueryTypeDefs}
    ${subscriptionQueryTypeDefs}
  }

  type Mutation {
    ${subscriptionMutationTypeDefs}
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
  },
  Feed: {
    ...feedResolvers.Feed,
  },
};
