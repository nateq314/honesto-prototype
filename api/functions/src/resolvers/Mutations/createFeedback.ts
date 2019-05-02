import { Context } from '../../apolloServer';
import { authorize } from './auth';
import { firestore, feedbacksCollRef } from '../../firebase';
import { auth } from 'firebase-admin';
import { QuestionResponsesDB, QuestionResponseDB } from '../../schema';
import { ApolloError } from 'apollo-server-express';

export interface ResponseInput {
  question_id: string;
  multi?: number;
  numerical?: number;
  text?: string;
}

interface CreateFeedbackVariables {
  for_user: string;
  responses: ResponseInput[];
}

export default async function createFeedback(
  _parent: any,
  args: CreateFeedbackVariables,
  ctx: Context,
  _info: any,
) {
  authorize(ctx);
  const current_uid = (ctx.user as auth.DecodedIdToken).uid;
  const { for_user, responses } = args;

  try {
    await firestore.runTransaction(async (tx) => {
      const feedbackQuerySnapshot = await tx.get(
        feedbacksCollRef.where('given_by', '==', current_uid).where('for_user', '==', for_user),
      );
      if (!feedbackQuerySnapshot.empty)
        throw new ApolloError(
          'Feedback for the requested user, by the current user, already exists. ' +
            'To update user feedback, call the updateFeedback mutation instead.',
        );

      const feedbackDocRef = feedbacksCollRef.doc();
      tx.create(feedbackDocRef, {
        given_by: current_uid,
        for_user,
        responses: responses.reduce(
          (allResponses, currResponse) => {
            let questionResponse: QuestionResponseDB = {};
            const { multi, numerical, text } = currResponse;

            if (multi) questionResponse.multi = multi;
            else if (numerical) questionResponse.numerical = numerical;
            else if (text) questionResponse.text = text;

            allResponses[currResponse.question_id] = questionResponse;

            return allResponses;
          },
          {} as QuestionResponsesDB,
        ),
      });
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
