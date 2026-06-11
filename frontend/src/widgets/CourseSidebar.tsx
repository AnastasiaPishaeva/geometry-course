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
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { RequiredStars, Topic, User } from "../entities/types";
import api from "../api/api";
import { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import type { Stars } from "../entities/types";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  height: "100%",
  "& .MuiDrawer-paper": {
    width: "75vw",
    position: "relative",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": { display: "none" },
    [theme.breakpoints.up("md")]: {
      width: "auto"
    },
    "& .MuiTypography-root": {
      color: theme.palette.primaryScale[100],
    },
  }
}));

const SidebarMenu = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const stars =
    queryClient.getQueryData<Stars>(["stars", user?.user_id]) ?? {
      user_id: 0,
      total_stars: 0,
    };

  const totalStars = stars.total_stars;
  const { topicId, lessonId } = useParams();
  const activeLessonIndex = lessonId ? Number(lessonId) : null;
  const theme = useTheme();
  const [openTopics, setOpenTopics] = useState<number[]>(
    topicId ? [Number(topicId)] : []
  );

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


  const { data: requiredStarsMap } = useQuery({
    queryKey: ["requiredStars", topics],
    enabled: !!topics,
    queryFn: async () => {
      const result: Record<number, number> = {};

      const requests = topics?.flatMap(topic =>
        topic.lessons.map(async lesson => {
          const res = await api.get<RequiredStars>(
            `/api/v1/lessons/${lesson.lesson_id}/required-stars`
          );

          result[lesson.lesson_id] = res.data.required_stars;
        })
      );

      await Promise.all(requests!);

      return result;
    },
  });

  const toggleTopic = (topicId: number) => {
    setOpenTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

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
            return (
              <Accordion
                key={index}
                disableGutters
                elevation={0}
                expanded={openTopics.includes(Number(topic.topic_id))}
                onChange={() => { toggleTopic(Number(topic.topic_id)) }}
                sx={{
                  background: "none",
                  "&::before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.primaryScale[100] }} />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                  sx={{
                    padding: theme.spacing(0, 6),
                    "&:focus": {
                      outline: "none",
                    },
                  }}
                >
                  <Grid
                    container
                    alignItems="center"
                    sx={{ width: "100%" }}                 >
                    <Typography variant="h4" sx={{ color: theme.palette.primaryScale[100] }}>
                      {topic.order_number}. {topic.title}
                    </Typography>

                  </Grid>
                </AccordionSummary>

                <AccordionDetails>
                  <List>
                    {topic.lessons.map((lesson, lesIndex) => {
                      const isActive = lesson.lesson_id === activeLessonIndex;
                      if (!requiredStarsMap) {
                        return <div></div>;
                      }
                      const requiredStars =
                        requiredStarsMap?.[lesson.lesson_id];
                      console.log("ЗВЕЗДЫ НЕОБХОДИМЫЕ на уроке", lesson.lesson_id, requiredStars);
                      const isLocked =
                        totalStars < requiredStars;

                      console.log("БЛОК", isLocked);
                      return (
                        <ListItemButton
                          key={lesIndex}
                          disabled={isLocked}
                          onClick={() => {
                            {
                              navigate(`/course/${topic.topic_id}/lesson/${lesson.lesson_id}/section/1`)
                            }
                          }}
                          selected={isActive}
                          sx={{
                            justifyContent : "space-between",
                            borderRadius: theme.shape.borderRadius,
                            "&:hover": {
                              backgroundColor: theme.palette.primaryScale[800]
                            },
                            backgroundColor: "inherit",
                            "&.Mui-selected": {
                              backgroundColor: theme.palette.primaryScale[700],

                              "&:hover": {
                                backgroundColor: theme.palette.primaryScale[600],
                              },
                            },

                          }}>
                          <Typography variant="h5" > {lesson.title} </Typography>

                          {isLocked && (
                            <LockIcon
                              sx={{
                                color: theme.palette.primaryScale[700],
                                fontSize: 20,
                              }}
                            />
                          )}
                        </ListItemButton>
                      )
                    })
                    }
                  </List>
                </AccordionDetails>
              </Accordion>
            )
          })}
        </Grid>
      </StyledDrawer>
    </Grid>
  );
};

export default SidebarMenu;
