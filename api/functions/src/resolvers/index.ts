import { firestore } from 'firebase-admin';
import Mutation from './Mutations';
import Query from './Query';
import User from './User';
import Feedback from './Feedback';

const GraphQLJSON = require('graphql-type-json');
const { GraphQLDateTime } = require('graphql-iso-date');

// subscriptions go on separate subscription-only api server
export default {
  // monkey patch serialize() because Cloud Firestore returns timestamps as a
  // proprietary Timestamp object that the original GraphQLDateTime serializer
  // doesn't recognize.
  DateTime: {
    ...GraphQLDateTime,
    serialize: (value: Date | firestore.Timestamp) =>
      value instanceof Date ? value : GraphQLDateTime.serialize(value.toDate()),
  },
  Feedback,
  JSON: GraphQLJSON,
  Mutation,
  Query,
  User,
};
