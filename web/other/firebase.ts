import firebase from 'firebase/app';
import 'firebase/auth';

let app: firebase.app.App;
try {
  app = firebase.app();
} catch (error) {
  try {
    app = firebase.initializeApp({
      apiKey: 'AIzaSyClWiJHlH9_EjnlG-l7281daXGitONbUo4',
      authDomain: 'theorem-prototype.firebaseapp.com',
      projectId: 'theorem-prototype',
    });
  } catch (error2) {
    console.error('error:', error2);
    throw error2;
  }
}

const auth = firebase.auth;
export { auth };
export default app;
