import { useRef, useEffect, useCallback } from "react";
import { FiCamera, FiPlay, FiPause, FiTrash2, FiSave } from "react-icons/fi";
import "./Camera.css";

const FLASK_URL = "http://127.0.0.1:5000/predict";

function Camera({ isRunning, setIsRunning, onPrediction, isDetecting, onClear, onSave }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    clearInterval(intervalRef.current);
    setIsRunning(false);
  }, [setIsRunning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setIsRunning(true);
    } catch (err) {
      console.error("Camera error:", err);
      alert(`Camera error: ${err.message}`);
    }
  };

  // Video element mount hone ke baad stream attach karo
  useEffect(() => {
    if (isRunning && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((e) => console.error("Play error:", e));
    }
  }, [isRunning]);

  const captureAndPredict = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg", 0.7);

    fetch(FLASK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData }),
    })
      .then((res) => res.json())
      .then((data) => onPrediction(data))
      .catch(() => {});
  }, [onPrediction]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(captureAndPredict, 600);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, captureAndPredict]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="camera-card">
      <div className="camera-card-header">
        <div className="camera-card-title">
          <FiCamera size={20} />
          Live Camera Feed
        </div>
        <div className="status-indicator">
          <div className={`status-dot ${isDetecting ? "active" : "inactive"}`} />
          <span style={{ color: isDetecting ? "#10b981" : "#ef4444", fontSize: "12px", fontWeight: 600 }}>
            {isDetecting ? "Hand Detected" : "No Hand"}
          </span>
        </div>
      </div>

      <div className={`camera-feed-box ${isDetecting ? "detecting" : ""}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
            display: isRunning ? "block" : "none",
          }}
        />
        {!isRunning && (
          <div className="camera-placeholder">
            <FiCamera size={52} />
            <p>Press Start to activate camera</p>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      <div className="controls-row">
        {!isRunning ? (
          <button className="control-btn btn-start" onClick={startCamera}>
            <FiPlay size={15} />
            Start
          </button>
        ) : (
          <button className="control-btn btn-stop" onClick={stopCamera}>
            <FiPause size={15} />
            Stop
          </button>
        )}
        <button className="control-btn btn-save" onClick={onSave} disabled={!isRunning}>
          <FiSave size={15} />
          Save Letter
        </button>
        <button className="control-btn btn-clear" onClick={onClear}>
          <FiTrash2 size={15} />
          Clear
        </button>
      </div>
    </div>
  );
}

export default Camera;