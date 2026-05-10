import type { Section } from "../entities/types";
import { Typography } from "@mui/material";

interface ContentProps {
  section: Section | undefined;
}

const Content: React.FC<ContentProps> = ({ section }) => {
  if (section === undefined) return <div>В уроке еще нет секций, но должна быть хоть 1!!</div>
  return (
    <div style={{marginBottom: "60px"}}>
      <Typography variant="h2" 
      sx = {{
        marginBottom: "20px"
      }}>
        {section.title}
      </Typography>
      <Typography variant="text1"
        sx={{
          whiteSpace: "pre-line",
        }}>
        {section.theory_text}
      </Typography>
    </div>
  );
};
export default Content;