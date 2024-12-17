import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';
import { getStorage, ref, uploadBytes } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js';
import { firebaseConfig } from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const loadingDiv = document.getElementById('loading');
const loginBtn = document.getElementById('login');

const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');

const emailMessage = document.getElementById('emailAlert');
const senhaMessage = document.getElementById('senhaAlert');
const btnMessage = document.getElementById('btnAlert');

document.addEventListener('DOMContentLoaded', () => {

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {

      const email = emailInput.value.trim();
      const senha = senhaInput.value.trim();

      function clearAlerts() {
        emailMessage.textContent = '';
        emailMessage.style.display = 'none';
        senhaMessage.textContent = '';
        senhaMessage.style.display = 'none';
        btnMessage.textContent = '';
        btnMessage.style.display = 'none';
        emailInput.classList.remove('input-mismatch');
        senhaInput.classList.remove('input-mismatch');
      };

      function displayAlertEmail(message) {
        emailMessage.textContent = message;
        emailMessage.style.display = 'block';
      };

      function displayAlertSenha(message) {
        senhaMessage.textContent = message;
        senhaMessage.style.display = 'block';
      };

      function displayAlertBtn(message) {
        btnMessage.textContent = message;
        btnMessage.style.display = 'block';
      };

      function highlightEmptyFields() {
        if (!email) {
          emailInput.classList.add('input-mismatch')
          displayAlertEmail('Adicione um email.')
        };
        if (!senha) {
          senhaInput.classList.add('input-mismatch')
          displayAlertSenha('Adicione uma senha.')
        };
      };

      clearAlerts();

      loadingDiv.innerHTML = '<div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div>';

      if (!email || !senha) {
        highlightEmptyFields();
        displayAlertBtn('Todos os campos devem ser preenchidos.');
        return;
      };

      signInWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Usuário logado:', user);
          window.location.href = 'user.html';
        })

        .catch((error) => {
          const errorMessage = error.message;

          if (error.code === 'auth/invalid-email' || error.code === 'auth/weak-password') {
            displayAlertBtn('Os campos de email e senha devem ser preenchidos.');
          } else if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-login-credentials') {
            displayAlertBtn('Verifique se o email ou senha estão corretos.');
            senhaInput.classList.add('input-mismatch')
            emailInput.classList.add('input-mismatch')
          } else if (error.code === 'auth/wrong-password') {
            displayAlertSenha('Verifique se a senha está correta.');
          } else {
            console.error('Erro durante o login:', errorMessage);
          }

          loadingDiv.innerHTML = '';

        });
    });
  }
});