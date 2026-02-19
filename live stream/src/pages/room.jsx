import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function Room() {
  const { roomid } = useParams();
  const containerRef = useRef(null);

  function generateRandomID(len) {
    let result = "";
    var chars =
      "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
    let maxPos = chars.length;
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  }

  const appID = 1758801532;
  const serverSecret = "1ecf958ed04273db0ffc16bc17f89185";

  const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    roomid,
    generateRandomID(5),
    generateRandomID(5),
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: containerRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
      },
      sharedLinks: [
        { name: "Copy Link", url: `http://localhost:5173/room/${roomid}` },
        { name: "Share Link", url: `http://localhost:5173/room/${roomid}` },
      ],
    });

    return () => {
      zp.destroy();
    };
  }, [roomid]);

  return (
    <div
      className="myCallContainer"
      ref={containerRef}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}
