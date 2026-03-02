import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItemButton,
  Grid,
  useMediaQuery,
  Drawer,
  IconButton
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
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
  const { sectionId, lessonId } = useParams();
  const activeSectionId = Number(sectionId);
  const activeLessonIndex = lessonId ? Number(lessonId) : null;
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");

  const toggleDrawer = (open: boolean) => {
    setOpen(open);
  };
  const [openSections, setOpenSections] = useState<number[]>([]);

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

  const toggleSection = (topicId: number) => {
    setOpenSections(prev =>
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
      {isMobile && (
        <IconButton
          onClick={() => toggleDrawer(true)}
          sx={{ position: "fixed", top: 16, left: 16, zIndex: 2 }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <StyledDrawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={() => toggleDrawer(false)}
      >
        <Grid sx={{ flexGrow: "1", paddingTop: "32px", }}>
        {topics?.map((section, index) => {
          const hasLessons = section.lessons.length > 0
          const isSectionActive = section.topic_id === activeSectionId;
          // console.log(topics)
          if (hasLessons){
            return (
            <Accordion 
                key={index}
                disableGutters
                elevation={0}
                expanded={openSections.includes(section.topic_id)}
                onChange={() => toggleSection(section.topic_id)}
                sx={{
                  background: "none", 
                  "&::before": { display: "none" }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography variant="h4" sx={{color: theme.palette.primaryScale[100] }}>
                    {section.title}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <List>
                    {section.lessons.map((lesson, lesIndex) => {
                          const isActive = isSectionActive && index === activeLessonIndex;

                          return (
                          <ListItemButton 
                          key={lesIndex}
                          onClick={() => {navigate(`/course/${section.topic_id}/lesson/${lesIndex}`)}}
                          selected={isActive}
                          sx={{
                            borderRadius: theme.shape.borderRadius,
                            "&:hover": {
                              backgroundColor: `rgba(${theme.palette.primaryScale[700]}, 0.85)`
                            },
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
                onClick={() => navigate(`/course/${section.topic_id}`)}
                selected={isSectionActive}
                sx={{
                  borderRadius: theme.shape.borderRadius,
                }}
              >
                <Typography variant="h4" >
                  {section.title}
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
