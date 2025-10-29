const socket = io();

let showingResults = false; // tracks whether you're on results page

function updateButtons([a, b]) {
  document.getElementById("question").textContent = "Would you rather...";
  document.getElementById("choiceA").textContent = a;
  document.getElementById("choiceB").textContent = b;
  document.getElementById("results").textContent = "";
  showingResults = false;
  document.getElementById("nextBtn").textContent = "Show Results";
}

socket.on("question", ([a, b]) => {
  updateButtons([a, b]);
});

socket.on("results", (votes) => {
  document.getElementById("results").textContent =
    `A: ${votes.A} votes | B: ${votes.B} votes`;
  showingResults = true;
  document.getElementById("nextBtn").textContent = "Next Question";
});

document.getElementById("choiceA").onclick = () => socket.emit("vote", "A");
document.getElementById("choiceB").onclick = () => socket.emit("vote", "B");

document.getElementById("nextBtn").onclick = () => {
  if (!showingResults) {
    // First click: request results only for this client
    socket.emit("getResults");
  } else {
    // Second click: tell server to go to next question for everyone
    socket.emit("next");
  }
};
