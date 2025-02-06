require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const http = require("http");
const path = require("path");
const db = require("./config/db");
db();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("joinEvent", (eventId) => {
    socket.join(eventId);
    console.log(`User joined event ${eventId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.set("socketio", io);

const authRoute = require("./routes/auth.routes");
const userRoute = require("./routes/user.routes");
const eventRoute = require("./routes/event.routes");
// const adminRoute = require("./routes/admin.routes");

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/event", eventRoute);
// app.use("/api/v1/admin", adminRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
