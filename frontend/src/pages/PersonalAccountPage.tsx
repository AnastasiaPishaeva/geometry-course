import {
    Button,
    Typography,
    Box,
    TextField,
} from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { styled } from '@mui/system';
import api from "../api/api";
import { useAuth } from '../app/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

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

const PersonalAccount = () => {
    const theme = useTheme();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
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
            setUser({
                ...user!,
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
        setUser(null);
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
        }}>
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
                    sx={{ marginBottom: "26px", }}
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
                    sx={{ marginBottom: "26px" }}
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
                    sx={{ marginBottom: "32px" }}
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