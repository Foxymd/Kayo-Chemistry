import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';
import { getDatabase, ref as dbRef, set } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js'; 
import { firebaseConfig } from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app); 

const photoInput = document.getElementById('photo');
const profilePreview = document.getElementById('profilePreview');
const loadingDiv = document.getElementById('loading');
const registrarBtn = document.getElementById('registrar');

const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const senhaConfirmacaoInput = document.getElementById('senhaConfirmacao');
const photoInputDiv = document.getElementById('profilePreview');

const emailMessage = document.getElementById('emailAlert');
const senhaMessage = document.getElementById('senhaAlert');
const btnMessage = document.getElementById('btnAlert');
const photoMessage = document.getElementById('photoAlert');

document.addEventListener('DOMContentLoaded', () => {
  if (photoInput && profilePreview) {
    photoInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        profilePreview.innerHTML = `<img src="${e.target.result}" alt="Preview da Foto de Perfil">`;
      };

      reader.readAsDataURL(file);
    });
  }

  if (registrarBtn) {
    registrarBtn.addEventListener('click', async () => {
      const email = emailInput.value;
      const senha = senhaInput.value;
      const senhaConfirmacao = senhaConfirmacaoInput.value;
      const photoFile = photoInput.files[0];

      function clearAlerts() {
        emailMessage.textContent = '';
        emailMessage.style.display = 'none';
        senhaMessage.textContent = '';
        senhaMessage.style.display = 'none';
        btnMessage.textContent = '';
        btnMessage.style.display = 'none';
        photoMessage.textContent = '';
        photoMessage.style.display = 'none';
        emailInput.classList.remove('input-mismatch');
        senhaInput.classList.remove('input-mismatch');
        senhaConfirmacaoInput.classList.remove('input-mismatch');
        photoInputDiv.classList.remove('input-mismatch');
      }

      function displayAlertPhoto(message) {
        photoMessage.textContent = message;
        photoMessage.style.display = 'block';
      }

      function displayAlertEmail(message) {
        emailMessage.textContent = message;
        emailMessage.style.display = 'block';
      }

      function displayAlertSenha(message) {
        senhaMessage.textContent = message;
        senhaMessage.style.display = 'block';
      }

      function displayAlertBtn(message) {
        btnMessage.textContent = message;
        btnMessage.style.display = 'block';
      }

      function highlightEmptyFields() {
        if (!email) {
          emailInput.classList.add('input-mismatch');
          displayAlertEmail('Adicione um email.');  
        }
        if (!senha) {
          senhaInput.classList.add('input-mismatch');
          displayAlertSenha('Adicione uma senha.');
        }
        if (!senhaConfirmacao) {
          senhaConfirmacaoInput.classList.add('input-mismatch');
        }
        if (!photoFile) {
          photoInputDiv.classList.add('input-mismatch');
          displayAlertPhoto('Adicione uma imagem.');
        }
      }

      clearAlerts();

      loadingDiv.innerHTML = '<div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div>';

      if (!email || !senha || !senhaConfirmacao || !photoFile) {
        highlightEmptyFields();
        displayAlertBtn('Todos os campos devem ser preenchidos.');
        loadingDiv.innerHTML = '';
        return;
      }

      if (senha !== senhaConfirmacao) {
        displayAlertSenha('As senhas digitadas não correspondem.');
        senhaInput.classList.add('input-mismatch');
        senhaConfirmacaoInput.classList.add('input-mismatch');
        loadingDiv.innerHTML = '';
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        // Converte a foto para base64
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64Photo = event.target.result; // A imagem em base64
          
          // Salva os dados do usuário no Realtime Database
          await set(dbRef(database, `users/${user.uid}`), {
            email: email,
            photoURL: base64Photo,
            score: 0,
            position: 0,
            victories: 0,
            uid: user.uid, // UID do usuário para referência futura
          });

          console.log('Usuário registrado com sucesso: ' + email);
          window.location.href = 'login.html';
        };

        reader.readAsDataURL(photoFile); // Lê a imagem como base64

      } catch (error) {
        const errorMessage = error.message;

        if (error.code === 'auth/invalid-email') {
          displayAlertEmail('Email inválido.');
          emailInput.classList.add('input-mismatch');
        } else if (error.code === 'auth/weak-password') {
          displayAlertSenha('Senha muito fraca. Mínimo de 6 caracteres.');
          senhaInput.classList.add('input-mismatch');
        } else if (error.code === 'auth/email-already-in-use') {
          displayAlertEmail('Este email já está em uso.');
          emailInput.classList.add('input-mismatch');
        } else {
          displayAlertBtn('Erro inesperado. Tente novamente.');
        }

        console.error('Erro durante o registro:', errorMessage);
        loadingDiv.innerHTML = '';
      }
    });
  }
});
