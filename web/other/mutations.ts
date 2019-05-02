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

export const UPDATE_FEEDBACK = gql`
  mutation UpdateFeedback($for_user: String!, $response: ResponseInput!) {
    updateFeedback(for_user: $for_user, response: $response) {
      success
      message
    }
  }
`;
