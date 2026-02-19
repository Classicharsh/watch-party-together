import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  let [input, setInput] = React.useState("");
  let navigate = useNavigate();
  function handleJoin() {
    if (input.trim()) {
      navigate(`/room/${input}`);
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      handleJoin();
    }
  }

  return (
    <div className="home">
      {/* Sparkles and effects on the sides */}
      <div className="sparkles-container">
        {/* Left side sparkles */}
        <div className="sparkle sparkle-left-1"></div>
        <div className="sparkle sparkle-left-2"></div>
        <div className="sparkle sparkle-left-3"></div>
        <div className="sparkle sparkle-left-4"></div>
        <div className="sparkle sparkle-left-5"></div>
        <div className="sparkle sparkle-left-6"></div>

        {/* Right side sparkles */}
        <div className="sparkle sparkle-right-1"></div>
        <div className="sparkle sparkle-right-2"></div>
        <div className="sparkle sparkle-right-3"></div>
        <div className="sparkle sparkle-right-4"></div>
        <div className="sparkle sparkle-right-5"></div>
        <div className="sparkle sparkle-right-6"></div>

        {/* Floating particles - left */}
        <div className="particle particle-left-1"></div>
        <div className="particle particle-left-2"></div>
        <div className="particle particle-left-3"></div>

        {/* Floating particles - right */}
        <div className="particle particle-right-1"></div>
        <div className="particle particle-right-2"></div>
        <div className="particle particle-right-3"></div>
      </div>

      {/* Glow effects on sides */}
      <div className="glow-strip-left"></div>
      <div className="glow-strip-right"></div>

      <div className="home-container">
        <div className="app-title">
          <h1>WATCH PARTY TOGETHER</h1>
          <p className="subtitle">
            Sync up and watch videos with friends in real-time!
          </p>
        </div>

        <div className="join-section">
          <input
            type="text"
            placeholder="Enter your room ID"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="room-input"
          />
          <button onClick={handleJoin} className="join-button">
            Join Party
          </button>
        </div>

        <div className="features">
          <div className="feature">
            <span className="feature-icon">🎬</span>
            <span>Watch Together</span>
          </div>
          <div className="feature">
            <span className="feature-icon">💬</span>
            <span>Chat in Real-time</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🎥</span>
            <span>Sync Videos</span>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <p>made by Harsh</p>
      </footer>
    </div>
  );
}

export default Home;
