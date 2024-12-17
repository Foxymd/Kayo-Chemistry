import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDeDOqbNHBHXHB3ppAtk9iEIvWIJxf15eE",
  authDomain: "kayo-3922c.firebaseapp.com",
  databaseURL: "https://kayo-3922c-default-rtdb.firebaseio.com",
  projectId: "kayo-3922c",
  storageBucket: "kayo-3922c.firebasestorage.app",
  messagingSenderId: "518581431445",
  appId: "1:518581431445:web:76132f5ed32b25a38abf9c"
};

// Inicializa o app do Firebase
export const app = initializeApp(firebaseConfig);

// Exporta app e Firestore
export const db = getFirestore(app);
