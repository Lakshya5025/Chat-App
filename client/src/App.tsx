import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [userMessages, setUserMessages] = useState<string[]>([]);
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
      <form>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={(e) => onMessage(e)}>Send</button>
      </form>
      <div>
        <p>Messages</p>
        {userMessages.map((e: string) => {
          return <p>{e}</p>;
        })}
      </div>
    </div>
  );
}

export default App;
