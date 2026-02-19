import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Tabs from "./Tabs";
import Content from "./Content";
import type { Lesson, Topic } from "../entities/types";


interface LessonContentProps {
  topic: Topic;
}

const LessonContent: React.FC<LessonContentProps> = ({ topic }) => {
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);

  const activeLesson = topic.lessons[activeTopicIndex];

  return (
    <>
      <Tabs
        lessons={topic.lessons}
        onTabChange={setActiveTopicIndex}
      />

      <Content lesson={activeLesson} />
    </>
  );
};
