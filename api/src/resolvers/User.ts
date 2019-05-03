import { CombinedUserDB, FeedbackDB } from '../schema';
import { feedbacksCollRef } from '../firebase';
import { Context } from '../apolloServer';
import { auth } from 'firebase-admin';

export default {
  id: ({ uid }: CombinedUserDB) => {
    return uid;
  },

  feedbacks_given: async ({ uid }: CombinedUserDB, _args: any, ctx: Context) => {
    console.log('RESOLVER: feedbacks_given');
    let query: FirebaseFirestore.Query;
    const current_uid = (ctx.user as auth.DecodedIdToken).uid;
    if (uid === current_uid) {
      // This is the currently signed in user, so
      // we want to know the feedback given for all users
      query = feedbacksCollRef.where('given_by', '==', uid);
    } else {
      // Otherwise, this is for a user other than the one signed in.
      // So only return the feedback given for the signed-in user, if any.
      query = feedbacksCollRef.where('given_by', '==', uid).where('for_user', '==', current_uid);
    }
    const feedbacksQuerySnapshot = await query.get();
    const feedbacks_given = feedbacksQuerySnapshot.docs.map((docSnapshot) => {
      const feedback = docSnapshot.data() as FeedbackDB;
      return {
        ...feedback,
        id: docSnapshot.id,
      };
    });
    console.log('feedbacks_given:', feedbacks_given);
    return feedbacks_given;
  },

  feedbacks_received: async ({ uid }: CombinedUserDB, _args: any, ctx: Context) => {
    let query: FirebaseFirestore.Query;
    const current_uid = (ctx.user as auth.DecodedIdToken).uid;
    if (uid === current_uid) {
      // This is the currently signed-in user, so we want to know
      // the feedback received from all other users.
      query = feedbacksCollRef.where('for_user', '==', uid);
    } else {
      // Otherwise, this is for a user other than the one signed in.
      // So only return the feedback received from (given by) the signed-in user, if any.
      query = feedbacksCollRef.where('for_user', '==', uid).where('given_by', '==', current_uid);
    }
    const feedbacksQuerySnapshot = await query.get();
    const feedbacks_received = feedbacksQuerySnapshot.docs.map((docSnapshot) => {
      const feedback = docSnapshot.data() as FeedbackDB;
      return {
        ...feedback,
        id: docSnapshot.id,
      };
    });
    return feedbacks_received;
  },
};
