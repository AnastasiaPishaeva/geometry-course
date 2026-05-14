import {Collapse, Grid, IconButton, Typography} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useState} from "react";

type QuestionItemProps = {
    name: string;
    description: string;
};
const QuestionItem = ({name, description}:QuestionItemProps)=> {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);
    return (
        <Grid sx={{mb: "16px", width: "100%", position: "relative"}}>
            <Grid
                sx={{
                    width: "100%",
                    borderRadius: expanded ? "20px 20px 0 0" : "20px",
                    border: `1px solid ${theme.palette.primaryScale[500]}`,
                    backgroundColor: "#ffff",
                    height: "62px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        color: theme.palette.primaryScale[100],
                        ml: "16px",
                    }}
                >
                    {name}
                </Typography>
                <IconButton
                    onClick={() => setExpanded(!expanded)}
                    sx={{
                        mr: "16px",
                        outline: 'none',
                        '&:focus': {
                            outline: 'none',
                        },
                        '&:focus-visible': {
                            outline: 'none',
                        },
                        marginLeft: "auto",
                    }}
                    disableRipple
                >
                    {expanded ? (
                        <img src="/src/assets/HomePage/minus_button.svg" alt="minus" />
                    ) : (
                        <img src="/src/assets/HomePage/plus_button.svg" alt="plus" />
                    )}
                </IconButton>
                </Grid>
                <Collapse in={expanded} timeout={300}>
                    <Grid
                        sx={{
                            border: `1px solid ${theme.palette.primaryScale[500]}`,
                            borderTop: 'none',
                            borderRadius: "0 0 20px 20px",
                            padding: "16px",
                            backgroundColor: theme.palette.primaryScale[1000],


                        }}
                    >
                        <Typography variant="text1" sx={{ color: theme.palette.primaryScale[100] }}>
                            {description}
                        </Typography>
                    </Grid>
                </Collapse>
        </Grid>
    );
}
export default QuestionItem
