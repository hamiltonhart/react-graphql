import { gql } from "apollo-boost";

export const TOKEN_AUTH_MUTATION = gql`
  mutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;