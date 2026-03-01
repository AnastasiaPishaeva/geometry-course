import { useState } from "react";
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
import menuData from "../assets/menuData.json"

const Content = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
  paddingLeft: theme.spacing(2),
  paddingTop: theme.spacing(2)
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  height: "100%",
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
  const [openSection, setOpenSection] = useState<boolean[]>(
    menuData.map(() => false)
  );

  const toggleSection = (index: number) => {
    setOpenSection((prevState) =>
      prevState.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  // useEffect(() => {
  //   if (!sectionId) return;

  //   const index = menuData.findIndex(
  //     (section) => section.id === Number(sectionId)
  //   );

  //   if (index !== -1) {
  //     setOpenSection(prev =>
  //       prev.map((_, i) => i === index)
  //     );
  //   }
  // }, [sectionId]);

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
        <Content variant = "h4">СОДЕРЖАНИЕ</Content>
        <Grid sx={{ flexGrow: "1" }}>
        {menuData.map((section, index) => {
          const hasLessons = section.lessons && section.lessons.length > 0
          const isSectionActive = section.id === activeSectionId;

          if (hasLessons){
            return (
            <Accordion 
                key={index}
                disableGutters
                elevation={0}
                expanded={isSectionActive}
                onChange={() => toggleSection(index)}
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
                  <Typography sx={{color: theme.palette.primaryScale[100] }}>
                    {section.title}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <List>
                    {section.lessons!.map((lesson, lesIndex) => {
                          const isActive = isSectionActive && index === activeLessonIndex;

                          return (
                          <ListItemButton 
                          key={lesIndex}
                          onClick={() => {navigate(`/course/${section.id}/lesson/${lesIndex}`)}}
                          selected={isActive}
                          sx={{
                            borderRadius: theme.shape.borderRadius,
                            "&:hover": {
                              backgroundColor: `rgba(${theme.palette.primaryScale[700]}, 0.85)`
                            },
                          }}>
                            <Typography> {lesson} </Typography>
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
                onClick={() => navigate(`/course/${section.id}`)}
                selected={isSectionActive}
                sx={{
                  borderRadius: theme.shape.borderRadius,
                }}
              >
                <Typography>
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
