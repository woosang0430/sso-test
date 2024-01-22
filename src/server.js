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
    console.log("client send message: ", message);

    const parseMessage = JSON.parse(message);

    console.log("parsed message: ", parseMessage);

    let userInfo = "";

    if (parseMessage.rqtype === "getknoxsso") {
      userInfo = JSON.stringify({
        data: {
          key: "UrFCegWO8ttXWCEHIpFptw==",
          result: "success",
          userInfo: "jAit4UfdyunQ2G+iUJrXUw==",
        },
        rpcode: "RETURN_SUCCESS",
      });
    } else if (parseMessage.rqtype === "") {
      userInfo = JSON.stringify({
        detail: "empty message",
        rpcode: "EMPTY_BOX",
      });
    } else {
      userInfo = JSON.stringify({
        detail: "JSON format invalid.",
        rpcode: "ERROR",
      });
    }

    socket.send(userInfo);
  });
});

server.listen(port, handleListen);
