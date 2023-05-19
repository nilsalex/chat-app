import React, { useEffect, useRef, useState } from "react";

export const App = () => {
  const [messages, setMessages] = useState<Array<string>>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(
    () => {
      const socket = new WebSocket("ws://localhost:8080/");

      socket.onopen = () => console.log("ws opened!");
      socket.onclose = () => console.log("ws closed!");
      socket.onmessage = (event) =>
        setMessages((currentMessages) => [...currentMessages, event.data]);

      ws.current = socket;

      return () => socket.close();
    },
    [],
  );

  return (
    <div>
      <h1>Let's chat!</h1>
      <div>
        {messages.map((message) => <div>{message}</div>)}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          ws.current?.send(input);
          setInput("");
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
        />
      </form>
    </div>
  );
};
