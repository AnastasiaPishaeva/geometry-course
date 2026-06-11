import { Link, useLocation } from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import { styled } from '@mui/system';
import { useTheme } from "@mui/material/styles";
import logo from '../assets/logo.png'
import api from "../api/api";
import { useQuery } from "@tanstack/react-query";
import start_picture from "../assets/star.svg";
import type { Stars, User } from "../entities/types"

const StyledHeader = styled("header")(({ theme }) => ({
  backgroundColor: theme.palette.primaryScale[400],
  padding: theme.spacing(3, 6),
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
  color: "#F2F5FD",
  fontSize: "18px",
  display: "flex",
  marginRight: "25px",
  textDecoration: "none",
  fontWeight: isActive ? "700" : "400",

  "&:hover": {
    textDecoration: "none",
    color: "#F2F5FD",
  },
}));

const Header = () => {
  const theme = useTheme();
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1] || "";
  const fetchProgress = async (): Promise<Stars> => {
    try {
      const res = await api.get<Stars>(`api/v1/users/${user?.user_id}/stars`);
      return res.data;
    } catch (error) {
      console.error("Ошибка загрузки количества звезд", error);
      throw new Error("Ошибка загрузки количества звезд");
    }
  };
  const fetchUser = async (): Promise<User> => {
    try {
      const res = await api.get<User>(`api/v1/auth/me`);
      return res.data;
    } catch (error) {
      console.error("Ошибка загрузки активного пользователя", error);
      throw new Error("Ошибка загрузки активного пользователя");
    }
  };

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["activeUser"],
    queryFn: fetchUser,
  });

  const { data: stars } = useQuery({
    queryKey: ["stars", user?.user_id],
    queryFn: fetchProgress,
    enabled: !!user?.user_id,
  });
  
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
          <img src={logo} alt="illustration" />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <StyledNav>
            <StyledLink to="/course/1/lesson/4/section/1" isActive={currentPath === "course"}> Курс </StyledLink>
            <StyledLink to="/personal-account" isActive={currentPath === "personal-account"} > Личный кабинет </StyledLink>
          </StyledNav>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            marginRight: theme.spacing(10)
          }}>
          <img
            key={user?.user_id}
            src={start_picture}
            style={{
              width: "29px"
            }}>
          </img>
          <Typography variant="h4" sx={{ color: "white" }}>
            {stars?.total_stars}
          </Typography>
        </Box>
      </Grid>
    </StyledHeader>
  );
};

export default Header;