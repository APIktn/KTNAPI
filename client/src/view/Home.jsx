import PageWrapper from "../context/animate";

function Home() {
  return (
    <PageWrapper>
      <div className="home">
        <div className="card">
          <div className="card-body">
            Home
            <i className="fa-solid fa-user"></i>
            <i className="fa-regular fa-sun"></i>
            <i className="fa-solid fa-sun"></i>
            <p>Home (Regular)</p>
            <h6>Home (Regular)</h6>
            <p className="fw-light">Light Home</p>
            <p className="fw-medium">Medium Home</p>
            <p className="fw-semibold">SemiBold Home</p>
            <p className="fw-bold">Bold Home</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Home;
