import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';
import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js';
import { firebaseConfig } from '../Login-Register/firebaseConfig.js';
import { getDatabase, ref as dbRef, get as getDB } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', function () {
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsMenu = document.getElementById('settingsMenu');
  const settingsIcon = document.getElementById('settingsIcon');
  const settingsLogo = document.getElementById('settingsLogo');
  const username = document.getElementById('username')
  const settingsProfileImg = document.getElementById('settingsProfileImg');
  const profileImg = document.getElementById('profileImg');
  const vic = document.getElementById('victories');
  const scor = document.getElementById('score');

  // Use onAuthStateChanged to detect user authentication status
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Usuário autenticado
        const userr = await getDB(dbRef(database, `users/${user.uid}/uid`))
        const userScor = await getDB(dbRef(database, `users/${user.uid}/score`))
        const userVictorie = await getDB(dbRef(database, `users/${user.uid}/victories`))
        const photoURLSnapshot = await getDB(dbRef(database, `users/${user.uid}/photoURL`));
        const use = userr.val();
        const photoURL = photoURLSnapshot.val();
        const userScore = userScor.val();
        const userVictories = userVictorie.val();

        if (userScore) {
          scor.textContent = userScore
        } else {
          console.error('cagada');
        }

        if (use) {
          username.textContent = use
        } else {
          console.error('cagada');
        }

        if (userVictories) {
          vic.textContent = userVictories
        } else {
          console.error('cagada');
        }
        
        if (photoURL) { // Verifica se photoURL está definida e não é nula
          settingsProfileImg.src = photoURL;
          profileImg.src = photoURL;
        } else {
          console.error('URL da foto não encontrada.');
        }
      } catch (error) {
        console.error('Erro ao recuperar foto de perfil:', error.message);
      }

    } else {
      console.error('Usuário não autenticado.');
      // Se necessário, redirecione o usuário para a página de login
       window.location.href = '../login.js'; // Exemplo de redirecionamento para login
    }

  });
});
