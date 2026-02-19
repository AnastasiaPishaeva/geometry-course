import { useTheme } from "@mui/material/styles";
import type { Lesson, Topic } from "../entities/types";

interface ContentProps {
  lesson: Lesson;
}

const Content: React.FC<ContentProps> = ({ lesson }) => {
  const theme = useTheme();
  return (
    <>
      <h1>
        {lesson.title}
      </h1>
      <h2> 
        Текст какой-то будет из базы данных
      </h2>
    </>
  );
};
export default Content;