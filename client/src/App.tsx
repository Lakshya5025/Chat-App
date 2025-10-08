import { useEffect, useRef, useState, type SyntheticEvent } from "react";
interface payloadType {
  roomId?: number;
  message?: string;
}
function App() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    socketRef.current = ws;

    ws.onmessage = (ev) => {
      setMessages((prev) => [...prev, String(ev.data)]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSend = (e: SyntheticEvent) => {
    e.preventDefault();
    let type: string;
    const payload: payloadType = {};
    if (room) {
      type = "join";
      payload.roomId = parseInt(room);
    } else {
      type = "chat";
      payload.message = message;
    }
    if (socketRef.current)
      socketRef.current.send(JSON.stringify({ type, payload }));
  };

  return (
    <div className="h-screen bg-neutral-900 text-white">
      <div className="mx-auto h-full max-w-6xl p-4">
        <div className="flex h-full gap-4 flex-col md:flex-row">
          <section className="flex-1 rounded-lg bg-neutral-800 p-4 flex flex-col">
            <header className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Messages</h2>
            </header>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {messages.length === 0 && (
                <p className="text-neutral-400">No messages yet</p>
              )}
              {messages.map((m, idx) => (
                <div key={idx} className="rounded-md bg-neutral-700 px-3 py-2">
                  {m}
                </div>
              ))}
            </div>
          </section>

          <aside className="w-full md:w-96 rounded-lg bg-white p-4 text-neutral-900">
            <h2 className="mb-3 text-lg font-semibold">Send a message</h2>
            <form className="space-y-3">
              <div>
                <label className="mb-1 block text-sm">Room (optional)</label>
                <input
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500"
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="general"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm">Message</label>
                <input
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type here..."
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  onClick={handleSend}
                  className="rounded-md bg-neutral-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50">
                  Send
                </button>
              </div>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;
