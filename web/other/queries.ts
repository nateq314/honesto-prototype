import { gql } from 'apollo-boost';

export const FETCH_CURRENT_USER = gql`
  query {
    current_user {
      id
      email
      first_name
      last_name
      feedbacks_given
    }
  }
`;
