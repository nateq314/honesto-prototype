import { CombinedUserDB, FeedbackDB } from '../schema';
import { feedbacksCollRef } from '../firebase';

export default {
  id: ({ uid }: CombinedUserDB) => {
    console.log('RESOLVER User.id');
    return uid;
  },

  feedbacks_given: async ({ uid }: CombinedUserDB) => {
    const feedbacksQuerySnapshot = await feedbacksCollRef.where('given_by', '==', uid).get();
    const feedbacks_given = feedbacksQuerySnapshot.docs.map((docSnapshot) => {
      const feedback = docSnapshot.data() as FeedbackDB;
      return {
        ...feedback,
        id: docSnapshot.id,
      };
    });
    return feedbacks_given;
  },

  feedbacks_received: async ({ uid }: CombinedUserDB) => {
    const feedbacksQuerySnapshot = await feedbacksCollRef.where('for_user', '==', uid).get();
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
