const categories = [
  "Sport",
  "Anime",
  "Geographie",
  "Film",
  "Gaming"
];

const points = [100, 200, 300, 400, 500];

const questions = {
  Sport: [
    { q: "Wie viele Spieler hat ein Fußballteam?", a: "11", points: 100 },
    { q: "Welcher Sport nutzt einen Ring?", a: "Basketball", points: 200 },
    { q: "Test 300", a: "x", points: 300 },
    { q: "Test 400", a: "x", points: 400 },
    { q: "Test 500", a: "x", points: 500 }
  ],
  Anime: [
    { q: "Wer ist Naruto?", a: "Ninja", points: 100 },
    { q: "Serie mit Goku?", a: "Dragon Ball", points: 200 },
    { q: "Test 300", a: "x", points: 300 },
    { q: "Test 400", a: "x", points: 400 },
    { q: "Test 500", a: "x", points: 500 }
  ],
  Geographie: [
    { q: "Hauptstadt von Deutschland?", a: "Berlin", points: 100 },
    { q: "Test 200", a: "x", points: 200 },
    { q: "Test 300", a: "x", points: 300 },
    { q: "Test 400", a: "x", points: 400 },
    { q: "Test 500", a: "x", points: 500 }
  ],
  Film: [
    { q: "Wer ist Batman?", a: "Bruce Wayne", points: 100 },
    { q: "Test 200", a: "x", points: 200 },
    { q: "Test 300", a: "x", points: 300 },
    { q: "Test 400", a: "x", points: 400 },
    { q: "Test 500", a: "x", points: 500 }
  ],
  Gaming: [
    { q: "Was ist Minecraft?", a: "Spiel", points: 100 },
    { q: "Test 200", a: "x", points: 200 },
    { q: "Test 300", a: "x", points: 300 },
    { q: "Test 400", a: "x", points: 400 },
    { q: "Test 500", a: "x", points: 500 }
  ]
};

let currentQuestion = null;
let currentCell = null;

// 🔥 BOARD BAUEN
function buildBoard() {
  const board = document.getElementById("board");

  categories.forEach(cat => {
    const col = document.createElement("div");

    const title = document.createElement("h3");
    title.innerText = cat;
    col.appendChild(title);

    points.forEach(p => {
      const q = questions[cat].find(x => x.points === p);

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

// 🔥 FRAGE ÖFFNEN
function openQuestion(q, cell) {
  currentQuestion = q;
  currentCell = cell;

  document.getElementById("question").innerText = q.q;
  document.getElementById("answer").value = "";

  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("questionScreen").classList.remove("hidden");
}

// 🔥 ANTWORT PRÜFEN
function checkAnswer() {
  const ans = document.getElementById("answer").value;

  if (ans.toLowerCase() === currentQuestion.a.toLowerCase()) {
    alert("Richtig!");
  } else {
    alert("Falsch! Antwort: " + currentQuestion.a);
  }

  currentCell.classList.add("used");

  document.getElementById("questionScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
}

// 🔥 START
window.onload = () => {
  buildBoard();

  document.getElementById("startBtn").addEventListener("click", showGameSelection);

  document.getElementById("answer").addEventListener("keydown", e => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  });
};

function showGameSelection() {
  document.getElementById("startScreen").classList.add("hidden");

  document.getElementById("gameSelectScreen").classList.remove("hidden");
}

function startQuizGame() {
  document.getElementById("gameSelectScreen").classList.add("hidden");

  document.getElementById("gameScreen").classList.remove("hidden");
}


/*Firebase Zeug für Multiplayer*/
const firebaseConfig = {
  apiKey: "AIzaSyAka-trKtZtJTndiC1Xns4M-0UBYoxg3ns",
  authDomain: "anime-quiz-op-talk.firebaseapp.com",
  projectId: "anime-quiz-op-talk",
  databaseURL: "https://anime-quiz-op-talk-default-rtdb.europe-west1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();


/*Lobby erstellen*/
function createLobby() {
  const lobbyId = Math.random().toString(36).substring(2, 8).toUpperCase();

  db.ref("lobbies/" + lobbyId).set({
    createdAt: Date.now(),
    players: {},
    game: "quiz"
  });

  return lobbyId;
}
// Test Lobby
function testLobby() {
  const id = createLobby();
  alert("Lobby erstellt: " + id);
}
//Lobby joinen
function joinLobby(lobbyId, name) {
  db.ref("lobbies/" + lobbyId + "/players/" + name).set({
    name: name,
    score: 0
  });
}

// Lobby aus 'URL lesen
function joinLobbyFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const lobbyId = urlParams.get("lobby");
  const name = document.getElementById("playerName").value;

  if (!lobbyId || !name) return alert("Fehler");

  joinLobby(lobbyId, name);

  alert("Beigetreten!");
}