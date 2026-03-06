import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Tabs from "./Tabs";
import Content from "./Content";
import type { Lesson, Topic, Section} from "../entities/types";
import { useParams } from "react-router-dom";


interface LessonContentProps {
  sections: Section[];
}

const LessonContent: React.FC<LessonContentProps> = ({ sections }) => {
  const {sectionId, lessonId} = useParams();
  if (!sectionId) return <div>Не выбрана секция...</div>;
  if (!lessonId) return <div>Не выбран урок...</div>

  const activeSection = sections.find(t => t.order_number === Number(sectionId));

  return (
    <>
      <Tabs
        lesson={Number(lessonId)}
      />
      <Content section={activeSection} />
    </>
  );
};
export default LessonContent;