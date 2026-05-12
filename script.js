/* =======================
   QUIZ GAME DATA
======================= */

const categories = ["Sport", "Anime", "Geographie", "Film", "Gaming"];
const points = [100, 200, 300, 400, 500];

const questions = {
  Sport: [
    { q: "Wie viele Spieler hat ein Fußballteam?", a: "11", points: 100 },
    { q: "Wie viele Spieler hat ein Fußballteam?", a: "11", points: 200 },
    { q: "Wie viele Spieler hat ein Fußballteam?", a: "11", points: 300 },
    { q: "Wie viele Spieler hat ein Fußballteam?", a: "11", points: 400 },
    { q: "Wie viele Spieler hat ein Fußballteam?", a: "11", points: 500 }
  ],
  Anime: [
    { q: "Wer ist Naruto?", a: "Ninja", points: 100 },
    { q: "Serie mit Goku?", a: "Dragon Ball", points: 200 },
    { q: "Serie mit Goku?", a: "Dragon Ball", points: 300 },
    { q: "Serie mit Goku?", a: "Dragon Ball", points: 400 },
    { q: "Serie mit Goku?", a: "Dragon Ball", points: 500 }
  ],
  Geographie: [
    { q: "Hauptstadt von Deutschland?", a: "Berlin", points: 100 },
    { q: "Hauptstadt von Deutschland?", a: "Berlin", points: 200 },
    { q: "Hauptstadt von Deutschland?", a: "Berlin", points: 300 },
    { q: "Hauptstadt von Deutschland?", a: "Berlin", points: 400 },
    { q: "Hauptstadt von Deutschland?", a: "Berlin", points: 500 }
  ],
  Film: [
    { q: "Wer ist Batman?", a: "Bruce Wayne", points: 100 },
    { q: "Wer ist Batman?", a: "Bruce Wayne", points: 200 },
    { q: "Wer ist Batman?", a: "Bruce Wayne", points: 300 },
    { q: "Wer ist Batman?", a: "Bruce Wayne", points: 400 },
    { q: "Wer ist Batman?", a: "Bruce Wayne", points: 500 }
  ],
  Gaming: [
    { q: "Was ist Minecraft?", a: "Spiel", points: 100 },
    { q: "Was ist Minecraft?", a: "Spiel", points: 200 },
    { q: "Was ist Minecraft?", a: "Spiel", points: 300 },
    { q: "Was ist Minecraft?", a: "Spiel", points: 400 },
    { q: "Was ist Minecraft?", a: "Spiel", points: 500 }
  ]
};

let currentQuestion = null;
let currentCell = null;

/* =======================
   SCREEN SYSTEM
======================= */

function showScreen(id) {
  const screens = [
    "startScreen",
    "gameSelectScreen",
    "gameScreen",
    "questionScreen",
    "joinScreen"
  ];

  screens.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.add("hidden");
  });

  document.getElementById(id).classList.remove("hidden");
}

/* =======================
   START FLOW
======================= */

window.onload = () => {
  buildBoard();

  document.getElementById("startBtn").addEventListener("click", () => {
    showScreen("gameSelectScreen");
  });

  document.getElementById("answer").addEventListener("keydown", e => {
    if (e.key === "Enter") checkAnswer();
  });

  const lobbyId = new URLSearchParams(window.location.search).get("lobby");

  if (lobbyId) {
    showScreen("joinScreen");
  } else {
    showScreen("startScreen");
  }
};

function startQuizGame() {
  showScreen("gameScreen");
}

/* =======================
   BOARD
======================= */

function buildBoard() {
  const board = document.getElementById("board");

  categories.forEach(cat => {
    const col = document.createElement("div");

    const title = document.createElement("h3");
    title.innerText = cat;
    col.appendChild(title);

    points.forEach(p => {
      const q = questions[cat]?.find(x => x.points === p);

      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (q) {
        cell.innerText = p;

        cell.onclick = () => {
          openQuestion(q, cell);
        };
      } else {
        cell.innerText = "-";
        cell.style.opacity = "0.3";
        cell.style.pointerEvents = "none";
      }

      col.appendChild(cell);
    });

    board.appendChild(col);
  });
}

/* =======================
   GAME LOGIC
======================= */

function openQuestion(q, cell) {
  currentQuestion = q;
  currentCell = cell;

  document.getElementById("question").innerText = q.q;
  document.getElementById("answer").value = "";

  showScreen("questionScreen");
}

function checkAnswer() {
  const ans = document.getElementById("answer").value;

  if (ans.toLowerCase() === currentQuestion.a.toLowerCase()) {
    alert("Richtig!");
  } else {
    alert("Falsch! Antwort: " + currentQuestion.a);
  }

  currentCell.classList.add("used");

  showScreen("gameScreen");
}

/* =======================
   FIREBASE
======================= */

const firebaseConfig = {
  apiKey: "AIzaSyAka-trKtZtJTndiC1Xns4M-0UBYoxg3ns",
  authDomain: "anime-quiz-op-talk.firebaseapp.com",
  projectId: "anime-quiz-op-talk",
  databaseURL: "https://anime-quiz-op-talk-default-rtdb.europe-west1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* =======================
   LOBBY SYSTEM
======================= */

function createLobby() {
  const lobbyId = Math.random().toString(36).substring(2, 8).toUpperCase();

  db.ref("lobbies/" + lobbyId).set({
    createdAt: Date.now(),
    players: {},
    game: "quiz"
  });

  return lobbyId;
}

function testLobby() {
  const id = createLobby();
  alert("Lobby erstellt: " + id);
}

function joinLobby(lobbyId, name) {
  db.ref("lobbies/" + lobbyId + "/players/" + name).set({
    name,
    score: 0
  });
}

function joinLobbyFromUrl() {
  const lobbyId = new URLSearchParams(window.location.search).get("lobby");
  const name = document.getElementById("playerName").value;

  if (!lobbyId || !name) {
    alert("Fehler: Lobby oder Name fehlt");
    return;
  }

  joinLobby(lobbyId, name);

  alert("Beigetreten!");

  showScreen("gameScreen");
}