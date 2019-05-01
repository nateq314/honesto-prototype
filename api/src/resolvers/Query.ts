import { Context } from '../apolloServer';
import { UserDB, UserGQL } from '../schema';
import { usersCollRef, auth } from '../firebase';
import { authorize } from './Mutations/auth';

export default {
  async current_user(parent: any, args: any, ctx: Context, info: any) {
    if (ctx.user) {
      const authUserRecord = await auth.getUser(ctx.user.uid);
      const userDB = await usersCollRef.doc(ctx.user.uid).get();
      return {
        ...authUserRecord,
        ...(userDB.data() as UserDB),
      };
    }
    return ctx.user;
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
        } as Partial<UserGQL>;
      }),
    );
    return users;
  },
};
