// doublelogin.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';
import { firebaseConfig } from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Elementos da interface
const loginBtn = document.getElementById('loginBothPlayers');
const emailPlayer1Input = document.getElementById('emailPlayer1');
const senhaPlayer1Input = document.getElementById('senhaPlayer1');
const emailPlayer2Input = document.getElementById('emailPlayer2');
const senhaPlayer2Input = document.getElementById('senhaPlayer2');
const loadingDiv = document.getElementById('loading');
const btnAlert = document.getElementById('btnAlert');

// Alertas dinâmicos
function displayAlert(element, message, type = "error") {
  element.textContent = message;
  element.style.display = "block";
  element.style.color = type === "success" ? "green" : "red";
}

function clearAlerts() {
  btnAlert.textContent = '';
  btnAlert.style.display = 'none';
  emailPlayer1Input.classList.remove('input-mismatch');
  senhaPlayer1Input.classList.remove('input-mismatch');
  emailPlayer2Input.classList.remove('input-mismatch');
  senhaPlayer2Input.classList.remove('input-mismatch');
}

// Login para um único jogador
async function loginPlayer(email, senha, emailInput, senhaInput) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    console.log(`Usuário logado:`, userCredential.user);
    return userCredential.user.uid; // Retorna o UID do jogador
  } catch (error) {
    const errorMessage = error.code;
    console.error(`Erro no login do jogador:`, errorMessage);

    if (errorMessage === 'auth/invalid-email') {
      displayAlert(btnAlert, 'Email inválido.');
      emailInput.classList.add('input-mismatch');
    } else if (errorMessage === 'auth/wrong-password') {
      displayAlert(btnAlert, 'Senha incorreta.');
      senhaInput.classList.add('input-mismatch');
    } else if (errorMessage === 'auth/user-not-found') {
      displayAlert(btnAlert, 'Usuário não encontrado.');
      emailInput.classList.add('input-mismatch');
    } else {
      displayAlert(btnAlert, 'Erro no login. Tente novamente mais tarde.');
    }
    return null;
  }
}

// Evento de clique no botão de login
loginBtn.addEventListener('click', async () => {
  clearAlerts();

  const emailPlayer1 = emailPlayer1Input.value.trim();
  const senhaPlayer1 = senhaPlayer1Input.value.trim();
  const emailPlayer2 = emailPlayer2Input.value.trim();
  const senhaPlayer2 = senhaPlayer2Input.value.trim();

  loadingDiv.innerHTML = '<div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div>';

  if (!emailPlayer1 || !senhaPlayer1 || !emailPlayer2 || !senhaPlayer2) {
    displayAlert(btnAlert, 'Todos os campos devem ser preenchidos.');
    if (!emailPlayer1) emailPlayer1Input.classList.add('input-mismatch');
    if (!senhaPlayer1) senhaPlayer1Input.classList.add('input-mismatch');
    if (!emailPlayer2) emailPlayer2Input.classList.add('input-mismatch');
    if (!senhaPlayer2) emailPlayer2Input.classList.add('input-mismatch');
    loadingDiv.innerHTML = '';
    return;
  }

  // Tentar login dos dois jogadores
  const player1Uid = await loginPlayer(emailPlayer1, senhaPlayer1, emailPlayer1Input, senhaPlayer1Input);
  const player2Uid = await loginPlayer(emailPlayer2, senhaPlayer2, emailPlayer2Input, senhaPlayer2Input);

  if (player1Uid && player2Uid) {
    displayAlert(btnAlert, 'Ambos os jogadores fizeram login com sucesso!', 'success');

    // Salva os UIDs no localStorage e redireciona para o jogo
    localStorage.setItem('player1Uid', player1Uid);
    localStorage.setItem('player2Uid', player2Uid);

    setTimeout(() => {
      window.location.href = 'home.html';
    }, 2000); // Redireciona após 2 segundos
  } else {
    displayAlert(btnAlert, 'Falha no login de um ou ambos os jogadores.');
  }

  loadingDiv.innerHTML = '';
});
