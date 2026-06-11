import React from "react";
import { useTheme } from "@mui/material/styles";
import api from "../api/api";
import TheoryUnfinishedButton from "../assets/Tabs/TheoryUnfinished.png";
import TheoryFinishedButton from "../assets/Tabs/TheoryFinished.png";
import GameUnfinishedButton from "../assets/Tabs/GameUnfinished.png";
import GameFinishedButton from "../assets/Tabs/GameFinished.png";
import { useNavigate, useParams } from "react-router-dom";

import type { SectionProgressInfo, User } from "../entities/types";
import { useQuery } from "@tanstack/react-query";

interface TabsProps {
  lesson: number;
  activeSection: number;
}

const images = {
  theory: {
    unfinished: TheoryUnfinishedButton,
    finished: TheoryFinishedButton,
  },
  game: {
    unfinished: GameUnfinishedButton,
    finished: GameFinishedButton,
  },
};

const Tabs: React.FC<TabsProps> = ({ lesson, activeSection }) => {
  const theme = useTheme();
  const { topicId, lessonId } = useParams();
  const navigate = useNavigate();
  const fetchSectionProgress = async (): Promise<SectionProgressInfo[]> => {
    try {
      const res = await api.get<SectionProgressInfo[]>(`api/v1/users/${user?.user_id}/lessons/${lesson}/sections-status`);
      return res.data;
    } catch (error) {
      throw new Error("Ошибка загрузки прогресса по секциям");
    }
  };
  
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

  const { data: progress, isLoading, error } = useQuery({
    queryKey: ["sections_progress", lesson],
    queryFn: fetchSectionProgress,
  });

  if (isLoading) return <div></div>;
  if (!progress) return <div>Ошибка загрузки прогресса по секциям</div>;
  if (error) return <div>Ошибка загрузки прогресса по секциям..</div>

  return (
    <div
      style={{
        display: "flex",
        gap: theme.spacing(2),
        marginBottom: theme.spacing(4),
        height: "45px",
        width: "auto",
        marginLeft: "auto",
        alignItems: "center"
      }}
    >
      {progress.map((section) => {
        const type = section.type;
        const imageSrc =
          images[type][section.completed ? "finished" : "unfinished"];

        return (
          <img
            key={section.section_id}
            src={imageSrc}
            alt={section.title}
            onClick={() => { navigate(`/course/${topicId}/lesson/${lessonId}/section/${section.order_number}`) }}
            style={{ cursor: "pointer",  height: Number(section.order_number) === activeSection ? "100%" : "80%"}}
          />
        );
      })}
    </div>
  );
};

export default Tabs;
