export const profileTypeDefs = /* GraphQL */ `
  type Profile {
    id: ID!
    name: String
    email: String
    avatarUrl: String
  }
`;

export const profileQueryTypeDefs = /* GraphQL */ `
  me: Profile!
`;
