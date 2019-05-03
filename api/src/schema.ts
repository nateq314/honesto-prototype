import { gql } from 'apollo-server-express';
import { auth } from 'firebase-admin';

export interface FeedbackDB {
  for_user: string;
  given_by: string;
  responses: QuestionResponsesDB;
}

export interface FeedbackGQL {
  id?: string;
  for_user?: UserGQL;
  given_by?: UserGQL;
  responses?: QuestionResponseGQL[];
}

export interface QuestionDB {
  text: string;
  type: number;
  order: number;
  choices?: string[];
}

export interface QuestionGQL {
  id?: string;
  text?: string;
  type?: number;
  order?: number;
  choices?: string[];
}

export interface QuestionResponseDB {
  multi?: number;
  numerical?: number;
  text?: string;
}

export interface QuestionResponsesDB {
  // key is the Question document ID
  [key: string]: QuestionResponseDB;
}

export interface QuestionResponseGQL {
  question?: QuestionGQL;
  multi?: number;
  numerical?: number;
  text?: string;
}

export interface UserDB {
  first_name: string;
  last_name: string;
  avatar_url: string;
}

export type CombinedUserDB = UserDB & auth.UserRecord;

export interface UserGQL {
  disabled?: boolean;
  displayName?: string;
  email?: string;
  feedbacks_given?: FeedbackGQL[];
  feedbacks_received?: FeedbackGQL[];
  first_name?: string;
  id: string;
  last_name?: string;
  phoneNumber?: string;
  photoURL?: string;
}

const schema = gql`
  scalar DateTime
  scalar JSON

  type Feedback {
    id: String!
    given_by: User!
    for_user: User!
    responses: [QuestionResponse!]!
  }

  type LoginResult {
    error: String
    user: User
  }

  type Mutation {
    setFeedback(for_user: String!, response: ResponseInput!): Feedback!
    login(idToken: String, session: String): LoginResult!
    logout: LoginResult!
    register(email: String!, password: String!, first_name: String!, last_name: String!): Result!
  }

  type Query {
    current_user: User
    questions: [Question!]!
    users: [User!]!
    user(id: ID!): User
  }

  type Question {
    id: ID!
    text: String!
    order: Int!
    choices: [String]
    type: Int!
  }

  type QuestionResponse {
    question: Question!
    multi: Int
    numerical: Int
    text: String
  }

  input ResponseInput {
    question_id: String!
    multi: Int
    numerical: Int
    text: String
  }

  type Result {
    success: Boolean!
    message: String
  }

  type Subscription {
    userEvents: UserMutationEvent!
  }

  type User {
    avatar_url: String!
    id: ID!
    disabled: Boolean!
    displayName: String
    email: String!
    first_name: String!
    last_name: String!
    phoneNumber: String
    photoURL: String
    feedbacks_given: [Feedback!]!
    feedbacks_received: [Feedback!]!
  }

  type UserMutationEvent {
    metadata: JSON
  }
`;

export default schema;

/**
 * users
 *   id
 *   email
 *   first_name
 *   last_name
 *   feedbacks_given
 *     for_user
 *       id
 *       email
 *       first_name
 *       last_name
 *     responses
 *       question
 *         id
 *         text
 *         order
 *         type
 *         choices
 *       multi
 *       numerical
 *       text
 */
