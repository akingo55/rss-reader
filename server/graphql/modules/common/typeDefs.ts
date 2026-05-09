export const commonTypeDefs = /* GraphQL */ `
  scalar DateTime

  type PageInfo {
    page: Int!
    perPage: Int!
    totalCount: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }
`;
