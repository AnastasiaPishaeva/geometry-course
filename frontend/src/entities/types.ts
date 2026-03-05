export type Lesson = {
  lesson_id: number;
  title: string;
  order_number: number;
};

export type Topic = {
  topic_id: number;
  title: string;
  order_number: number;
  lessons: Lesson[];
};

export type Section = {
  section_id: number;
  title: string;
  order_number: number;
  theory_text: string;
};

export type SectionProgressInfo = {
  section_id: number;
  title: string;
  completed: boolean;
}