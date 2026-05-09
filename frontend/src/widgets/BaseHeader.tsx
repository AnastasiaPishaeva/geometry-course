import { Link, useLocation } from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import { styled, width } from '@mui/system';
import { useTheme } from "@mui/material/styles";
import logo from '../assets/logo.png'
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../app/providers/AuthProvider";
import start_picture from "../assets/star.svg";
import type {Stars} from "../entities/types"

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
  const { sectionId } = useParams();
  const isLogin = sectionId != null;
  const { user, setUser } = useAuth();
  const fetchProgress = async (): Promise<Stars> => {
    try {
      const res = await api.get<Stars>(`api/v1/users/${user?.user_id}/stars`);
      return res.data;
    } catch (error) {
      console.error("Ошибка загрузки секций", error);
      throw new Error("Ошибка загрузки тем");
    }
  };

  const { data: stars, isLoading, error } = useQuery({
    queryKey: ["stars"],
    queryFn: fetchProgress,
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
          <Link to="/geomGame">
            <img src={logo} alt="illustration" />
          </Link>
        </Box>
        <Box sx={{flexGrow: 1}}>
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
          <Typography variant="h4" sx={{color: "white"}}>
            {stars?.total_stars}
          </Typography>
        </Box>
      </Grid>
    </StyledHeader>
  );
};

export default Header;