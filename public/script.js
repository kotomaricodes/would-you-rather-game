const socket = io();

socket.on("question", ([a, b]) => {
  document.getElementById("question").textContent = "Would you rather...";
  document.getElementById("choiceA").textContent = a;
  document.getElementById("choiceB").textContent = b;
  document.getElementById("results").textContent = "";
});

socket.on("results", (votes) => {
  document.getElementById("results").textContent =
    `A: ${votes.A} votes | B: ${votes.B} votes`;
});

document.getElementById("choiceA").onclick = () => socket.emit("vote", "A");
document.getElementById("choiceB").onclick = () => socket.emit("vote", "B");
document.getElementById("nextBtn").onclick = () => socket.emit("next");
