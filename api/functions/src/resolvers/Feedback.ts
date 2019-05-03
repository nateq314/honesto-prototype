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
    console.log('RESOLVER: given_by');
    const authUserRecord = await auth.getUser(given_by);
    const dbUserRecord = (await usersCollRef.doc(given_by).get()).data() as UserDB;
    const returnObj = {
      ...authUserRecord,
      ...dbUserRecord,
      feedbacks_given: [],
      feedbacks_received: [],
    } as CombinedUserDB;
    console.log('given_by:', returnObj);
    return returnObj;
  },

  for_user: async ({ for_user }: FeedbackDB) => {
    console.log('RESOLVER: for_user');
    const authUserRecord = await auth.getUser(for_user);
    const dbUserRecord = (await usersCollRef.doc(for_user).get()).data() as UserDB;
    const returnObj = {
      ...authUserRecord,
      ...dbUserRecord,
      feedbacks_given: [],
      feedbacks_received: [],
    } as CombinedUserDB;
    console.log('for_user:', returnObj);
    return returnObj;
  },

  responses: async ({ responses }: FeedbackDB) => {
    console.log('RESOLVER: responses');
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
    const responsesGQL = questionsData.map((questionData) => {
      const key = questionData.id as string;
      return {
        ...responses[key],
        question: questionData,
      } as QuestionResponseGQL;
    });
    console.log('for_user:', responsesGQL);
    return responsesGQL;
  },
};
