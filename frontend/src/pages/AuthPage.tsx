import * as React from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from 'react-router-dom';
import api from "../api/api";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

const Background = styled(Box)(({ theme }) => ({
    width: "99vw",
    backgroundColor: theme.palette.primaryScale[1000],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
}));
const LoginContainer = styled(Box)(({ theme }) => ({
    width: "600px",
    background: theme.palette.primaryScale[900],
    borderRadius: "16px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    padding: theme.spacing(10, 20),
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(10, 0)
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: "100%",
    "& .MuiInputBase-input": {
        color: theme.palette.background.text},
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        backgroundColor: theme.palette.background.textfield,
        "& fieldset": {
            borderColor: theme.palette.primaryScale[1000]
        },
        "&:hover fieldset": {
            borderColor: theme.palette.primaryScale[1000]
        },
        "&.Mui-focused fieldset": {
            borderColor: theme.palette.primaryScale[1000]
        }
    }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    width: "100%",
    height: "48px",
    background: theme.palette.primaryScale[400],
    borderRadius: "10px",
    fontSize: "16px",
    color: theme.palette.primaryScale[400],
    textTransform: "none",
    "&:hover": {
        background: theme.palette.primaryScale[400],
        opacity: 0.9
    },
    "&:focus": {
        outline: "none",
    },
    "&:disabled": {
        background: theme.palette.primaryScale[700],
        color: "white"
    }
}));

const LoginPage = () => {
    const theme = useTheme();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [authErr, setAuthErr] = React.useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await api.post('api/v1/auth/login', {
                email,
                password
            });

            console.log("LOGIN RESPONSE", res.data);
            navigate("/course/1/lesson/4/section/1");
        } catch (err) {
            console.error("Ошибка при входе:", err);
            setAuthErr(true);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };


    return (
        <Background>
            <LoginContainer>
                <Typography variant="h2"
                    sx={{
                        color: theme.palette.primaryScale[100],
                        justifyСontent: "flex-start",
                        marginBottom: "15px"
                    }}>Вход</Typography>
                <div style={{ marginBottom: "34px" }}>
                    <Typography variant="text2"
                        sx={{
                            color: theme.palette.primaryScale[100],
                            justifyСontent: "flex-start",
                            marginBottom: "6px"
                        }}>Email</Typography>

                    <StyledTextField
                        placeholder="Email"
                        variant="outlined"
                        value={email}
                        error={authErr}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setAuthErr(false);
                        }} />
                </div>
                <div style={{ marginBottom: "50px" }}>
                    <Typography variant="text2"
                        sx={{
                            color: theme.palette.primaryScale[100],
                            justifyСontent: "flex-start",
                            marginBottom: "6px"
                        }}>Password</Typography>

                    <StyledTextField
                        placeholder="Password"
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setAuthErr(false);
                        }}
                        error={authErr}
                        helperText={
                            authErr
                                ? "Неверный логин или пароль"
                                : ""
                        }
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        sx={{
                                            color: theme.palette.primaryScale[400],
                                            "&:hover": {
                                                backgroundColor: "transparent",
                                            },
                                            "&:focus": {
                                                outline: "none",
                                            },
                                        }} onClick={handleTogglePassword} edge="end" >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <SubmitButton disabled={!email || !password} onClick={handleLogin} sx={{ marginBottom: "10px" }}>
                    <Typography variant="text1" sx={{ textAlign: "center", color: "white"}}> Войти </Typography>
                </SubmitButton>
                <Typography variant="text1" sx={{ textAlign: "center", color: theme.palette.primaryScale[100], }}>
                    У вас еще нет аккаунта?{" "}
                    <Link component={RouterLink}
                        sx={{
                            color: theme.palette.primaryScale[300],
                            fontWeight: "500",
                            "&:hover": { color: theme.palette.primaryScale[300] }
                        }} to="/registration" underline="hover">
                        Зарегистрируйтесь сейчас
                    </Link>
                </Typography>
            </LoginContainer>
        </Background>
    );
};

export default LoginPage;
