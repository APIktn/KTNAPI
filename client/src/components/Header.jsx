import Grid from "@mui/material/Grid";
import Navbar from "./Nav/Navbar";

function Header() {
  return (
    <Grid container>
      {/* row */}
      <Grid item xs={12}>
        {/* col 12 */}
        <Navbar />
      </Grid>
    </Grid>
  );
}

export default Header;
