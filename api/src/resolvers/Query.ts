import { Context } from '../apolloServer';
import { UserDB } from '../schema';
import { usersCollRef, auth } from '../firebase';

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
};
