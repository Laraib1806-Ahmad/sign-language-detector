import { FiHelpCircle, FiSettings, FiGrid } from "react-icons/fi";
import { FaHands } from "react-icons/fa";
import "./Navbar.css";

function Navbar({ onDemoOpen }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <FaHands size={34} className="navbar-logo-icon" />
        <div className="navbar-text">
          <h1>SignSpeak AI</h1>
          <p>Real-Time Sign Language Recognition</p>
        </div>
      </div>

      <div className="navbar-right">
        <button className="demo-btn" onClick={onDemoOpen}>
          <FiGrid size={15} />
          View Signs
        </button>
        
      </div>
    </nav>
  );
}

export default Navbar;
