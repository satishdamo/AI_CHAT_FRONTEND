import styles from "./messageList.module.css";
import Image from "next/image";

type MessageListProps = {
  chatHistory: { sender: string; content: string | File; isImage: boolean }[];
  userMessage: string;
  setUserMessage: (message: string) => void;
  setChatHistory: React.Dispatch<
    React.SetStateAction<
      { sender: string; content: string | File; isImage: boolean }[]
    >
  >;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
};

const MessageList = ({
  chatHistory,
  userMessage,
  setUserMessage,
  setChatHistory,
  loading,
  setLoading,
  imageFile,
  setImageFile,
}: MessageListProps) => {
  const sendMessage = async () => {
    if (!userMessage.trim()) return; // Prevent sending empty messages

    setLoading(true); // Set loading state to true while sending the message

    try {
      const formData = new FormData();
      formData.append("prompt", userMessage);
      if (imageFile) {
        formData.append("file", imageFile);
      }
      const response = await fetch("http://127.0.0.1:8000/uploadfile/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (imageFile) {
        setChatHistory((prev) => [
          ...prev,
          { sender: "user", content: userMessage, isImage: false },
          { sender: "user", content: imageFile, isImage: true },
          {
            sender: "bot",
            content: data.response || "No response from bot",
            isImage: false,
          },
        ]);
      } else {
        setChatHistory(
          (
            prev: { sender: string; content: string | File; isImage: boolean }[]
          ) => [
            ...prev,
            { sender: "user", content: userMessage, isImage: false },
            {
              sender: "bot",
              content: data.response || "No response from bot",
              isImage: false,
            },
          ]
        );
      }
      setUserMessage("");
      setImageFile(null); // Clear the image file after sending
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      // Simulate a bot response after sending the user's message
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Chat with SatGPT</h1>
      <div className={styles.chatBox}>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              chat.sender === "user" ? styles.userMessage : styles.botMessage
            }`}
          >
            {!chat.isImage &&
              (chat.sender === "user" ? (
                <Image
                  src="/images/user.png"
                  alt="User"
                  width={24}
                  height={24}
                />
              ) : (
                <Image
                  src="/images/chatbot2.png"
                  alt="Bot"
                  width={28}
                  height={28}
                />
              ))}
            {chat.isImage ? (
              <Image
                src={URL.createObjectURL(chat.content as File)}
                alt="Uploaded"
                width={100}
                height={100}
                className={styles.imageMessage}
              />
            ) : (
              <span className={styles.messageContent}>
                {typeof chat.content === "string" ? chat.content : ""}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.input}
          placeholder="Type your message..."
          autoComplete="off"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          disabled={loading}
        />
        <label htmlFor="image-upload" className={styles.paperclipButton}>
          📎
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className={styles.inputImage}
          onChange={handleImageUpload}
        />
        <button
          onClick={sendMessage}
          className={styles.button}
          disabled={loading}
        >
          {loading ? "sending" : "send"}
        </button>
      </div>
    </div>
  );
};

export default MessageList;
