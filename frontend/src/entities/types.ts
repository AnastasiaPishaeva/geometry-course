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