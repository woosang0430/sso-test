import http from "http";
import WebSocket, { WebSocketServer } from "ws";

import express from "express";

const app = express();

const port = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:${port}`);

// http server
const server = http.createServer(app);

// ws server
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
  console.log("Connected to Browser ✅");

  socket.on("close", () => {
    console.log("Disconnected from the Browser ❌");
  });

  socket.on("message", (message) => {
    const parseMessage = JSON.parse(message);

    let userInfo = "";

    if (parseMessage.rptype === "getknoxsso") {
      userInfo = JSON.stringify({
        rpcode: "RETURN_SUCCESS",
        data: {
          key: "✅ Success",
          userInfo: { name: "woosang" },
        },
      });
    } else if (parseMessage.rptype === "") {
      userInfo = JSON.stringify({
        rpcode: "EMPTY_BOX",
        data: {
          key: "⚠️ Failed : empty id",
          userInfo: null,
        },
      });
    } else {
      userInfo = JSON.stringify({
        rpcode: "ERROR",
        data: {
          key: "❗️ Not Found : not found id",
          userInfo: null,
        },
      });
    }

    socket.send(userInfo);
  });
});

server.listen(port, handleListen);
