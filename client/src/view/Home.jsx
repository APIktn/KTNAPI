import PageWrapper from "../context/animate";
import "../css/Home.css";

function Home() {
  return (
<PageWrapper>
  <div className="home">
    <div className="home-container">

      <div className="card feature-card card-1 mb-4">
        <div className="card-body text-white">
          <h5 className="fw-bold">daily planner</h5>
          <p className="fw-light">plan your day easily</p>
        </div>
      </div>

      <div className="card feature-card card-2 mb-4">
        <div className="card-body text-white">
          <h5 className="fw-bold">expense tracker</h5>
          <p className="fw-light">manage daily expenses</p>
        </div>
      </div>

      <div className="card feature-card card-3 mb-4">
        <div className="card-body text-white">
          <h5 className="fw-bold">personal notes</h5>
          <p className="fw-light">keep notes safely</p>
        </div>
      </div>

    </div>
  </div>
</PageWrapper>
  );
}


// function Home() {
//   return (
//     <PageWrapper>
//       <div className="home">
//         <div className="card">
//           <div className="card-body">
//             Home
//           </div>
//         </div>
//       </div>
//     </PageWrapper>
//   );
// }

export default Home;
