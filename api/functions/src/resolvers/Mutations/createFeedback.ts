import { Context } from '../../apolloServer';
import { authorize } from './auth';
import { firestore, usersCollRef } from '../../firebase';
import { auth } from 'firebase-admin';
import { FeedbacksGivenDB, UserDB, QuestionResponsesDB, QuestionResponseDB } from '../../schema';

interface ResponseInput {
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
      const currentUserDocRef = usersCollRef.doc(current_uid);
      const userData = (await tx.get(currentUserDocRef)).data() as UserDB;
      tx.set(
        usersCollRef.doc(current_uid),
        {
          feedbacks_given: {
            ...userData.feedbacks_given,
            [for_user]: {
              ...userData.feedbacks_given[for_user],
              ...responses.reduce(
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
            },
          } as FeedbacksGivenDB,
        },
        { merge: true },
      );
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
