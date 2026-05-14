import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import type { Section } from "../entities/types";
import { Box, Typography } from "@mui/material";
import { useRef } from "react";
import { useAuth } from "../app/providers/AuthProvider";

interface ContentProps {
  section: Section | undefined;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

const Content: React.FC<ContentProps> = ({ section, bottomRef }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { user } = useAuth();
  const sendToUnity = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const payload = {
      userId: Number(user?.user_id),
      sectionId: Number(section?.section_id),
    };

    iframe.contentWindow?.postMessage(
      { type: "INIT", payload },
      "*"
    );
  };

  if (section === undefined) return <div>В уроке еще нет секций, но должна быть хоть 1!!</div>

  if (section.title === "Игра") {
    return (
      <Box sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          {section.title}
        </Typography>

        <Box sx={{
          width: "100%",
          aspectRatio: "16 / 12",
        }}
        >
          <iframe
            ref={iframeRef}
            src="/game/index.html"
            onLoad={sendToUnity}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        </Box>

        <div ref={bottomRef} />
      </Box>
    );
  }

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