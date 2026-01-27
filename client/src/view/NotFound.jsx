import { Link } from "react-router-dom";
import bgVideo from "../assets/Design/video/NotFound.mp4";

function NotFound() {
  return (
    <div className="notfound-wrapper">
      <video autoPlay loop muted playsInline className="notfound-video">
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="notfound-content">
        <div className="notfound-text">
          404
          <br />
          Your URL was not found anywhere in this universe
        </div>

        <Link to="/" className="notfound-btn">
          but don’t worry, we can go back to home page
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
