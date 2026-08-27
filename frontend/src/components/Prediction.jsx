import { FiBarChart2, FiZap, FiCheckCircle } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import "./Prediction.css";

function Prediction({ prediction, confidence, isDetecting }) {
  const getBarClass = () => {
    if (confidence >= 90) return "high";
    if (confidence >= 70) return "medium";
    return "low";
  };

  return (
    <div className="prediction-card">
      <div className="prediction-title">
        <HiOutlineSparkles size={20} />
        Prediction Result
      </div>

      <div className={`prediction-circle ${prediction ? "active" : "empty"}`}>
        <span className="prediction-letter">
          {prediction || "?"}
        </span>
        {prediction && (
          <span className="prediction-sublabel">Detected</span>
        )}
      </div>

      <div className="confidence-section">
        <div className="confidence-header">
          <div className="confidence-label">
            <FiBarChart2 size={16} />
            Confidence
          </div>
          <span className="confidence-value">{confidence.toFixed(1)}%</span>
        </div>
        <div className="confidence-bar-bg">
          <div
            className={`confidence-bar-fill ${getBarClass()}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <div className="model-status">
        <FiCheckCircle size={16} />
        <span className="model-status-text">
          Model active — 94% trained accuracy
        </span>
      </div>
    </div>
  );
}

export default Prediction;
