import { ApolloError } from 'apollo-server-express';
import { auth } from 'firebase-admin';
import { Context } from '../../apolloServer';
import { authorize } from './auth';
import { firestore, feedbacksCollRef } from '../../firebase';
import { FeedbackDB } from '../../schema';
import { ResponseInput } from './createFeedback';

interface UpdateFeedbackVariables {
  for_user: string;
  response: ResponseInput;
}

export default async function updateFeedback(
  _parent: any,
  args: UpdateFeedbackVariables,
  ctx: Context,
  _info: any,
) {
  authorize(ctx);
  const current_uid = (ctx.user as auth.DecodedIdToken).uid;
  const { for_user, response } = args;

  try {
    await firestore.runTransaction(async (tx) => {
      const feedbackQuerySnapshot = await tx.get(
        feedbacksCollRef.where('given_by', '==', current_uid).where('for_user', '==', for_user),
      );
      if (feedbackQuerySnapshot.empty)
        throw new ApolloError('This feedback does not exist, so it cannot be updated.');
      if (feedbackQuerySnapshot.size > 1)
        throw new ApolloError(
          'Something went wrong. Found more than one feedback for the given ' +
            'source and target users, where there should be only one.',
        );

      const feedbackDocRef = feedbackQuerySnapshot.docs[0].ref;
      const questionResponsesDB = (feedbackQuerySnapshot.docs[0].data() as FeedbackDB).responses;
      questionResponsesDB[response.question_id] = {
        multi: response.multi,
        numerical: response.numerical,
        text: response.text,
      };
      tx.set(feedbackDocRef, { responses: questionResponsesDB }, { merge: true });
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
}
