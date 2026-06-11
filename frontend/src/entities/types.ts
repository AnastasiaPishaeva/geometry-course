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
  type: "theory" | "game";
  order_number: number;
}

export type Stars = {
  user_id: number;
  total_stars: number;
}

export type User = {
  "user_id": number,
  "email": string,
  "first_name": string,
  "last_name": string,
  "created_at": string
}