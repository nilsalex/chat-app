import React, { useEffect, useRef, useState } from "react";

interface Message {
  text: string;
}

interface MessageSent {
  messageType: "sent";
  message: Message;
}

interface MessageReceived {
  messageType: "received";
  message: Message;
}

export const App = () => {
  const [messages, setMessages] = useState<
    Array<MessageSent | MessageReceived>
  >([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(
    () => {
      const socket = new WebSocket("ws://localhost:8080/");

      socket.onopen = () => console.log("ws opened");
      socket.onclose = () => console.log("ws closed");
      socket.onmessage = (event) => {
        console.log("message received");
        try {
          const message = JSON.parse(event.data);
          setMessages((
            currentMessages,
          ) => [...currentMessages, {
            messageType: "received",
            message,
          }]);
        } catch {
          console.log("could not parse message");
        }
      };

      ws.current = socket;

      return () => socket.close();
    },
    [],
  );

  return (
    <div style={{ width: "400px", marginLeft: "auto", marginRight: "auto" }}>
      <h1>Let's chat!</h1>
      <div>
        {messages.map((message) => (
          <div
            style={{
              textAlign: message.messageType === "sent" ? "right" : "left",
            }}
          >
            {message.message.text}
          </div>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const message = { text: input };
          ws.current?.send(JSON.stringify(message));
          setMessages(
            (currentMessages) => [...currentMessages, {
              messageType: "sent",
              message,
            }],
          );
          console.log("message sent");
          setInput("");
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(event) =>
            setInput(event.currentTarget.value)}
          style={{ width: "100%" }}
        />
      </form>
    </div>
  );
};
