import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });
interface user {
  socket: WebSocket;
  roomId: number;
}

interface dataType {
  type: string;
  payload: {
    roomId?: number;
    message?: string;
  };
}

let users: user[] = [];

let userCount = 0;
wss.on("connection", (socket) => {
  console.log("User connected #", ++userCount);

  socket.on("message", (e) => {
    const data: dataType = JSON.parse(e.toString());
    if (data.type === "join" && data.payload.roomId) {
      const payload = { socket: socket, roomId: data.payload.roomId };
      users.push(payload);
    } else if (data.type === "message" && data.payload.message) {
      const id = users.find((e) => e.socket == socket)?.roomId;
      users.forEach((e) => {
        if (e.roomId === id && data.payload.message) {
          e.socket.send(data.payload.message);
        }
      });
    }
    socket.on("close", (e) => {
      users.filter((e) => e.socket != socket);
    });
  });
});
