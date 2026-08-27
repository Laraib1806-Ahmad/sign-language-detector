import { FiInfo, FiClock, FiEdit, FiTrendingUp } from "react-icons/fi";
import "./BottomCards.css";

function BottomCards({ history, sentence, confidence }) {
  const avgConfidence =
    history.length > 0 ? (confidence).toFixed(1) : "0.0";

  return (
    <div className="bottom-grid">
      {/* Instructions */}
      <div className="bottom-card">
        <div className="bottom-card-title">
          <FiInfo size={16} />
          How to Use
        </div>
        <ul className="instructions-list">
          <li>
            <span className="instruction-dot" />
            Allow camera access when prompted
          </li>
          <li>
            <span className="instruction-dot" />
            Keep your hand inside the frame
          </li>
          <li>
            <span className="instruction-dot" />
            Use good lighting for better results
          </li>
          <li>
            <span className="instruction-dot" />
            Show one hand at a time
          </li>
          <li>
            <span className="instruction-dot" />
            Press Save Letter to build a sentence
          </li>
        </ul>
      </div>

      {/* History */}
      <div className="bottom-card">
        <div className="bottom-card-title">
          <FiClock size={16} />
          Prediction History
        </div>
        {history.length > 0 ? (
          <div className="history-list">
            {history.map((letter, i) => (
              <span key={i} className="history-chip">
                {letter}
              </span>
            ))}
          </div>
        ) : (
          <p className="history-empty">No predictions yet. Start the camera.</p>
        )}
      </div>

      {/* Sentence Builder */}
      <div className="bottom-card">
        <div className="bottom-card-title">
          <FiEdit size={16} />
          Sentence Builder
        </div>
        <div className="sentence-box">
          {sentence ? (
            sentence
          ) : (
            <span className="sentence-empty">
              Press Save Letter to add detected signs here
            </span>
          )}
        </div>
      </div>

      {/* Accuracy */}
      <div className="bottom-card">
        <div className="bottom-card-title">
          <FiTrendingUp size={16} />
          Model Stats
        </div>
        <div className="accuracy-stats">
          <div>
            <div className="stat-row">
              <span className="stat-label">Trained Accuracy</span>
              <span className="stat-value">94%</span>
            </div>
            <div className="stat-bar-bg" style={{ marginTop: "6px" }}>
              <div className="stat-bar-fill" style={{ width: "94%" }} />
            </div>
          </div>
          <div>
            <div className="stat-row">
              <span className="stat-label">Current Confidence</span>
              <span className="stat-value">{avgConfidence}%</span>
            </div>
            <div className="stat-bar-bg" style={{ marginTop: "6px" }}>
              <div
                className="stat-bar-fill"
                style={{ width: `${avgConfidence}%` }}
              />
            </div>
          </div>
          <div className="stat-row">
            <span className="stat-label">Total Classes</span>
            <span className="stat-value">28</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BottomCards;
