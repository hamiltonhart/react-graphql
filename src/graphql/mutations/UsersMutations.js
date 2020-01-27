import { gql } from "apollo-boost";

export const CREATE_USER_MUTATION = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      user {
        id
        username
      }
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation($id: Int!, $username: String!, $email: String!) {
    updateUser(id: $id, username: $username, email: $email) {
      user {
        id
        username
        email
      }
    }
  }
`;
