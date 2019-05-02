import { Context } from '../apolloServer';
import { UserDB, UserGQL, QuestionDB } from '../schema';
import { usersCollRef, auth, questionsCollRef, firestore } from '../firebase';
import { authorize } from './Mutations/auth';
import { ApolloError } from 'apollo-server-express';

export default {
  async current_user(parent: any, args: any, ctx: Context, info: any) {
    if (ctx.user) {
      const authUserRecord = await auth.getUser(ctx.user.uid);
      const userDB = await usersCollRef.doc(ctx.user.uid).get();
      return {
        ...authUserRecord,
        ...(userDB.data() as UserDB),
        feedbacks_given: [],
        feedbacks_received: [],
      };
    }
    return ctx.user;
  },

  async user(parent: any, args: any, ctx: Context, info: any) {
    authorize(ctx);
    try {
      const authUserRecord = await auth.getUser(args.id);
      const dbUserRecord = (await usersCollRef.doc(args.id).get()).data() as UserDB;
      return {
        ...authUserRecord,
        ...dbUserRecord,
        id: args.id,
        feedbacks_given: [],
        feedbacks_received: [],
      };
    } catch (error) {
      console.error(error);
      throw new ApolloError(error.message);
    }
  },

  async users(parent: any, args: any, ctx: Context, info: any) {
    authorize(ctx);
    const usersQuerySnapshot = await usersCollRef.get();
    const users = await Promise.all(
      usersQuerySnapshot.docs.map(async (userDocSnapshot) => {
        const userAuthRecord = await auth.getUser(userDocSnapshot.id);
        const userDB = userDocSnapshot.data() as UserDB;
        return {
          ...userAuthRecord,
          ...userDB,
          feedbacks_given: [],
          feedbacks_received: [],
        } as Partial<UserGQL>;
      }),
    );
    return users;
  },

  async questions(parent: any, args: any, ctx: Context, info: any) {
    authorize(ctx);
    const questionDocRefs = await questionsCollRef.listDocuments();
    const questionDocSnapshots = await firestore.getAll(...questionDocRefs);
    return questionDocSnapshots.map((snapshot) => ({
      ...(snapshot.data() as QuestionDB),
      id: snapshot.id,
    }));
  },
};
