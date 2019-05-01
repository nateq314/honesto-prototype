import { gql } from 'apollo-boost';

export const LOGOUT = gql`
  mutation {
    logout {
      error
    }
  }
`;

export const REGISTER = gql`
  mutation Register(
    $email: String!
    $password: String!
    $first_name: String!
    $last_name: String!
  ) {
    register(email: $email, password: $password, first_name: $first_name, last_name: $last_name) {
      success
      message
    }
  }
`;
