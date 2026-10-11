const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cells = [...document.querySelectorAll(".cell")];
const statusEl = document.querySelector("#status");
const scoreXEl = document.querySelector("#score-x");
const scoreOEl = document.querySelector("#score-o");
const scoreDrawEl = document.querySelector("#score-draw");
const scoreCards = {
  X: document.querySelector(".score-x"),
  O: document.querySelector(".score-o"),
};

const scores = { X: 0, O: 0, draw: 0 };
let board = Array(9).fill("");
let current = "X";
let locked = false;

function cellLabel(index, mark) {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const occupant = mark ? mark : "empty";
  return `Row ${row}, column ${col}, ${occupant}`;
}

function render() {
  cells.forEach((cell, index) => {
    const mark = board[index];
    cell.textContent = mark;
    cell.classList.toggle("x", mark === "X");
    cell.classList.toggle("o", mark === "O");
    cell.disabled = locked || mark !== "";
    cell.setAttribute("aria-label", cellLabel(index, mark));
  });

  scoreCards.X.classList.toggle("is-turn", !locked && current === "X");
  scoreCards.O.classList.toggle("is-turn", !locked && current === "O");
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDrawEl.textContent = scores.draw;
}

function winnerOf(state) {
  for (const [a, b, c] of LINES) {
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return { player: state[a], line: [a, b, c] };
    }
  }
  return null;
}

function finish(message) {
  locked = true;
  statusEl.textContent = message;
  cells.forEach((cell) => {
    cell.disabled = true;
  });
  scoreCards.X.classList.remove("is-turn");
  scoreCards.O.classList.remove("is-turn");
}

function play(index) {
  if (locked || board[index]) return;

  board[index] = current;
  const win = winnerOf(board);

  if (win) {
    scores[win.player] += 1;
    win.line.forEach((i) => cells[i].classList.add("win"));
    finish(`${win.player} wins`);
    render();
    return;
  }

  if (board.every(Boolean)) {
    scores.draw += 1;
    finish("Draw");
    render();
    return;
  }

  current = current === "X" ? "O" : "X";
  statusEl.textContent = `${current}'s turn`;
  render();
}

function newGame() {
  board = Array(9).fill("");
  current = "X";
  locked = false;
  cells.forEach((cell) => cell.classList.remove("win"));
  statusEl.textContent = "X goes first";
  render();
}

cells.forEach((cell) => {
  cell.addEventListener("click", () => play(Number(cell.dataset.index)));
});

document.querySelector("#new-game").addEventListener("click", newGame);

document.querySelector("#reset-scores").addEventListener("click", () => {
  scores.X = 0;
  scores.O = 0;
  scores.draw = 0;
  newGame();
});

render();
