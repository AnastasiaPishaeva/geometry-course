import {
    Button,
    Typography,
    Box,
    TextField,
    IconButton,
} from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import { styled } from '@mui/system';
import api from "../api/api";
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from "../app/providers/ThemeProvider";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import type { User } from '../entities/types';
import { useQuery } from '@tanstack/react-query';

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: "100%",
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        backgroundColor: theme.palette.background.textfield,
        "& fieldset": {
            borderColor: theme.palette.primaryScale[800]
        },
        "&:hover fieldset": {
            borderColor: theme.palette.primaryScale[700]
        },
        "&.Mui-focused fieldset": {
            borderColor: theme.palette.primaryScale[700]
        }
    }
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
}));


const PersonalAccount = () => {
    const theme = useTheme();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { mode, toggleTheme } = useContext(ThemeContext);

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

    const saveButtonDisabled = !firstName ||
        !lastName || !email || firstName === user?.first_name &&
        lastName === user.last_name && email === user.email;

    const handleSave = async () => {
        try {
            await api.put(`/api/v1/users/${user?.user_id}`, {
                first_name: firstName,
                last_name: lastName,
                email,
            });
        } catch (err) {
            console.error("Ошибка при сохранении:", err);
            alert("Ошибка при сохранении данных");
        }
    };

    const exit = () => {
        navigate("/geomGame");
    }

    const StyledButton = styled(Button)(({ theme }) => ({
        background: theme.palette.primaryScale[400],
        width: "100%",
        color: "white",
        borderRadius: "30px",
        "&:disabled": {
            background: theme.palette.primaryScale[700],
            color: "white"
        }
    }))

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setEmail(user.email);
        }
    }, [user]);

    return (
        <Box sx={{
            width: '99vw',
            padding: theme.spacing(11, 30),
            overflow: 'auto',
            background: theme.palette.background.default,
            textAlign: "center",
            flexDirection: "column",
            display: "flex",
        }}>
            <Box sx={{ width: "100%", display: "flex" }}>
                <ThemeButton onClick={toggleTheme} sx={{ marginLeft: "auto" }}>
                    {mode === "dark" ?
                        <LightModeIcon sx={{ color: theme.palette.primaryScale[200] }} /> :
                        <DarkModeIcon sx={{ color: theme.palette.primaryScale[300] }} />}
                </ThemeButton>
            </Box>
            <Typography variant="h2" sx={{
                color: theme.palette.primaryScale[200],
                marginBottom: "30px"
            }}>
                Личный кабинет
            </Typography>

            <Box sx={{
                width: "50%",
                margin: "0 auto",
                textAlign: "left"
            }}>
                <Typography variant="text2"
                    sx={{
                        color: theme.palette.primaryScale[100],
                        marginBottom: "6px",
                    }}>Имя</Typography>

                <StyledTextField
                    placeholder="Имя"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    variant="outlined"
                    fullWidth
                    sx={{
                        marginBottom: "26px",
                        "& .MuiInputBase-input": {
                            color: theme.palette.background.text
                        },
                    }}
                />

                <Typography variant="text2"
                    sx={{
                        color: theme.palette.primaryScale[100],
                        marginBottom: "6px",
                    }}>Фамилия</Typography>

                <StyledTextField
                    placeholder="Фамилия"
                    variant="outlined"
                    fullWidth
                    value={lastName}
                    sx={{
                        marginBottom: "26px",
                        "& .MuiInputBase-input": {
                            color: theme.palette.background.text
                        }
                    }}
                    onChange={(e) => setLastName(e.target.value)}
                />

                <Typography variant="text2"
                    sx={{
                        color: theme.palette.primaryScale[100],
                        marginBottom: "6px",
                    }}>Email</Typography>

                <StyledTextField
                    placeholder="Email"
                    variant="outlined"
                    fullWidth
                    value={email}

                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                        marginBottom: "32px",
                        "& .MuiInputBase-input": {
                            color: theme.palette.background.text
                        }
                    }}
                />
                <StyledButton onClick={handleSave}
                    disabled={saveButtonDisabled}
                    sx={{
                        boxShadow: 3,
                        outline: "none",
                        "&:focus": {
                            outline: "none",
                        },
                        "&.Mui-focusVisible": {
                            outline: "none",
                        },
                        marginBottom: "16px"
                    }} >
                    Сохранить изменения
                </StyledButton>

                <StyledButton onClick={exit} sx={{
                    boxShadow: 3,
                    outline: "none",
                    "&:focus": {
                        outline: "none",
                    },
                    "&.Mui-focusVisible": {
                        outline: "none",
                    },
                }} >
                    Выйти
                </StyledButton>
            </Box >
        </Box >
    )
};

export default PersonalAccount; 