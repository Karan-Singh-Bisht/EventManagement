require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const http = require("http");
const path = require("path");
const cron = require("node-cron");
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

cron.schedule("*/5 * * * *", () => {
  exec("curl https://eventmanagement-iggq.onrender.com");
  console.log("Corn running....");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// WebSocket Connection
io.on("connection", (socket) => {
  socket.on("connect", () => {
    console.log("Client connected", socket.id);
  });

  socket.on("joinEvent", (eventId) => {
    socket.join(eventId);
  });

  socket.on("eventCreated", (eventData) => {
    io.emit("new event", eventData);
  });

  socket.on("eventUpdated", (eventData) => {
    io.to(eventData?.eventId).emit("eventUpdated", eventData);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.set("socketio", io);

const authRoute = require("./routes/auth.routes");
const userRoute = require("./routes/user.routes");
const eventRoute = require("./routes/event.routes");

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/event", eventRoute);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
