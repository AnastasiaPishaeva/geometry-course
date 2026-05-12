import React from "react";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import type { Section } from "../entities/types";
import { Box, Button, Typography } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface ButtonProps {
    sections: Section[];
}

const ButtonToMove: React.FC<ButtonProps> = ({ sections }) => {
    const { topicId, lessonId, sectionId } = useParams();
    const navigate = useNavigate();

    const ButtonToMove = styled(Button)(({ theme }) => ({
        background: theme.palette.primaryScale[500],
        color: "white",
        borderRadius: "30px",
        width: "185px",
        padding: theme.spacing(3, 3),
        "&:focus": {
            outline: "none",
        },
        "&:disabled": {
            background: theme.palette.primaryScale[700],
            color: "white"
        }
    }));
    return (
        <Box sx={{
            marginBottom: "60px",
            display: "flex"
        }}>
            <Box sx={{ flexGrow: 1 }}>
                <ButtonToMove
                    disabled={sectionId === "1"}
                    onClick={() => { navigate(`/course/${topicId}/lesson/${lessonId}/section/${Number(sectionId) - 1}`) }}>
                    <ChevronLeftIcon sx={{position: "absolute", left: 10}}/>
                    <Typography variant="text1" >
                        Назад
                    </Typography>
                </ButtonToMove>
            </Box>
            <Box>
                <ButtonToMove disabled={Number(sectionId) === sections.length}
                    onClick={() => { navigate(`/course/${topicId}/lesson/${lessonId}/section/${Number(sectionId) + 1}`) }}>
                    <Typography variant="text1">
                        Вперед
                    </Typography>
                    <ChevronRightIcon sx={{position: "absolute", right: 10}}/>
                </ButtonToMove>
            </Box>
        </Box>
    );
};

export default ButtonToMove;
