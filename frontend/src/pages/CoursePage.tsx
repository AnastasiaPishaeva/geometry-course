import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import LessonContent from "../widgets/LessonContent";
import Tabs from "../widgets/Tabs";
import type { Lesson, Topic, Section } from "../entities/types";
import SidebarMenu from "../widgets/CourseSidebar";
import { Grid, } from "@mui/material";
import api from "../api/api";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@mui/material/styles";

const ContentPage = () => {
  const theme = useTheme();
  const { lessonId } = useParams();
  if (!lessonId) {
    return <div>Тема не найдена</div>
  }

  const fetchSection = async (): Promise<Section[]> => {
    try {
      const res = await api.get<Section[]>(`api/v1/lessons/${lessonId}/sections`);
      return res.data;
    } catch (error) {
      console.error("Ошибка загрузки секций", error);
      throw new Error("Ошибка загрузки тем");
  }
  };

  const { data: sections, isLoading, error } = useQuery({
    queryKey: ["sections", lessonId],
    queryFn: fetchSection,
  });
  if (!sections) return <div>Нет информации...</div>;
  if (isLoading) return <div>Загрузка...</div>;
  if (error) {
    console.error("Ошибка при запросе секций:", error);
    return <div>Ошибка загрузки</div>;
  }

  return (
    <Grid container sx={{ height: "100%", overflow: "hidden" }}>
      <Grid size={{xs: 3}} sx={{
        top: "1px", 
        overflowY: "auto",
        height: "calc(100vh - 85px)",
        boxShadow: 2,
      }}>
        <SidebarMenu />
      </Grid>

      <Grid size={{xs: 9}}
          component="main" sx={{
            flexGrow: 1,
            padding: theme.spacing(4, 32),
            overflowY: "auto",
            height: "calc(100vh - 85px)", 
            '&::-webkit-scrollbar': {
            display: 'none', 
          },
          }}>
          <LessonContent sections = {sections} />
      </Grid>
    </Grid>
  );
};

export default ContentPage;
