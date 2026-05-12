import { useRef } from "react";
import type { Section } from "../entities/types";
import { Typography } from "@mui/material";

interface ContentProps {
  section: Section | undefined;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

const Content: React.FC<ContentProps> = ({ section, bottomRef }) => {
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
       <div ref={bottomRef} />
    </div>
  );
};
export default Content;