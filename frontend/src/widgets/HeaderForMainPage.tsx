import { Link, useLocation } from "react-router-dom";
import { Grid, Box, IconButton, useTheme } from "@mui/material";
import { styled } from '@mui/system';
import logo from '../assets/logo.png'
import { ThemeContext } from "../app/providers/ThemeProvider";
import { useContext } from "react";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const StyledHeader = styled("header")(({ theme }) => ({
  backgroundColor: theme.palette.primaryScale[400],
  padding: theme.spacing(7, 6),
  width: "100%",
  display: "flex",
  marginBottom: theme.spacing(0.25),
}));

const ThemeButton = styled(IconButton)(({ theme }) => ({
  width: "35px",
  height: "35px",
  outline: "none",
    "&:focus": {
        outline: "none",
    },
    "&.Mui-focusVisible": {
        outline: "none",
    },
}))


const Header = () => {
  const location = useLocation();
  const theme = useTheme();
  const { mode, toggleTheme } = useContext(ThemeContext);
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
        <Box sx = {{ marginLeft: "auto"}}>
          <ThemeButton onClick={toggleTheme}>
            {mode === "dark" ?
                        <LightModeIcon sx={{ color: theme.palette.primaryScale[200] }} /> :
                        <DarkModeIcon sx={{ color: theme.palette.primaryScale[200] }} />}
          </ThemeButton>
        </Box>
      </Grid>
    </StyledHeader>
  );
};

export default Header;