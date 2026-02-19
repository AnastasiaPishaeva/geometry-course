import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Tabs from "./Tabs";
import Content from "./Content";
import type { Lesson, Topic } from "../entities/types";


interface LessonContentProps {
  topic: Topic;
}

const LessonContent: React.FC<LessonContentProps> = ({ topic }) => {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  const activeLesson = topic.lessons[activeLessonIndex];

  return (
    <>
      <Tabs
        lessons={topic.lessons}
        onTabChange={setActiveLessonIndex}
      />

      <Content lesson={activeLesson} />
    </>
  );
};
export default LessonContent;