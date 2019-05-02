import {
  FeedbackDB,
  UserDB,
  CombinedUserDB,
  QuestionDB,
  QuestionResponseGQL,
  QuestionGQL,
} from '../schema';
import { auth, usersCollRef, questionsCollRef, firestore } from '../firebase';

export default {
  given_by: async ({ given_by }: FeedbackDB) => {
    const authUserRecord = await auth.getUser(given_by);
    const dbUserRecord = (await usersCollRef.doc(given_by).get()).data() as UserDB;
    return {
      ...authUserRecord,
      ...dbUserRecord,
      feedbacks_given: [],
      feedbacks_received: [],
    } as CombinedUserDB;
  },

  for_user: async ({ for_user }: FeedbackDB) => {
    const authUserRecord = await auth.getUser(for_user);
    const dbUserRecord = (await usersCollRef.doc(for_user).get()).data() as UserDB;
    return {
      ...authUserRecord,
      ...dbUserRecord,
      feedbacks_given: [],
      feedbacks_received: [],
    } as CombinedUserDB;
  },

  responses: async ({ responses }: FeedbackDB) => {
    const questionDocRefs = Object.keys(responses).map((questionID) =>
      questionsCollRef.doc(questionID),
    );
    const questionDocSnapshots = await firestore.getAll(...questionDocRefs);
    const questionsData = questionDocSnapshots.map(
      (questionDocSnapshot) =>
        ({
          ...(questionDocSnapshot.data() as QuestionDB),
          id: questionDocSnapshot.id,
        } as QuestionGQL),
    );
    return questionsData.map((questionData) => {
      const key = questionData.id as string;
      return {
        ...responses[key],
        question: questionData,
      } as QuestionResponseGQL;
    });
  },
};
