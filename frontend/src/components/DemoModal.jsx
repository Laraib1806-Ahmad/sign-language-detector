import { FiX, FiGrid } from "react-icons/fi";
import aslChart from "../asl_chart.png";
import "./DemoModal.css";

function DemoModal({ onClose }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box">
        <div className="modal-header">
          <div className="modal-header-left">
            <FiGrid size={24} />
            <div>
              <h2>ASL Alphabet Reference</h2>
              <p>Hand signs for all 26 letters</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        <div className="modal-body">
          <img
            src={aslChart}
            alt="ASL Alphabet Chart"
            className="asl-chart-img"
          />
        </div>
      </div>
    </div>
  );
}

export default DemoModal;