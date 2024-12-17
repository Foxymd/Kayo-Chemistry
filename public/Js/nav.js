import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';
import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js'; // Importe ref e getDownloadURL aqui
import { firebaseConfig } from '../Login-Register/firebaseConfig.js';

import { getDatabase, ref as dbRef, get as getDB } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Obtenha uma referência ao banco de dados
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', function () {
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsMenu = document.getElementById('settingsMenu');
  const settingsIcon = document.getElementById('settingsIcon');
  const settingsLogo = document.getElementById('settingsLogo');

  settingsIcon.addEventListener('mouseenter', function () {
    settingsIcon.style.transform = 'rotate(90deg)';
  });

  settingsIcon.addEventListener('mouseleave', function () {
    settingsIcon.style.transform = 'rotate(0deg)';
  });

  settingsIcon.addEventListener('click', async function () {
    try {

      const user = auth.currentUser;
    
    if (user) { // Verifica se o usuário está autenticado
      const photoURLSnapshot = await getDB(dbRef(database, `users/${user.uid}/photoURL`));
      const photoURL = photoURLSnapshot.val();
      
      if (photoURL) { // Verifica se photoURL está definida e não é nula
        settingsProfileImg.src = photoURL;
        ProfileImg.src = photoURL;
      } else {
        console.error('URL da foto não encontrada.');
        // Lide com a situação em que a URL da foto não está disponível
      }
    } else {
      console.error('Usuário não autenticado.');
      // Você pode redirecionar o usuário para a página de login, por exemplo
    }
      

      if (settingsMenu.style.display === 'block') {
        // Esconde o menu
        settingsMenu.style.opacity = 0;
        settingsMenu.style.transform = 'translateX(100%)';
        setTimeout(() => {
          settingsMenu.style.display = 'none';
        }, 5); // Tempo de espera para completar a animação
      } else {
        // Exibe o menu
        settingsMenu.style.display = 'block';
        setTimeout(() => {
          settingsMenu.style.opacity = 1;
          settingsMenu.style.transform = 'translateX(0)';
        }, 5); // Tempo de espera para começar a animação
      }
    } catch (error) {

      const errorMessage = error.message;

      console.error('Ocorreu um erro:', errorMessage);
    }
      });
  });

