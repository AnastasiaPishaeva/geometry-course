import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import type { Section } from "../entities/types";
import { Typography } from "@mui/material";

interface ContentProps {
  section: Section | undefined;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

const Content: React.FC<ContentProps> = ({ section, bottomRef }) => {
   if (section === undefined) return <div>В уроке еще нет секций, но должна быть хоть 1!!</div>
   const fixedText = section.theory_text.replace(/\\n/g, "\n");
   return (
    <div style={{ marginBottom: "60px" }}>
      <Typography variant="h2"
        sx={{
          marginBottom: "20px"
        }}>
        {section.title}
      </Typography>

      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        components={{
          p: ({ children }) => (
            <Typography
              variant="text1"
              component="div"
              sx={{
                mb: 2,
                lineHeight: 1.9,
              }}
            >
              {children}
            </Typography>
          ),

          strong: ({ children }) => (
            <Typography
              component="span"
              fontWeight="bold"
            >
              {children}
            </Typography>
          ),
        }}
      >
        {fixedText}
      </ReactMarkdown>

      <div ref={bottomRef} />
    </div>
  );
};
export default Content;