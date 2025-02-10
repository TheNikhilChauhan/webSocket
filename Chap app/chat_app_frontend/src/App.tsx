import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "red",
          },
        })
      );
    };

    ws.onmessage = (e) => {
      setMessages((messages) => [...messages, e.data]);
    };

    ws.onerror = (error) => {
      console.log("Websocket error: ", error);
    };

    ws.onclose = () => {
      console.log("Websocket disconnected");
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="h-screen p-12 bg-slate-700 ">
      <div className="flex flex-col h-[85vh] bg-black">
        {messages.map((message, index) => (
          <div className="m-8 " key={index}>
            <span className="bg-white text-black rounded p-4 ">{message}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-white flex">
        <input
          type="text"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          className="flex-1 p-4"
        />
        <button
          onClick={() => {
            if (inputValue && wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(
                JSON.stringify({
                  type: "chat",
                  payload: {
                    message: inputValue,
                  },
                })
              );
              setInputValue("");
            }
          }}
          className="bg-purple-600 text-white p-4"
        >
          Send{" "}
        </button>
      </div>
    </div>
  );
}

export default App;
