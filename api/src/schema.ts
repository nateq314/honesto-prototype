import { gql } from 'apollo-server-express';
import { auth } from 'firebase-admin';

export interface UserDB {
  first_name: string;
  last_name: string;
}

export type CombinedUserDB = UserDB & auth.UserRecord;

export interface UserGQL {
  disabled?: boolean;
  displayName?: string;
  email?: string;
  first_name?: string;
  id: string;
  last_name?: string;
  phoneNumber?: string;
  photoURL?: string;
}

const schema = gql`
  scalar DateTime
  scalar JSON

  type LoginResult {
    error: String
    user: User
  }

  type Mutation {
    login(idToken: String, session: String): LoginResult!
    logout: LoginResult!
    register(email: String!, password: String!, first_name: String!, last_name: String!): Result!
  }

  type Query {
    current_user: User
  }

  type Result {
    success: Boolean!
    message: String
  }

  type Subscription {
    userEvents: UserMutationEvent!
  }

  type User {
    id: ID!
    disabled: Boolean!
    displayName: String
    email: String!
    first_name: String!
    last_name: String!
    phoneNumber: String
    photoURL: String
  }

  type UserMutationEvent {
    metadata: JSON
  }
`;

export default schema;
