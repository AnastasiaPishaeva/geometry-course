import { Link, useLocation } from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import { styled } from '@mui/system';
import { useTheme } from "@mui/material/styles";
import logo from '../assets/logo.png'
import {useNavigate, useParams } from "react-router-dom";

const StyledHeader = styled("header")(({ theme }) => ({
  backgroundColor: theme.palette.primaryScale[400],
  padding: theme.spacing(7, 6),
  width: "100%",
  display: "flex", 
  marginBottom: theme.spacing(0.25),
  }));

const StyledNav = styled("nav")({
  display: "flex",
});

const StyledLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  position: "relative",
  color: theme.palette.background.default,
  fontSize: "18px",
  display: "flex",
  marginRight: "25px",
  textDecoration: "none",
  fontWeight: isActive ? "700" : "400",

  "&:hover": {
    textDecoration: "none",       
    color: theme.palette.background.default,
  },
}));

const Header = () => {
  const theme = useTheme();
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1] || "";
  const {sectionId} = useParams();
  const isLogin = sectionId != null;
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
        <Box sx={{ maxWidth: "154px", marginRight : "55px",
        "& img": {
                  width: "100%", 
                  height: "auto",
                  },
         }}>
          <Link to="/course">
            <img src={logo} alt="illustration" />
          </Link>
        </Box>
        <Box >
          <StyledNav>
            {/* <StyledLink to="/home" isActive={currentPath === "home"}> Курс </StyledLink> */}
            <StyledLink to="/personal-account" isActive={currentPath === "personal-accaunt"} > Личный кабинет </StyledLink>
          </StyledNav>
        </Box>
      </Grid>
    </StyledHeader>
  );
};

export default Header;