import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [latestmessge, setLatestmessage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      console.log("Connected");
      setSocket(socket);
    };
    socket.onmessage = (message) => {
      console.log("Received message: ", message.data);
      setLatestmessage(message.data);
    };
    setSocket(socket);

    return () => {
      socket?.close();
    };
  }, []);

  if (!socket) {
    return <div>Connecting to socket server...</div>;
  }

  return (
    <>
      <div>
        <input
          type="text"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button onClick={() => socket.send(message)}>Click Me</button>
        <div>{latestmessge}</div>
      </div>
    </>
  );
}

export default App;
