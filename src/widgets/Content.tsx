import { useTheme } from "@mui/material/styles";
import type { Lesson, Topic } from "../entities/types";
import { Typography } from "@mui/material";

interface ContentProps {
  lesson: Lesson;
}

const Content: React.FC<ContentProps> = ({ lesson }) => {
  const theme = useTheme();
  return (
    <>
      <Typography variant="h2">
        {lesson.title}
      </Typography>
      <Typography variant="text1"> 
        Текст какой-то будет из базы данных
      </Typography>
    </>
  );
};
export default Content;