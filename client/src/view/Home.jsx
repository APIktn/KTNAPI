function Home() {
  return (
    <div className="home" style={{ minHeight: 1800 }}>
      <div className="card">
        <div className="card-body">
          bootstrap auto theme
          <i className="fa-solid fa-user"></i>
          <i className="fa-regular fa-sun"></i>
          <i className="fa-solid fa-sun"></i>

          <p>ข้อความปกติ (Regular)</p>
          <h6>หัวข้อเล็ก (Regular)</h6>
          <p className="fw-light">Light</p>
          <p className="fw-medium">Medium</p>
          <p className="fw-semibold">SemiBold</p>
          <p className="fw-bold">Bold</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
