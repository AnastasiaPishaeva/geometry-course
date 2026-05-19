import { Link, useLocation } from "react-router-dom";
import { Grid, Box } from "@mui/material";
import { styled } from '@mui/system';
import logo from '../assets/logo.png'

const StyledHeader = styled("header")(({ theme }) => ({
  backgroundColor: theme.palette.primaryScale[400],
  padding: theme.spacing(7, 6),
  width: "100%",
  display: "flex",
  marginBottom: theme.spacing(0.25),
}));


const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1] || "";
  return (
    <StyledHeader>
      <Grid
        container
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{
          maxWidth: "154px", marginRight: "55px",
          "& img": {
            width: "100%",
            height: "auto",
          },
        }}>
          {(currentPath === "registration" ||
            currentPath === "authorization") ? (
            <Link to="/geomGame">
              <img src={logo} alt="illustration" />
            </Link>
          ) : (
            <img src={logo} alt="illustration" />
          )}
        </Box>
      </Grid>
    </StyledHeader>
  );
};

export default Header;