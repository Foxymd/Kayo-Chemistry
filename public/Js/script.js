// script.js
import { updatePlayerProgress, incrementPlayerVictories } from '../Login-Register/realtime.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js';
import { questions1 } from '../questions1.js';
import { questions2 } from '../questions2.js';
import { questions3 } from '../questions3.js';

// Estado inicial do jogo
let currentPlayer = 1;

let scorePlayer1 = 0;
let scorePlayer2 = 0;
let currentCellPlayer1 = 0;
let currentCellPlayer2 = 0;

const totalCells = 30; // Número de casas no tabuleiro
const spiralBoard = document.getElementById("spiralBoard");
const scorePlayer1Element = document.getElementById("scorePlayer1");
const scorePlayer2Element = document.getElementById("scorePlayer2");
const currentTurnElement = document.getElementById("currentTurn");
const questionElement = document.getElementById("question");
const answerElement = document.getElementById("answer");

const auth = getAuth();
let player1Id = null;
let player2Id = null;

// Recupera os UIDs dos jogadores do localStorage
function loadPlayerData() {
  player1Id = localStorage.getItem('player1Uid');
  player2Id = localStorage.getItem('player2Uid');

  if (!player1Id || !player2Id) {
    alert("Jogadores não autenticados. Por favor, faça login novamente.");
    window.location.href = 'doubleLogin.html';
    return;
  }
}

// Função para atualizar o tabuleiro
function generateSpiralBoard() {
  spiralBoard.innerHTML = '';
  const centerX = 50;
  const centerY = 50;
  const radiusIncrement = 6;

  for (let i = 0; i < totalCells; i++) {
    const angle = i * (Math.PI / 4);
    const radius = radiusIncrement * Math.sqrt(i);

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const cell = document.createElement("div");
    cell.classList.add("spiral-cell");
    cell.textContent = i + 1;
    cell.style.left = `${x}%`;
    cell.style.top = `${y}%`;
    cell.style.backgroundColor = `hsl(${(i / totalCells) * 360}, 70%, 80%)`;
    spiralBoard.appendChild(cell);
  }
}

// Função para mover o jogador no tabuleiro
function movePlayer() {
  const currentPlayerPosition = currentPlayer === 1 ? currentCellPlayer1 : currentCellPlayer2;

  // Verifica se a posição é válida
  if (currentPlayerPosition === 0) return;

  let playerElement = document.getElementById(`player${currentPlayer}`);
  if (!playerElement) {
      playerElement = document.createElement("div");
      playerElement.id = `player${currentPlayer}`;
      playerElement.classList.add("player");
      playerElement.textContent = currentPlayer === 1 ? "👨‍🔬" : "👩‍🔬";
      spiralBoard.appendChild(playerElement);
  }

  const position = spiralBoard.children[currentPlayerPosition - 1];
  if (position) {
      playerElement.style.left = position.style.left;
      playerElement.style.top = position.style.top;
  }
}
// Função para atualizar as pontuações
function updateScore() {
  scorePlayer1Element.textContent = `Jogador 1: ${scorePlayer1}`;
  scorePlayer2Element.textContent = `Jogador 2: ${scorePlayer2}`;
}

// Função para gerar a pergunta
function generateQuestion() {
  const currentPlayerPosition = currentPlayer === 1 ? currentCellPlayer1 : currentCellPlayer2;

  let questionSet = currentPlayerPosition < 10 ? questions1 
                 : currentPlayerPosition < 20 ? questions2 
                 : questions3;

  const randomQuestion = questionSet[Math.floor(Math.random() * questionSet.length)];
  questionElement.textContent = randomQuestion.question;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = ''; // Limpa as opções anteriores

  if (currentPlayerPosition < 10) {
    // Gera opções de múltipla escolha
    ["A", "B", "C", "D"].forEach((option) => {
      const optionDiv = document.createElement("div");
      optionDiv.classList.add("option");

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.id = `option-${option}`;
      input.value = option;

      const label = document.createElement("label");
      label.htmlFor = `option-${option}`;
      label.textContent = `${option}) ${randomQuestion[option]}`;

      optionDiv.appendChild(input);
      optionDiv.appendChild(label);
      optionsContainer.appendChild(optionDiv);
    });
    questionElement.dataset.correctAnswer = randomQuestion.answer;
    answerElement.style.display = "none"; // Esconde o campo de texto
  } else {
    // Pergunta aberta
    questionElement.dataset.correctAnswer = randomQuestion.answer;
    answerElement.value = '';
    answerElement.style.display = "block"; // Mostra o campo de texto
  }
}



// Seleciona elementos do DOM
const victoryMenu = document.getElementById("victoryMenu");
const winnerMessage = document.getElementById("winnerMessage");
const restartGameButton = document.getElementById("restartGameButton");

// Função para mostrar o menu de vitória
function showVictoryMenu(winner) {
    winnerMessage.textContent = `${winner} venceu! 🎉`;
    victoryMenu.style.display = "flex"; // Mostra o menu
}

// Adiciona um evento de clique ao botão para reiniciar o jogo
restartGameButton.addEventListener("click", resetGame);

// Função de reinício do jogo
function resetGame() {
  victoryMenu.style.display = "none"; // Oculta o menu de vitória

  // Reinicia os estados dos jogadores
  scorePlayer1 = 0;
  scorePlayer2 = 0;
  currentCellPlayer1 = 0;
  currentCellPlayer2 = 0;
  currentPlayer = 1;

  // Atualiza pontuações e limpa perguntas
  updateScore();
  generateQuestion();

  // Remove os jogadores do tabuleiro
  const player1 = document.getElementById("player1");
  const player2 = document.getElementById("player2");
  if (player1) player1.remove();
  if (player2) player2.remove();
  
  // Move os jogadores para a posição inicial
  movePlayer();
}


function nextTurn() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  currentTurnElement.textContent = `Turno: Jogador ${currentPlayer}`;
  generateQuestion();
}

function checkWinner() {
  if (currentCellPlayer1 >= totalCells) {
      showVictoryMenu("Jogador 1");
      incrementPlayerVictories(player1Id); // Atualiza vitórias no Realtime Database
  } else if (currentCellPlayer2 >= totalCells) {
      showVictoryMenu("Jogador 2");
      incrementPlayerVictories(player2Id); // Atualiza vitórias no Realtime Database
  }
}


// Função para verificar a resposta
export function checkAnswer() {
  const currentPlayerPosition = currentPlayer === 1 ? currentCellPlayer1 : currentCellPlayer2;
  let isCorrect = false;

  if (currentPlayerPosition < 10) {
    // Verifica múltipla escolha
    const selectedOption = document.querySelector("input[name='answer']:checked");
    if (!selectedOption) {
      alert("Por favor, selecione uma resposta.");
      return;
    }
    isCorrect = selectedOption.value === questionElement.dataset.correctAnswer;
  } else {
    // Verifica resposta aberta
    const playerAnswer = answerElement.value.trim().toLowerCase();
    const correctAnswer = questionElement.dataset.correctAnswer.trim().toLowerCase();
    isCorrect = playerAnswer === correctAnswer;
  }

  if (isCorrect) {
    const pointsToAdd = currentPlayerPosition >= 20 ? 2 : 1;
    if (currentPlayer === 1) {
      scorePlayer1 += pointsToAdd;
      currentCellPlayer1 += pointsToAdd;
      updatePlayerProgress(player1Id, pointsToAdd, currentCellPlayer1);
    } else {
      scorePlayer2 += pointsToAdd;
      currentCellPlayer2 += pointsToAdd;
      updatePlayerProgress(player2Id, pointsToAdd, currentCellPlayer2);
    }
  } else {
    alert("Resposta incorreta!");
    const pointsToSubtract = currentPlayerPosition >= 20 ? 2 : 1;
    if (currentPlayer === 1 && currentCellPlayer1 >= 10) {
      scorePlayer1 = Math.max(0, scorePlayer1 - pointsToSubtract); // Garante que a pontuação não fique negativa
      currentCellPlayer1 = Math.max(0, currentCellPlayer1 - pointsToSubtract);
      updatePlayerProgress(player1Id, -pointsToSubtract, currentCellPlayer1);
    } else if (currentPlayer === 2 && currentCellPlayer2 >= 10) {
      scorePlayer2 = Math.max(0, scorePlayer2 - pointsToSubtract); // Garante que a pontuação não fique negativa
      currentCellPlayer2 = Math.max(0, currentCellPlayer2 - pointsToSubtract);
      updatePlayerProgress(player2Id, -pointsToSubtract, currentCellPlayer2);
    }
  }

  movePlayer();
  updateScore();
  checkWinner();
  nextTurn();
}

// Função para pular turno
export function skipTurn() {
  alert("Turno pulado!");
  nextTurn();
}

// Inicializa o jogo
loadPlayerData();
generateSpiralBoard();
generateQuestion();
