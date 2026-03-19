import React from "react";
import { useTheme } from "@mui/material/styles";

import TheoryUnfinishedButton from "../assets/Tabs/TheoryUnfinished.png";
import TheoryFinishedButton from "../assets/Tabs/TheoryFinished.png";
import GameUnfinishedButton from "../assets/Tabs/GameUnfinished.png";
import GameFinishedButton from "../assets/Tabs/GameUnfinished.png";

import type { Lesson } from "../entities/types";

interface TabsProps {
  lessons: Lesson[];
  onTabChange: (index: number) => void;
}

const images = {
  theory: {
    unfinished: TheoryUnfinishedButton,
    finished: TheoryFinishedButton,
  },
  game: {
    unfinished: GameUnfinishedButton,
    finished: GameFinishedButton,
  },
};

const Tabs: React.FC<TabsProps> = ({ lessons, onTabChange }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: theme.spacing(2),
        marginBottom: theme.spacing(4),
      }}
    >
      {lessons.map((lesson, index) => {
        const isLast = index === lessons.length - 1;
        const type = isLast ? "game" : "theory";

        const imageSrc =
          images[type][lesson.isCompleted ? "finished" : "unfinished"];

        return (
          <img
            key={lesson.id}
            src={imageSrc}
            alt={lesson.title}
            onClick={() => onTabChange(index)}
            style={{ cursor: "pointer" }}
          />
        );
      })}
    </div>
  );
};

export default Tabs;
