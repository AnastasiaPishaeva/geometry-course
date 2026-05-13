import Tabs from "./Tabs";
import Content from "./Content";
import type { Section } from "../entities/types";
import { useParams } from "react-router-dom";
import ButtonToMove from "../widgets/ButtonToMove"

interface LessonContentProps {
  sections: Section[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

const LessonContent: React.FC<LessonContentProps> = ({ sections, bottomRef }) => {
  const { sectionId, lessonId } = useParams();
  if (!sectionId) return <div>Не выбрана секция...</div>;
  if (!lessonId) return <div>Не выбран урок...</div>

  const activeSection = sections.find(t => t.order_number === Number(sectionId));

  return (
    <>
      <Tabs
        lesson={Number(lessonId)} activeSection={Number(activeSection?.order_number)}
      />
      <Content section={activeSection} bottomRef={bottomRef}/>
      {sections.length > 1 && (
        <ButtonToMove sections={sections} />
      )}
    </>
  );
};
export default LessonContent;