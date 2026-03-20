import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItemButton,
  Grid,
  Drawer,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";
import {useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import type { Topic } from "../entities/types";
import api from "../api/api";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  height: "100%",
  color: theme.palette.primaryScale[900],
  "& .MuiDrawer-paper": {
    width: "75vw",
    position: "relative",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": { display: "none" },
    [theme.breakpoints.up("md")]: {
      width: "auto"
    }
  }
}));

const SidebarMenu = () => {
  const navigate = useNavigate();
  const { topicId, lessonId } = useParams();
  const activeTopicIndex = Number(topicId);
  const activeLessonIndex = lessonId ? Number(lessonId) : null;
  const theme = useTheme();

  const fetchTopics = async (): Promise<Topic[]> => {
    try {
      const res = await api.get<Topic[]>("api/v1/courses/1/topics-lessons");
      return res.data;
    } catch (error) {
      console.error("Ошибка загрузки тем", error);
      throw new Error("Ошибка загрузки тем");
  }
  };

  const { data: topics, isLoading, error } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
  });
  
  if (isLoading) return <div>Загрузка...</div>;
  if (error) {
    console.error("Ошибка при запросе тем:", error);
    return <div>Ошибка загрузки</div>;
  }

  return (
    <Grid sx={{ height: "100%", width: "100%" }}>
      <StyledDrawer
        variant={"permanent"}
      >
        <Grid sx={{ flexGrow: "1", paddingTop: "32px", }}>
        {topics?.map((topic, index) => {
          const hasLessons = topic.lessons.length > 0
          const isTopicActive = topic.topic_id === activeTopicIndex;
          if (hasLessons){
            return (
            <Accordion 
                key={index}
                disableGutters
                elevation={0}
                expanded={isTopicActive}
                sx={{
                  background: "none", 
                  "&::before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                  sx={{padding: theme.spacing(0, 6),
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                >
                  <Typography variant="h4" sx={{color: theme.palette.primaryScale[100] }}>
                    {topic.order_number}. {topic.title}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <List>
                    {topic.lessons.map((lesson, lesIndex) => {
                          const isActive = lesson.lesson_id === activeLessonIndex;
                          return (
                          <ListItemButton 
                          key={lesIndex}
                          onClick={() => {navigate(`/course/${topic.topic_id}/lesson/${lesson.lesson_id}/section/1`)}}
                          selected={isActive}
                          sx={{
                            borderRadius: theme.shape.borderRadius,
                            "&:hover": {
                              backgroundColor: theme.palette.primaryScale[800]
                            },
                            backgroundColor: "inherit",
                            "&.Mui-selected": {backgroundColor: theme.palette.primaryScale[700]},
                          }}>
                            <Typography variant="h5"> {lesson.title} </Typography>
                          </ListItemButton>
                    )})
                    }
                  </List>
                </AccordionDetails>
              </Accordion>
          )}
          else {
            return (
              <ListItemButton
                key={index}
                onClick={() => navigate(`/course/${topic.topic_id}`)}
                selected={isTopicActive}
                sx={{
                  borderRadius: theme.shape.borderRadius,
                  padding: theme.spacing(3, 6),
                  "&:hover": {
                    backgroundColor: theme.palette.primaryScale[800]
                  },
                  "&.Mui-selected, &.Mui-selected:hover": {backgroundColor: theme.palette.primaryScale[700]},
                }}
              >
                <Typography variant="h4" >
                  {topic.order_number}. {topic.title}
                </Typography>
              </ListItemButton>
            )
          }
        })}
        </Grid>
      </StyledDrawer>
    </Grid>
  );
};

export default SidebarMenu;
