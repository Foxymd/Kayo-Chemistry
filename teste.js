import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';
import { getStorage, ref, uploadBytes } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js';

import { firebaseConfig } from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const photoInput = document.getElementById('photo');
const profilePreview = document.getElementById('profilePreview');
const loadingDiv = document.getElementById('loading');
const registrarBtn = document.getElementById('registrar');

const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const senhaConfirmacaoInput = document.getElementById('senhaConfirmacao');

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

      // Limpa todos os alertas e estilos de campo antes de fazer a verificação
      clearAlerts();

      // Verifica se todos os campos estão preenchidos
      if (!email || !senha || !senhaConfirmacao || !photoFile) {
        // Exibe alerta e aplica estilo de destaque aos campos vazios
        displayAlert('Todos os campos devem ser preenchidos.');
        highlightEmptyFields();
        return;
      }

      // Verifica se as senhas coincidem
      if (senha !== senhaConfirmacao) {
        // Exibe alerta e destaca campos de senha
        displayAlert('As senhas digitadas não correspondem.');
        senhaInput.classList.add('input-mismatch');
        senhaConfirmacaoInput.classList.add('input-mismatch');
        return;
      }

      try {
        // Cria o usuário com email e senha
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        // Faz upload da foto de perfil para o armazenamento
        const storageRef = ref(storage, `profile_photos/${user.uid}/${photoFile.name}`);
        await uploadBytes(storageRef, photoFile);

        // Redireciona para a página inicial após o registro bem-sucedido
        console.log('Usuário registrado com sucesso: ' + email);
        window.location.href = 'home.html';
      } catch (error) {
        // Trata os erros durante o registro
        const errorMessage = error.message;

        if (errorMessage === 'Nenhum arquivo selecionado.') {
          // Exibe alerta se nenhum arquivo de foto foi selecionado
          photoMessage.textContent = 'Selecione uma imagem.';
          photoMessage.style.display = 'block';
        } else if (error.code === 'auth/invalid-email' || error.code === 'auth/weak-password') {
          // Exibe alerta se o email ou senha forem inválidos
          displayAlert('Os campos de email e senha devem ser preenchidos.');
        } else if (error.code === 'auth/email-already-in-use') {
          // Exibe alerta se o email já estiver em uso
          emailInput.classList.add('input-mismatch');
          emailMessage.textContent = 'Já existe um usuário com este email.';
          emailMessage.style.display = 'block';
        } else {
          // Exibe alerta para outros erros
          console.error('Erro durante o registro:', errorMessage);
        }
      } finally {
        // Limpa o conteúdo do div de carregamento
        loadingDiv.innerHTML = '';
      }
    });
  }
});

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
}

function displayAlert(message) {
  btnMessage.textContent = message;
  btnMessage.style.display = 'block';
}

function highlightEmptyFields() {
  if (!email) emailInput.classList.add('input-mismatch');
  if (!senha) senhaInput.classList.add('input-mismatch');
  if (!senhaConfirmacao) senhaConfirmacaoInput.classList.add('input-mismatch');
  if (!photoFile) photoMessage.textContent = 'Selecione uma imagem.';
}
