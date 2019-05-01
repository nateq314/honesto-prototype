import { gql } from 'apollo-boost';

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
