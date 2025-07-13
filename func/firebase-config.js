// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyWhVswdT3G-T9jPLdEeeXxKLI7wbK17k",
  authDomain: "fir-b3-7b8f7.firebaseapp.com",
  projectId: "fir-b3-7b8f7",
  storageBucket: "fir-b3-7b8f7.firebasestorage.app",
  messagingSenderId: "339295396618",
  appId: "1:339295396618:web:013f11d4da4195d58ad0f3",
  measurementId: "G-LC8R324LPM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// Initialize Cloud Storage and get a reference to the service
const storage = firebase.storage();
