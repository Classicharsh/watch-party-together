import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PreJoin() {
  const { roomid } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [devices, setDevices] = useState({ audioInputs: [], videoInputs: [] });
  const [selectedAudio, setSelectedAudio] = useState("");
  const [selectedVideo, setSelectedVideo] = useState("");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [stream, setStream] = useState(null);

  // Get available devices
  useEffect(() => {
    async function getDevices() {
      try {
        // Request permissions first
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

        const deviceList = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = deviceList.filter((d) => d.kind === "audioinput");
        const videoInputs = deviceList.filter((d) => d.kind === "videoinput");

        setDevices({ audioInputs, videoInputs });

        // Set default devices
        if (audioInputs.length > 0) setSelectedAudio(audioInputs[0].deviceId);
        if (videoInputs.length > 0) setSelectedVideo(videoInputs[0].deviceId);
      } catch (err) {
        console.error("Error getting devices:", err);
      }
    }

    getDevices();

    return () => {
      // Cleanup stream on unmount
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Start video preview when devices are selected
  useEffect(() => {
    async function startPreview() {
      if (!selectedAudio && !selectedVideo) return;

      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: selectedAudio ? { deviceId: selectedAudio } : true,
          video: selectedVideo ? { deviceId: selectedVideo } : true,
        });

        setStream(newStream);

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }

        // Set up audio level monitoring
        if (isAudioEnabled) {
          const audioContext = new AudioContext();
          const analyser = audioContext.createAnalyser();
          const source = audioContext.createMediaStreamSource(newStream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          function updateAudioLevel() {
            analyser.getByteFrequencyData(dataArray);
            const average =
              dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(Math.min(100, average / 1.28));
            requestAnimationFrame(updateAudioLevel);
          }

          updateAudioLevel();
        }
      } catch (err) {
        console.error("Error starting preview:", err);
      }
    }

    startPreview();
  }, [selectedAudio, selectedVideo]);

  // Toggle audio
  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
    }
    setIsAudioEnabled(!isAudioEnabled);
  };

  // Toggle video
  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
    }
    setIsVideoEnabled(!isVideoEnabled);
  };

  // Handle join
  const handleJoin = () => {
    navigate(`/room/${roomid}`, {
      state: {
        audioDeviceId: selectedAudio,
        videoDeviceId: selectedVideo,
        audioEnabled: isAudioEnabled,
        videoEnabled: isVideoEnabled,
      },
    });
  };

  // Handle back
  const handleBack = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    navigate("/");
  };

  return (
    <div className="prejoin">
      {/* Background animation */}
      <div className="prejoin-bg-animation">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="prejoin-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
            }}
          ></div>
        ))}
      </div>

      {/* Glow effects */}
      <div className="glow-strip-left"></div>
      <div className="glow-strip-right"></div>

      <button className="prejoin-back-btn" onClick={handleBack}>
        ← Back
      </button>

      <div className="prejoin-container">
        <h2>Set Up Your Devices</h2>

        {/* Video Preview */}
        <div className="prejoin-video-preview">
          {isVideoEnabled ? (
            <video ref={videoRef} autoPlay playsInline muted></video>
          ) : (
            <div className="prejoin-video-placeholder">📷</div>
          )}
        </div>

        {/* Controls */}
        <div className="prejoin-controls">
          <button
            className={`prejoin-control-btn ${isAudioEnabled ? "mic-on" : "mic-off"}`}
            onClick={toggleAudio}
            title={
              isAudioEnabled ? "Turn off microphone" : "Turn on microphone"
            }
          >
            {isAudioEnabled ? "🎤" : "🔇"}
          </button>

          <button
            className={`prejoin-control-btn ${isVideoEnabled ? "camera-on" : "camera-off"}`}
            onClick={toggleVideo}
            title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
          >
            {isVideoEnabled ? "📹" : "📷"}
          </button>
        </div>

        {/* Audio Meter */}
        {isAudioEnabled && (
          <div className="prejoin-audio-meter">
            <div
              className="prejoin-audio-meter-fill"
              style={{ width: `${audioLevel}%` }}
            ></div>
          </div>
        )}

        {/* Device Selection */}
        <div className="prejoin-select-group">
          <div>
            <label className="prejoin-label">Microphone</label>
            <select
              className="prejoin-select"
              value={selectedAudio}
              onChange={(e) => setSelectedAudio(e.target.value)}
            >
              {devices.audioInputs.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="prejoin-label">Camera</label>
            <select
              className="prejoin-select"
              value={selectedVideo}
              onChange={(e) => setSelectedVideo(e.target.value)}
            >
              {devices.videoInputs.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Join Button */}
        <button className="prejoin-join-btn" onClick={handleJoin}>
          Join Party 🚀
        </button>
      </div>
    </div>
  );
}

export default PreJoin;
