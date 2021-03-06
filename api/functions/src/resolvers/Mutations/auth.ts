import * as fbAdmin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as fbClient from 'firebase';
import * as express from 'express';
import { Context } from '../../apolloServer';
import {
  firestore,
  verifyIdToken,
  createUserSessionToken,
  verifyUserSessionToken,
} from '../../firebase';
import { UserGQL, UserDB } from '../../schema';

interface ILogin {
  idToken?: string;
  session?: string;
}

export async function login(parent: any, args: ILogin, ctx: Context, info: any) {
  try {
    let decodedIdToken: fbAdmin.auth.DecodedIdToken;
    let user: Partial<UserGQL>;
    if (args.idToken && args.idToken !== 'undefined') {
      // User just logged in via email/password and either
      // 1: client is calling this in order to set a session cookie, API <-> CLIENT, or
      // 2: SSR backend is calling this in order to fetch the user object
      //    and set the session cookie, SSR <-> CLIENT
      decodedIdToken = await verifyIdToken(args.idToken);
      ctx.user = decodedIdToken;
      const [sessionCookie, expiresIn] = await createUserSessionToken(args, decodedIdToken);
      const options: express.CookieOptions = {
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      };
      ctx.res.cookie('session', sessionCookie, options);
    } else {
      // User is re-visiting the site and automatically reauthenticating using the
      // existing session cookie (SSR <-> CLIENT).
      const sessionCookie = ctx.req.get('session') || '';
      decodedIdToken = await verifyUserSessionToken(sessionCookie);
    }
    user = await getGraphQLUserObject(decodedIdToken);
    return { user };
  } catch (error) {
    console.error(error);
    return {
      error: `Invalid login request: ${error.message}`,
    };
  }
}

export async function logout(parent: any, args: any, ctx: Context, info: any) {
  const sessionCookie = ctx.req.cookies.session || '';
  if (sessionCookie) ctx.res.clearCookie('session');
  return {
    error: 'Session cookie is invalid, or no session to log out of',
  };
}

export async function register(parent: any, args: any, ctx: Context, info: any) {
  try {
    const { email, password, first_name, last_name } = args;
    const userRecord = await fbAdmin.auth().createUser({
      email,
      password,
    });
    // let writeResult: FirebaseFirestore.WriteResult;
    /* writeResult = */ await firestore
      .collection('users')
      .doc(userRecord.uid)
      .create({
        first_name,
        last_name,
        avatar_url:
          'https://firebasestorage.googleapis.com/v0/b/theorem-prototype.appspot.com/o/default.png?alt=media&token=427be978-e1e2-43c0-a275-bcf2477aa480',
      });
    const customToken = await fbAdmin.auth().createCustomToken(userRecord.uid);
    const app = fbClient.initializeApp({
      apiKey: functions.config().fbadmin.apikey,
      authDomain: 'theorem-prototype.now.sh',
      projectId: 'theorem-prototype',
    });
    const userCredential = await app.auth().signInWithCustomToken(customToken);
    if (userCredential.user) {
      await userCredential.user.sendEmailVerification({
        url: 'https://theorem-prototype.now.sh/',
      });
      await app.auth().signOut();
      return { success: true };
    }
    return {
      success: false,
      message:
        'User object created in database but unable to send ' + 'user email verification message',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
}

async function getGraphQLUserObject(decodedIdToken: fbAdmin.auth.DecodedIdToken) {
  const { uid } = decodedIdToken;
  if (!uid) throw new Error('User is not registered.');
  const authUserRecord = await fbAdmin.auth().getUser(uid);
  const userDocSnapshot = await firestore
    .collection('users')
    .doc(uid)
    .get();
  const dbUserRecord = userDocSnapshot.data() as UserDB;
  const user: Partial<UserGQL> = {
    ...authUserRecord,
    ...dbUserRecord,
    // feedbacks_given and feedbacks_received will be resolved in User resolver
    feedbacks_given: [],
    feedbacks_received: [],
  };
  return user;
}

export function authorize(ctx: Context) {
  if (!ctx.user) ctx.res.status(401).send('UNAUTHORIZED REQUEST');
}
