import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LessonContent from "../widgets/LessonContent";
import Tabs from "../widgets/Tabs";
import type { Lesson, Topic } from "../entities/types";
import SidebarMenu from "../widgets/CourseSidebar";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import menuData from "../assets/menuData.json";

const ContentPage = () => {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const { sectionId } = useParams();
  const activeTopicId = Number(sectionId);
  const activeTopic = menuData.find(t => t.id === activeTopicId);
  if (!activeTopic) return <div>Тема не найдена</div>

  return (
    <Grid container sx={{ height: "100%", overflow: "hidden" }}>
      <Grid size={{md: 3}} sx={{
        top: "1px", 
        overflowY: "auto",
        ...(!isMobile && { height: "calc(100vh - 85px)" }),
        boxShadow: 2,
      }}>
        <SidebarMenu />
      </Grid>

      {/* <Grid size={{md: 9}}
          component="main" sx={{
            flexGrow: 1,
            p: 2,
            overflowY: "auto",
            height: "calc(100vh - 65px)", 
            '&::-webkit-scrollbar': {
            display: 'none', 
          },
          }}>
          <LessonContent topic={activeTopic} />
      </Grid> */}
    </Grid>
  );
};

export default ContentPage;
