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

export const SET_FEEDBACK = gql`
  mutation SetFeedback($for_user: String!, $response: ResponseInput!) {
    setFeedback(for_user: $for_user, response: $response) {
      id
      for_user {
        avatar_url
        id
        email
        first_name
        last_name
      }
      given_by {
        avatar_url
        id
        email
        first_name
        last_name
      }
      responses {
        question {
          id
          text
          order
          choices
        }
        multi
        numerical
        text
      }
    }
  }
`;
