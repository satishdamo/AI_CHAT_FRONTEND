"use client";

import MessageList from "./messageList";
import React, { useState } from "react";

const App = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { sender: string; content: string | File; isImage: boolean }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  return (
    <div className="app">
      <MessageList
        chatHistory={chatHistory}
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        setChatHistory={setChatHistory}
        loading={loading}
        setLoading={setLoading}
        imageFile={imageFile}
        setImageFile={setImageFile}
      />
    </div>
  );
};

export default App;
