import { useTheme } from "@mui/material/styles";
import type { Lesson, Topic, Section } from "../entities/types";
import { Typography } from "@mui/material";

interface ContentProps {
  section: Section | undefined;
}

const Content: React.FC<ContentProps> = ({ section }) => {
  if (section === undefined) return <div>В уроке еще нет секций, но должна быть хоть 1!!</div>
  return (
    <>
      <Typography variant="h2">
        {section.title}
      </Typography>
      <Typography variant="text1"> 
        {section.theory_text}
      </Typography>
    </>
  );
};
export default Content;