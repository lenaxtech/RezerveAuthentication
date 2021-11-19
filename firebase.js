// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbS6VqerJEJJSVTKFpqvfbPal3WvM6Lsc",
  authDomain: "rezerveauth.firebaseapp.com",
  projectId: "rezerveauth",
  storageBucket: "rezerveauth.appspot.com",
  messagingSenderId: "132344669990",
  appId: "1:132344669990:web:33de61ab2e546cdc3903e7"
};

let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}
const auth = firebase.auth();

// Initialize Firebase
export default auth