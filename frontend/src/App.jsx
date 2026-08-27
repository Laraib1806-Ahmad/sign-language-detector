import { useState } from "react";
import Navbar from "./components/Navbar";
import Camera from "./components/Camera";
import Prediction from "./components/Prediction";
import BottomCards from "./components/BottomCards";
import DemoModal from "./components/DemoModal";
import "./App.css";

function App() {
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([]);
  const [sentence, setSentence] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  const handlePrediction = (result) => {
    if (result.detected) {
      setPrediction(result.sign);
      setConfidence(result.confidence);
      setIsDetecting(true);
      setHistory((prev) => {
        const updated = [...prev, result.sign].slice(-10);
        return updated;
      });
    } else {
      setIsDetecting(false);
    }
  };

  const handleClear = () => {
    setHistory([]);
    setSentence("");
    setPrediction(null);
    setConfidence(0);
    setIsDetecting(false);
  };

  const handleSave = () => {
    if (prediction) {
      setSentence((prev) => prev + prediction);
    }
  };

  return (
    <div className="app-bg">
      <div className="blob blob-top" />
      <div className="blob blob-bottom" />
      <div className="app-wrapper">
        <Navbar onDemoOpen={() => setShowDemo(true)} />
        <div className="main-grid">
          <Camera
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            onPrediction={handlePrediction}
            isDetecting={isDetecting}
            onClear={handleClear}
            onSave={handleSave}
          />
          <Prediction
            prediction={prediction}
            confidence={confidence}
            isDetecting={isDetecting}
          />
        </div>
        <BottomCards
          history={history}
          sentence={sentence}
          confidence={confidence}
        />
      </div>
      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
    </div>
  );
}

export default App;
