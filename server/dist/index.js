import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
let users = [];
let userCount = 0;
wss.on("connection", (socket) => {
    console.log("User connected #", ++userCount);
    socket.on("message", (e) => {
        const data = JSON.parse(e.toString());
        if (data.type === "join" && data.roomId) {
            const payload = { socket: socket, roomId: data.roomId };
            users.push(payload);
        }
        else if (data.type === "message" && data.message) {
            let user = users.find((e) => e.socket == socket);
            let id = user?.roomId;
            users.forEach((e) => {
                if (e.roomId === id && data.message) {
                    e.socket.send(data.message);
                }
            });
        }
        socket.on("close", (e) => {
            users.filter((e) => e.socket != socket);
        });
    });
});
//# sourceMappingURL=index.js.map