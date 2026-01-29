import { useEffect, useState } from "react";
import PageWrapper from "../context/animate";
import "../css/Home.css";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import logo from "../assets/Design/Image/mrbonelogo.png";
import img1 from "../assets/Design/Image/MRBONE_1.png";
import img2 from "../assets/Design/Image/MRBONE_2.png";
import img3 from "../assets/Design/Image/MRBONE_3.png";
import img4 from "../assets/Design/Image/MRBONE_4.png";
import img5 from "../assets/Design/Image/MRBONE_5.png";
import img6 from "../assets/Design/Image/MRBONE_6.png";
import img7 from "../assets/Design/Image/MRBONE_7.png";
import img8 from "../assets/Design/Image/MRBONE_8.png";
import img9 from "../assets/Design/Image/MRBone_pack1.png";

import video1 from "../assets/Design/video/MRBone_V1.mp4";
import video2 from "../assets/Design/video/MRBone_V2.mp4";

function Home() {
  const [animateText, setAnimateText] = useState(false);

  const images = [img1, img2, img3, img4, img5, img6, img7, img8];
  const [index, setIndex] = useState(0);
  const [animDir, setAnimDir] = useState(null);

  const leftImg = images[(index - 1 + images.length) % images.length];
  const centerImg = images[index];
  const rightImg = images[(index + 1) % images.length];

  const prev = () => {
    setAnimDir("left");
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = () => {
    setAnimDir("right");
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  // reset animation หลังเล่นจบ
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

    const cards = document.querySelectorAll(".scroll-fade");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const card2 = document.querySelector(".card-2");
    const titleTop = document.querySelector(".card-2-title");

    if (!card2) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          titleTop?.classList.add("animate");
          titleBottom?.classList.add("animate");
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(card2);

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
                    {/* text */}
                    <div className="col-lg-8 order-1 order-lg-1">
                      <h1
                        className={`fw-bold ${animateText ? "text-animate" : ""}`}
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
                        className={`fw-light mt-0 ${
                          animateText ? "text-animate-delay" : ""
                        }`}
                      >
                        who love unique and creative designs
                      </p>
                      <br />
                      <ul className="feature-list mt-2 slide-list">
                        <li>original art toy collections</li>
                        <li>limited & exclusive figures</li>
                        <li>designer toys from local artists</li>
                        <li>handcrafted details & quality paint</li>
                        <li>collectible pieces with unique stories</li>
                        <li>perfect for display & collection</li>
                      </ul>

                      <br />
                      <div className="mt-3 d-flex gap-2 flex-wrap">
                        <button className="btn btn-light btn-sm">
                          shop now
                        </button>
                        <button className="btn btn-outline-light btn-sm">
                          view collection
                        </button>
                      </div>
                      <br />
                    </div>

                    {/* logo */}
                    <div className="col-lg-4 order-2 order-lg-2 text-center">
                      <img
                        src={logo}
                        alt="bone chop logo"
                        className="hero-logo"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* card 2 */}
            <div className="col-lg-6 flex-column d-flex justify-content-evenly">
              {/* title อยู่นอก card */}
              <h2 className="fw-bold text-white mb-3 card-2-title text-center">
                select your style!
              </h2>

              <div className="card feature-card card-2 scroll-fade">
                <div className="card-body text-white text-center">
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <IconButton onClick={prev} size="small">
                      <ChevronLeftIcon sx={{ color: "#fff" }} />
                    </IconButton>

                    {/* left */}
                    <img
                      src={leftImg}
                      alt="left"
                      className={`mrbone-img side ${
                        animDir === "right"
                          ? "slide-left"
                          : animDir === "left"
                            ? "slide-right"
                            : ""
                      }`}
                    />

                    {/* center */}
                    <img
                      src={centerImg}
                      alt="center"
                      className={`mrbone-img center ${
                        animDir === "right"
                          ? "slide-in-right"
                          : animDir === "left"
                            ? "slide-in-left"
                            : ""
                      }`}
                    />

                    {/* right */}
                    <img
                      src={rightImg}
                      alt="right"
                      className={`mrbone-img side ${
                        animDir === "right"
                          ? "slide-left"
                          : animDir === "left"
                            ? "slide-right"
                            : ""
                      }`}
                    />

                    <IconButton onClick={next} size="small">
                      <ChevronRightIcon sx={{ color: "#fff" }} />
                    </IconButton>
                  </div>
                </div>
              </div>

              <h2 className="fw-bold text-white mb-3 card-2-title2 text-center">
                find your favorite
              </h2>
            </div>

            {/* card 3 */}
            <div className="col-lg-6">
              <div className="card feature-card card-3 video-card scroll-fade">
                {/* background video */}
                <video
                  className="bg-video"
                  src={video1}
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                {/* overlay */}
                <div className="video-overlay" />
                <div className="video-top-backdrop" />

                {/* content */}
                <div className="card-body text-white position-relative justify-content-end d-flex">
                  <h1 className="fw-bold big-title">
                    KEEP YOUR <br />
                    SUPER SECRET
                  </h1>
                </div>
              </div>
            </div>

            {/* card 4 */}
            <div className="col-lg-12">
              <div className="card feature-card card-4 split-card scroll-fade">
                <div className="row g-0 h-100">
                  {/* left */}
                  <div className="col-lg-8 split-left text-white d-flex align-items-center">
                    <div className="p-4">
                      <h3 className="fw-bold mb-3">
                        unboxing mr.bone <br /> camping series
                      </h3>

                      <p className="fw-light mb-0">
                        join mr.bone on his camping adventure and discover the
                        world of art toys.
                      </p>
                    </div>
                  </div>

                  {/* right */}
                  <div className="col-lg-4 split-right d-flex align-items-center justify-content-center">
                    <img src={img9} alt="mr bone pack" className="pack-img" />
                  </div>
                </div>
              </div>
            </div>

            {/* card 5 */}
            <div className="col-lg-12 mb-3">
              <div className="card feature-card card-5 video-card scroll-fade">
                {/* background video */}
                <video
                  className="bg-video"
                  src={video2}
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                {/* backdrop */}
                <div className="video-overlay" />

                {/* content */}
                <div className="card-body text-white d-flex align-items-center justify-content-center text-center">
                  <div>
                    <h3 className="fw-bold mb-2">contact me</h3>
                    <p className="fw-light mb-0">apisitamornktn@gmail.com</p>
                  </div>
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
