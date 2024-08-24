import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(null);
  const [reply, setReply] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchThreads();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "D" && currentThread) {
        deleteThread(currentThread.id);
      }
      if (e.key === "R" && currentThread) {
        document.getElementById("reply-box").focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentThread]);

  const fetchThreads = async () => {
    const response = await fetch("/onebox/list");
    const data = await response.json();
    setThreads(data);
  };

  const fetchThreadDetails = async (id) => {
    const response = await fetch(`/onebox/${id}`);
    const data = await response.json();
    setCurrentThread(data);
  };

  const deleteThread = async (id) => {
    await fetch(`/onebox/${id}`, { method: "DELETE" });
    setThreads(threads.filter((thread) => thread.id !== id));
    setCurrentThread(null);
  };

  const handleLogin = () => {
    // Mock login
    setIsLoggedIn(true);
  };

  const handleSendReply = async () => {
    await fetch(`/reply/${currentThread.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "your-email@example.com",
        to: currentThread.email,
        subject: currentThread.subject,
        body: reply,
      }),
    });
    setReply("");
    alert("Reply sent!");
  };

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      {!isLoggedIn ? (
        <div className="login-page">
          <h2>Login</h2>
          <button onClick={handleLogin}>Login with Google</button>
        </div>
      ) : (
        <div className="onebox">
          <header>
            <h2>Onebox</h2>
            <button onClick={() => setDarkMode(!darkMode)}>
              Toggle {darkMode ? "Light" : "Dark"} Mode
            </button>
          </header>
          <div className="threads-list">
            {threads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => fetchThreadDetails(thread.id)}
              >
                {thread.subject}
              </div>
            ))}
          </div>
          {currentThread && (
            <div className="thread-details">
              <h3>{currentThread.subject}</h3>
              <div dangerouslySetInnerHTML={{ __html: currentThread.body }} />
              <textarea
                id="reply-box"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply here..."
              />
              <button onClick={handleSendReply}>Send Reply</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
