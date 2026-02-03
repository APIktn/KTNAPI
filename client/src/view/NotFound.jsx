import { Link } from "react-router-dom";

const BG_VIDEO = "/assets/design/video/notfound.mp4";

function NotFound() {
  return (
    <div className="notfound-wrapper">
      <video autoPlay loop muted playsInline className="notfound-video">
        <source src={BG_VIDEO} type="video/mp4" />
      </video>

      <div className="notfound-content">
        <div className="notfound-text">
          404
          <br />
          Your URL was not found anywhere in this universe
        </div>

        <Link to="/" className="btn-glass">
          but don’t worry, we can go back to home page
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
