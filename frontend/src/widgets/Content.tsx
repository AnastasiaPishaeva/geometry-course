import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import type { Section } from "../entities/types";
import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useAuth } from "../app/providers/AuthProvider";
import api from "../api/api";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

interface ContentProps {
  section: Section | undefined;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

const Content: React.FC<ContentProps> = ({ section, bottomRef }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { user } = useAuth();
  const sectionId = Number(section?.section_id);
  const queryClient = useQueryClient();
  const {lessonId} = useParams();
  useEffect(() => {
    if (section?.title !== "Игра") return;

    const handleMessage = async (event: MessageEvent) => {
      console.log("MESSAGE:", event.data);
      if (event.data?.type !== "STARS_CHANGED") return;

      const stars = event.data.stars;

      console.log("Unity stars:", stars);

      try {
        await api.post(
          `/api/v1/users/${user?.user_id}/sections/${sectionId}/progress`,
          {
            stars_earned: stars,
          }
        );
        
        await api.post(
          `/api/v1/users/${user?.user_id}/sections/${sectionId}/status`,
          { completed: true }
        );

        console.log("Звезды сохранены");

        queryClient.invalidateQueries({
          queryKey: ["sections_progress", lessonId],
        });

        queryClient.invalidateQueries({
          queryKey: ["stars", user?.user_id],
        });

      } catch (err) {
        console.error("Ошибка сохранения звезд", err);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [user, section]);

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
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
          />
        </Box>
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