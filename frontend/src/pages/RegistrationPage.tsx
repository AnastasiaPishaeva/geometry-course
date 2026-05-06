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
import { Grid, styled, useTheme } from "@mui/system";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthProvider';
import api from "../api/api";
import { motion, AnimatePresence } from "framer-motion";

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

const RegistrationPage = () => {
    const theme = useTheme();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [step, setStep] = React.useState(1);
    const [direction, setDirection] = React.useState(1);

    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const res = await api.post("api/v1/auth/register", {
                email,
                password,
                first_name: firstName,
                last_name: lastName,
            });

            navigate("/authorization");
        } catch (err) {
            console.error(err);
            alert("Ошибка регистрации");
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const variants = {
        initial: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        animate: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
        }),
    };

    const handleNext = () => {
        setDirection(1);
        setStep(2);
    };

    const handleBack = () => {
        setDirection(-1);
        setStep(1);
    };


    return (
        <Background>
            <LoginContainer>
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={step}
                        custom={direction}
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                    >
                        {step === 1 && (
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}>
                                <Typography variant="h2"
                                    sx={{
                                        color: theme.palette.primaryScale[100],
                                        justifyСontent: "flex-start",
                                        marginBottom: "15px"
                                    }}>Регистрация</Typography>

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
                                        onChange={(e) => setEmail(e.target.value)} />
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
                                        onChange={(e) => setPassword(e.target.value)}
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
                                <SubmitButton
                                    disabled={!email || !password}
                                    onClick={handleNext}
                                    sx={{ marginBottom: "10px" }}
                                >
                                    Далее
                                </SubmitButton>
                                <Typography variant="text1" sx={{ textAlign: "center", color: theme.palette.primaryScale[100], }}>
                                    У вас уже есть аккаунт?{" "}
                                    <Link
                                        sx={{
                                            color: theme.palette.primaryScale[300],
                                            fontWeight: "500",
                                            "&:hover": { color: theme.palette.primaryScale[300] }
                                        }} href="/authorization" underline="hover">
                                        Войти
                                    </Link>
                                </Typography>
                            </Box>
                        )}

                        {step === 2 && (
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}>
                                <Typography variant="h2"
                                    sx={{
                                        color: theme.palette.primaryScale[100],
                                        justifyСontent: "flex-start"
                                    }}>Здравствуйте!</Typography>

                                <Typography variant="text2"
                                    sx={{
                                        color: theme.palette.primaryScale[100],
                                        justifyСontent: "flex-start",
                                        marginBottom: "24px"
                                    }}>Давайте знакомиться! Введите ваше имя и фамилию:</Typography>

                                <div style={{ marginBottom: "34px" }}>
                                    <Typography variant="text2"
                                        sx={{
                                            color: theme.palette.primaryScale[100],
                                            justifyСontent: "flex-start",
                                            marginBottom: "6px"
                                        }}>Имя</Typography>

                                    <StyledTextField
                                        placeholder="Имя"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        variant="outlined" />
                                </div>
                                <div style={{ marginBottom: "50px" }}>
                                    <Typography variant="text2"
                                        sx={{
                                            color: theme.palette.primaryScale[100],
                                            justifyСontent: "flex-start",
                                            marginBottom: "6px"
                                        }}>Фамилия</Typography>

                                    <StyledTextField
                                        placeholder="Фамилия"
                                        variant="outlined"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                                <SubmitButton
                                    disabled={!firstName || !lastName}
                                    onClick={handleRegister}
                                    sx={{ marginBottom: "10px" }}
                                >
                                    Зарегистрироваться
                                </SubmitButton>
                            </Box>

                        )}
                    </motion.div>
                </AnimatePresence>

                <Box display="flex" justifyContent="center" mt={3} gap={1}>
                    {[1, 2].map((s) => (
                        <Box
                            key={s}
                            width={8}
                            height={8}
                            borderRadius="50%"
                            sx={{
                                backgroundColor:
                                    step === s
                                        ? theme.palette.primaryScale[400]
                                        : "#ccc",
                                transition: "0.3s",
                            }}
                        />
                    ))}
                </Box>
            </LoginContainer>
        </Background>
    );
};

export default RegistrationPage;
