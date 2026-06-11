import { Grid, Box, Typography, Button, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import logo_light from "../assets/HomePage/logo_light.svg";
import logo_dark from "../assets/HomePage/logo_dark.svg";
import pattern1_light from "../assets/HomePage/pattern1.svg";
import pattern2_light from "../assets/HomePage/pattern2.svg";
import pattern1_dark from "../assets/HomePage/pattern1_dark.svg";
import pattern2_dark from "../assets/HomePage/pattern2_dark.svg";
import { useContext } from "react";
import { ThemeContext } from "../app/providers/ThemeProvider";

const Banner = () => {
    const theme = useTheme();
    const isLessThan1100 = useMediaQuery("(max-width:1100px)");
    const navigate = useNavigate();
    const { mode } = useContext(ThemeContext);
    return (
        <Grid container sx={{ width: "100%" }}>
            <Grid size={{ xs: 12 }} sx={{
                position: "relative",
                overflow: "hidden",
                overflowY: "auto",
                background: theme.palette.primaryScale[1000],
                height: "600px",
                width: "100%",
            }}>
                <Box
                    sx={{
                        pt: "184px",
                        pl: "105px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box
                        component="img"
                        src={mode === "light" ? logo_light : logo_dark}
                        sx={{
                            width: "258px",
                        }}
                    />

                    <Typography
                        variant="h2"
                        sx={{
                            mt: "32px",
                            fontSize: "32px",
                            lineHeight: "38px",
                            color: theme.palette.primaryScale[200],
                        }}
                    >
                        Понятная геометрия для 6-8 классов
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{
                            mt: "16px",
                            color: theme.palette.primaryScale[100],
                            lineHeight: "24px",
                            width: "650px",
                        }}
                    >
                        Образовательный онлайн-сервис, в котором геометрия изучается через игру. Вместо скучной теории — уровни, задания, игровые механики и наглядные примеры, которые помогают легко понять даже сложные темы.
                    </Typography>
                    <Button
                        onClick={() => navigate("/authorization")}
                        sx={{
                            width: "282px",
                            height: "50px",
                            background: theme.palette.primaryScale[300],
                            borderRadius: "20px",
                            mt: "28px",
                            outline: "none",
                            "&:focus": {
                                outline: "none",
                            },
                            "&.Mui-focusVisible": {
                                outline: "none",
                            },
                        }}
                    >
                        <Typography
                            variant="btnText"
                            sx={{
                                color: "white",
                            }}
                        >
                            Начать
                        </Typography>
                    </Button>
                </Box>
                <Box
                    component="img"
                    src={mode === "light" ? pattern1_light: pattern1_dark}
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        pointerEvents: "none",
                    }}
                />

                <Box
                    component="img"
                    src={mode === "light" ? pattern2_light: pattern2_dark}
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        pointerEvents: "none",
                        display: isLessThan1100 ? "none" : "block",
                    }}
                />

            </Grid>
        </Grid>
    )
}
export default Banner;
