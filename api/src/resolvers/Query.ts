import * as fbAdmin from 'firebase-admin';
import { Context } from '../apolloServer';
import { UserGQL } from '../schema';

export default {
  async current_user(parent: any, args: any, ctx: Context, info: any) {
    if (ctx.user) {
      const userDocSnapshot = await fbAdmin
        .firestore()
        .collection('users')
        .doc(ctx.user.uid)
        .get();
      const user = userDocSnapshot.data() as Partial<UserGQL>;
      user.id = userDocSnapshot.id;
      return user;
    }
    return ctx.user;
  },
};

// function authorize(ctx: Context) {
//   if (!ctx.user) ctx.res.status(401).send('UNAUTHORIZED REQUEST');
// }
