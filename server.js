const express = require("express");
const path = require("path");
const createServer = require("http").createServer;
const socketio = require("socket.io");
const ejs = require("ejs");

const PORT = 3000;
const app = express();
const server = createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use("/", (req, res) => res.render("index.html"));

const messages = [];

io.on("connection", (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.emit('previousMessages', messages);

  socket.on("sendMessage", (data) => {
    messages.push(data);
    socket.broadcast.emit('receivedMessage', data);
  });
});

server.listen(PORT, () => console.log(`Server running in port ${PORT}`));
