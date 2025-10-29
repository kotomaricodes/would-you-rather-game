import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, "public")));

const questions = [
  ["Be able to fly", "Be invisible"],
  ["Never need sleep", "Never need food"],
  ["Live 100 years in the future", "Live 100 years in the past"]
];

let currentQuestion = 0;
let votes = { A: 0, B: 0 };

io.on("connection", (socket) => {
  console.log("New player connected");
  socket.emit("question", questions[currentQuestion]);

  socket.on("vote", (choice) => {
    votes[choice]++;
  });

  // client asks for results when they want to see them
  socket.on("getResults", () => {
    socket.emit("results", votes);
  });

  // only advance when the *first* player who presses next twice does so
  socket.on("next", () => {
    currentQuestion = (currentQuestion + 1) % questions.length;
    votes = { A: 0, B: 0 };
    io.emit("question", questions[currentQuestion]);
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected");
  });
});
