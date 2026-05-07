import * as React from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Link
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthProvider';
import api from "../api/api";

const Background = styled(Box)({
    width: "99vw",
    backgroundColor: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
});
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
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        backgroundColor: theme.palette.primaryScale[1000],
        "& fieldset": {
            borderColor: "#E4E4E8"
        },
        "&:hover fieldset": {
            borderColor: theme.palette.primaryScale[700]
        },
        "&.Mui-focused fieldset": {
            borderColor: theme.palette.primaryScale[700]
        }
    }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    width: "100%",
    height: "48px",
    background: theme.palette.primaryScale[400],
    borderRadius: "10px",
    fontSize: "16px",
    color: "#FFFFFF",
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

    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await api.post('api/v1/auth/login', {
                email,
                password
            });

            const data = res.data;

            setUser(data.user);  // обновляем контекст
            navigate("/course/1/lesson/1/section/1");
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
                <SubmitButton disabled={!email || !password} onClick={handleLogin} sx={{ marginBottom: "10px" }}>Войти</SubmitButton>
                <Typography variant="text1" sx={{ textAlign: "center", color: theme.palette.primaryScale[100], }}>
                    У вас еще нет аккаунта?{" "}
                    <Link
                        sx={{
                            color: theme.palette.primaryScale[300],
                            fontWeight: "500",
                            "&:hover": { color: theme.palette.primaryScale[300] }
                        }} href="/registration" underline="hover">
                        Зарегистрируйтесь сейчас
                    </Link>
                </Typography>
            </LoginContainer>
        </Background>
    );
};

export default LoginPage;
