import { useEffect, useState } from "react";
import PageWrapper from "../context/animate";
import "../css/Home.css";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

/* ---------- asset paths (from public) ---------- */
const LOGO = "/assets/design/image/mrbonelogo.png";

const IMAGES = [
  "/assets/design/image/mrbone_1.png",
  "/assets/design/image/mrbone_2.png",
  "/assets/design/image/mrbone_3.png",
  "/assets/design/image/mrbone_4.png",
  "/assets/design/image/mrbone_5.png",
  "/assets/design/image/mrbone_6.png",
  "/assets/design/image/mrbone_7.png",
  "/assets/design/image/mrbone_8.png",
];

const PACK_IMAGE = "/assets/design/image/mrbone_pack1.png";

const VIDEO_1 = "/assets/design/video/mrbone_v1.mp4";
const VIDEO_2 = "/assets/design/video/mrbone_v2.mp4";

function Home() {
  const [animateText, setAnimateText] = useState(false);
  const [index, setIndex] = useState(0);
  const [animDir, setAnimDir] = useState(null);

  const leftImg = IMAGES[(index - 1 + IMAGES.length) % IMAGES.length];
  const centerImg = IMAGES[index];
  const rightImg = IMAGES[(index + 1) % IMAGES.length];

  const prev = () => {
    setAnimDir("left");
    setIndex((i) => (i === 0 ? IMAGES.length - 1 : i - 1));
  };

  const next = () => {
    setAnimDir("right");
    setIndex((i) => (i === IMAGES.length - 1 ? 0 : i + 1));
  };

  /* reset animation */
  useEffect(() => {
    if (!animDir) return;
    const t = setTimeout(() => setAnimDir(null), 300);
    return () => clearTimeout(t);
  }, [animDir]);

  useEffect(() => {
    setAnimateText(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 },
    );

    document
      .querySelectorAll(".scroll-fade")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const title = document.querySelector(".observe-title");
    if (!title) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          title.classList.add("animate");
          observer.unobserve(title);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(title);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const title2 = document.querySelector(".card-2-title2");
    if (!title2) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          title2.classList.add("animate");
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(title2);
    return () => observer.disconnect();
  }, []);

  return (
    <PageWrapper>
      <div className="home">
        <div className="home-container">
          <div className="row g-3">
            {/* card 1 */}
            <div className="col-lg-12">
              <div className="card feature-card card-1 scroll-fade">
                <div className="card-body text-white">
                  <div className="row align-items-center">
                    <div className="col-lg-8">
                      <h1
                        className={`fw-bold ${
                          animateText ? "text-animate" : ""
                        }`}
                      >
                        bone chop!
                      </h1>
                      <p
                        className={`fw-light mb-1 ${
                          animateText ? "text-animate-delay" : ""
                        }`}
                      >
                        art toy shop for collectors
                      </p>
                      <p
                        className={`fw-light ${
                          animateText ? "text-animate-delay" : ""
                        }`}
                      >
                        who love unique and creative designs
                      </p>

                      <ul className="feature-list mt-2 slide-list">
                        <li>original art toy collections</li>
                        <li>limited & exclusive figures</li>
                        <li>designer toys from local artists</li>
                        <li>handcrafted details & quality paint</li>
                        <li>collectible pieces with unique stories</li>
                        <li>perfect for display & collection</li>
                      </ul>
                    </div>

                    <div className="col-lg-4 text-center">
                      <img src={LOGO} alt="bone chop logo" className="hero-logo" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* card 2 */}
            <div className="col-lg-6">
              <h2 className="fw-bold text-white mb-3 text-center observe-title">
                select your style!
              </h2>

              <div className="card feature-card card-2 scroll-fade">
                <div className="card-body text-white text-center">
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <IconButton onClick={prev}>
                      <ChevronLeftIcon sx={{ color: "#fff" }} />
                    </IconButton>

                    <img src={leftImg} className="mrbone-img side" />
                    <img src={centerImg} className="mrbone-img center" />
                    <img src={rightImg} className="mrbone-img side" />

                    <IconButton onClick={next}>
                      <ChevronRightIcon sx={{ color: "#fff" }} />
                    </IconButton>
                  </div>
                </div>
              </div>

              <h2 className="fw-bold text-white mt-3 text-center card-2-title2">
                find your favorite
              </h2>
            </div>

            {/* card 3 */}
            <div className="col-lg-6">
              <div className="card feature-card card-3 video-card scroll-fade">
                <video
                  className="bg-video"
                  src={VIDEO_1}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="video-overlay" />
                <div className="card-body text-white d-flex align-items-end">
                  <h1 className="fw-bold big-title">
                    KEEP YOUR <br /> SUPER SECRET
                  </h1>
                </div>
              </div>
            </div>

            {/* card 4 */}
            <div className="col-lg-12">
              <div className="card feature-card card-4 split-card scroll-fade">
                <div className="row g-0 h-100">
                  <div className="col-lg-8 split-left text-white d-flex align-items-center">
                    <div className="p-4">
                      <h3 className="fw-bold">
                        unboxing mr.bone <br /> camping series
                      </h3>
                      <p className="fw-light">
                        join mr.bone on his camping adventure
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-4 split-right d-flex align-items-center justify-content-center">
                    <img src={PACK_IMAGE} className="pack-img" />
                  </div>
                </div>
              </div>
            </div>

            {/* card 5 */}
            <div className="col-lg-12">
              <div className="card feature-card card-5 video-card scroll-fade">
                <video
                  className="bg-video"
                  src={VIDEO_2}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="video-overlay" />
                <div className="card-body text-white text-center">
                  <h3 className="fw-bold">contact me</h3>
                  <p className="fw-light">apisitamornktn@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Home;
