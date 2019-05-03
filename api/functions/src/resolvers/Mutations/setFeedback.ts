import { ApolloError } from 'apollo-server-express';
import { auth } from 'firebase-admin';
import { Context } from '../../apolloServer';
import { authorize } from './auth';
import { firestore, feedbacksCollRef } from '../../firebase';
import { FeedbackDB, QuestionResponsesDB } from '../../schema';
import { ResponseInput } from './createFeedback';

interface SetFeedbackVariables {
  for_user: string;
  response: ResponseInput;
}

export default async function setFeedback(
  _parent: any,
  args: SetFeedbackVariables,
  ctx: Context,
  _info: any,
) {
  authorize(ctx);
  const current_uid = (ctx.user as auth.DecodedIdToken).uid;
  const { for_user, response } = args;

  try {
    let feedbackDocRef = feedbacksCollRef.doc();
    await firestore.runTransaction(async (tx) => {
      const feedbackQuerySnapshot = await tx.get(
        feedbacksCollRef.where('given_by', '==', current_uid).where('for_user', '==', for_user),
      );
      if (feedbackQuerySnapshot.size > 1)
        throw new ApolloError(
          'Something went wrong. Found more than one feedback for the given ' +
            'source and target users, where there should be only one.',
        );

      let questionResponsesDB: QuestionResponsesDB;
      let feedbackDB: Partial<FeedbackDB>;
      if (feedbackQuerySnapshot.empty) {
        // CREATE
        feedbackDB = {
          for_user: args.for_user,
          given_by: current_uid,
          responses: {
            [response.question_id]: {
              multi: response.multi,
              numerical: response.numerical,
              text: response.text,
            },
          },
        };
      } else {
        // UPDATE
        feedbackDocRef = feedbackQuerySnapshot.docs[0].ref;
        questionResponsesDB = (feedbackQuerySnapshot.docs[0].data() as FeedbackDB).responses;
        feedbackDB = {
          responses: {
            ...questionResponsesDB,
            [response.question_id]: {
              multi: response.multi,
              numerical: response.numerical,
              text: response.text,
            },
          },
        };
      }
      tx.set(feedbackDocRef, feedbackDB, { merge: true });
    });
    const feedbackSet = {
      ...((await feedbackDocRef.get()).data() as FeedbackDB),
      id: feedbackDocRef.id,
    };
    return feedbackSet;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
}
