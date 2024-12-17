//import { initializePlayerData, updatePlayerProgress, incrementPlayerVictories } from '../Login-Register/realtimeDatabase.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';
import { getDatabase, ref, set, update, increment} from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js'; 
//import {  ref, ,  } from "firebase/database";

import { firebaseConfig } from './firebaseConfig.js';
     
/* Inicializa os dados do jogador
export function initializePlayerData(playerId) {
  const db = getDatabase();
  const playerRef = ref(db, `users/${playerId}`);
  set(playerRef, {
    score: 0,
    position: 0,
    victories: 0,
  });
}*/

// Atualiza o progresso do jogador
export function updatePlayerProgress(playerId, scoreIncrement, newPosition) {
  const db = getDatabase();
  const playerRef = ref(db, `users/${playerId}`);
  update(playerRef, {
    score: increment(scoreIncrement),
    position: newPosition,
  });
}

// Incrementa as vitórias do jogador
export function incrementPlayerVictories(playerId) {
  const db = getDatabase();
  const victoriesRef = ref(db, `users/${playerId}/victories`);
  set(victoriesRef, increment(1));
}

// Obtém os dados do jogador (caso necessário)
export async function getPlayerData(playerId) {
  const db = getDatabase();
  const playerRef = ref(db, `users/${playerId}`);
  const snapshot = await get(playerRef);
  return snapshot.exists() ? snapshot.val() : null;
}
