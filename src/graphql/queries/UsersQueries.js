import { gql } from "apollo-boost";

export const ME_QUERY = gql`
  {
    me {
      id
      username
      email
    }
  }
`;

export const GET_USERS_QUERY = gql`
  {
    users {
      id
      username
      email
    }
  }
`;
