import { useParams } from "react-router-dom";
import LessonContent from "../widgets/LessonContent";
import type { Section } from "../entities/types";
import SidebarMenu from "../widgets/CourseSidebar";
import { Grid, } from "@mui/material";
import api from "../api/api";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../app/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

const ContentPage = () => {
  const theme = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { lessonId, sectionId } = useParams();
  const [completed, setCompleted] = useState(false);
  const queryClient = useQueryClient();
  const completedRef = useRef(false);

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
    queryKey: ["sections", lessonId], //секции конкретного урока
    queryFn: fetchSection,
    enabled: !!user?.user_id,
  });

  const activeSectionId = sections?.find(t => t.order_number === Number(sectionId))?.section_id;
  console.log(activeSectionId);

  useEffect(() => {
    contentRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [sectionId]);

  useEffect(() => {
    const container = contentRef.current;
    const target = bottomRef.current;

    if (!container || !target) return;

    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        try {
          await api.post(
            `/api/v1/users/${user?.user_id}/sections/${activeSectionId}/progress`,
            { stars_earned: 1 }
          );

          await api.post(
            `/api/v1/users/${user?.user_id}/sections/${activeSectionId}/status`,
            { completed: true }
          );

          console.log("Секция завершена");

          queryClient.invalidateQueries({
            queryKey: ["sections_progress", lessonId],
          });

        } catch (err) {
          console.error("Ошибка обновления прогресса", err);
        }
      }
    }, {
      root: container,
      threshold: 0.8,
    });

    observer.observe(target);

    return () => observer.disconnect();
  }, [sectionId, activeSectionId]);

  if (!sections) return <div>Нет информации...</div>;
  if (isLoading) return <div>Загрузка...</div>;
  if (error) {
    console.error("Ошибка при запросе секций:", error);
    return <div>Ошибка загрузки</div>;
  }

  return (
    <Grid container sx={{ height: "100%", overflow: "hidden" }}>
      <Grid size={{ xs: 3 }} sx={{
        top: "1px",
        overflowY: "auto",
        height: "calc(100vh - 85px)",
        boxShadow: 2,
      }}>
        <SidebarMenu />
      </Grid>

      <Grid ref={contentRef} size={{ xs: 9 }}
        component="main" sx={{
          flexGrow: 1,
          padding: theme.spacing(4, 32),
          overflowY: "auto",
          height: "calc(100vh - 85px)",
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}>
        <LessonContent sections={sections} bottomRef={bottomRef} />
      </Grid>
    </Grid>
  );
};

export default ContentPage;

