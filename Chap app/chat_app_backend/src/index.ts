import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

interface IncomingMessage {
  type: "join" | "chat";
  payload: {
    roomId?: string;
    message?: string;
  };
}

let userCount = 0;
let allSockets: User[] = [];

wss.on("connection", (socket) => {
  userCount = userCount + 1;
  console.log("user connected" + userCount);

  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString()) as IncomingMessage;
    if (parsedMessage.type == "join" && parsedMessage.payload.roomId) {
      console.log("user joined room " + parsedMessage.payload.roomId);
      allSockets.push({
        socket,
        room: parsedMessage.payload.roomId,
      });
    }
    if (parsedMessage.type == "chat") {
      console.log("user wants to chat");

      let currentUserRoom = null;
      for (let i = 0; i < allSockets.length; i++) {
        if (allSockets[i].socket == socket) {
          currentUserRoom = allSockets[i].room;
          break;
        }
      }

      if (currentUserRoom) {
        allSockets.forEach((user) => {
          if (user.room === currentUserRoom) {
            user.socket.send(parsedMessage?.payload?.message!);
          }
        });
      }
    }
  });

  socket.on("close", () => {
    allSockets = allSockets.filter((user) => user.socket != socket);
    console.log("User disconnected");
  });
});
