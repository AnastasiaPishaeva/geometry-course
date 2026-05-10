import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import Tabs from "./Tabs";
import Content from "./Content";
import type { Lesson, Topic, Section } from "../entities/types";
import { useParams } from "react-router-dom";
import ButtonToMove from "../widgets/ButtonToMove"

interface LessonContentProps {
  sections: Section[];
}

const LessonContent: React.FC<LessonContentProps> = ({ sections }) => {
  const { sectionId, lessonId } = useParams();
  if (!sectionId) return <div>Не выбрана секция...</div>;
  if (!lessonId) return <div>Не выбран урок...</div>

  const activeSection = sections.find(t => t.order_number === Number(sectionId));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [sectionId]);
  return (
    <>
      <Tabs
        lesson={Number(lessonId)}
      />
      <Content section={activeSection} />
      {sections.length > 1 && (
        <ButtonToMove sections={sections} />
      )}
    </>
  );
};
export default LessonContent;