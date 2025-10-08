import { useEffect, useRef, useState, type SyntheticEvent } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [room, setRoom] = useState<string>("");
  const socketConnection = useRef<WebSocket | null>(null);
  function onMessage(e: SyntheticEvent) {
    e.preventDefault();
    socketConnection.current?.send(message);
  }
  useEffect(() => {
    socketConnection.current = new WebSocket("ws://localhost:8080");
    socketConnection.current.onmessage = (ev) => {
      setUserMessages((prevMessages) => [...prevMessages, ev.data]);
    };
  }, []);
  return (
    <div>
      <div></div>
      <div>
        <form>
          <div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Text"
            />
          </div>
          <div>
            <input
              type="text"
              value={room}
              placeholder="Room name"
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          <button onClick={(e) => onMessage(e)}>Send</button>
        </form>
        <div>
          <p>Messages</p>
          {userMessages.map((e: string) => {
            return <p>{e}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
