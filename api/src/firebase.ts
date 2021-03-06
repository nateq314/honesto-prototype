import * as firebaseAdmin from 'firebase-admin';
import { AuthError } from './utils';
// tslint:disable-next-line:no-import-side-effect
import 'firebase/auth';

const serviceAccount = require('../credentials.json');

export const admin = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://theorem-prototype.firebaseio.com',
});

// returns cookie token
async function createUserSessionToken(
  args: any,
  decodedIdToken?: firebaseAdmin.auth.DecodedIdToken,
) {
  // Get the ID token.
  const idToken = args.idToken.toString();
  // Only process if the user just signed in in the last 5 minutes.
  // To guard against ID token theft, reject and require re-authentication.
  if (!decodedIdToken) {
    // tslint:disable-next-line:no-parameter-reassignment
    decodedIdToken = await admin.auth().verifyIdToken(idToken);
  }
  if (!(new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60))
    throw new AuthError({ message: 'Recent sign-in required!' });

  // Set session expiration to 14 days.
  const days = 14;
  const expiresIn = 60 * 60 * 24 * days * 1000;

  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.
  const sessionCookie = await admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .catch((error) => {
      console.error(error);
      throw new AuthError({
        message: 'User Session Token Creation Error',
        stack: error,
      });
    });
  return [sessionCookie, expiresIn] as [string, number];
}

// Returns decoded user claims
async function verifyUserSessionToken(token: string) {
  // Verify session cookies tokens with firebase admin.
  // This is a low overhead operation.
  try {
    const decodedClaims = await admin.auth().verifySessionCookie(token, true /** checkRevoked */);
    return decodedClaims;
  } catch (error) {
    console.error(error);
    throw new AuthError({ message: 'User Session Token Verification Error' });
  }
}

async function verifyIdToken(idToken: string) {
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken, true);
    return decodedIdToken;
  } catch (error) {
    console.error(error);
    throw new AuthError({
      message: `User Session Token Verification Error: ${error}`,
    });
  }
}

export const firestore = admin.firestore();
export const feedbacksCollRef = firestore.collection('feedbacks');
export const questionsCollRef = firestore.collection('questions');
export const usersCollRef = firestore.collection('users');
export const auth = admin.auth();
export { createUserSessionToken, verifyIdToken, verifyUserSessionToken };
