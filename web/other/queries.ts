import { gql } from 'apollo-boost';

export const FETCH_QUESTIONS = gql`
  query {
    questions {
      id
      text
      order
      choices
      type
    }
  }
`;

export const FETCH_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      first_name
      last_name
    }
  }
`;

export const FETCH_USERS = gql`
  query {
    users {
      id
      email
      first_name
      last_name
      photoURL
      feedbacks_given {
        id
        for_user {
          id
          email
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
      feedbacks_received {
        id
        given_by {
          id
          email
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
  }
`;

export const FETCH_CURRENT_USER = gql`
  query {
    current_user {
      id
      email
      first_name
      last_name
      feedbacks_given {
        id
        for_user {
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
      feedbacks_received {
        id
        given_by {
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
  }
`;
