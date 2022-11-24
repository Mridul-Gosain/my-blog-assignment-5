const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} = require("firebase/storage");

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAonCfF74YHBfQhkYQrKFGFMNZTJxOGPU0",
  authDomain: "my-blog-729-98800.firebaseapp.com",
  projectId: "my-blog-729-98800",
  storageBucket: "my-blog-729-98800.appspot.com",
  messagingSenderId: "232981888052",
  appId: "1:232981888052:web:97493b47855378e8855e61",
  storageBucket: "gs://my-blog-729-98800.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage();

// Create a storage reference from our storage service
const storageRef = ref(storage);

// Create a child reference
const imagesRef = ref(storage, "images");
// imagesRef now points to 'images'

module.exports = {
  initializeApp,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  storageRef,
  imagesRef
}