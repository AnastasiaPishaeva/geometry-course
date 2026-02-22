export type Lesson = {
  id: number;
  title: string;
  isCompleted: boolean;
};

export type Topic = {
  topicId: number;
  title: string;
  lessons: Lesson[];
};