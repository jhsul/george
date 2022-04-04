export type Professor = {
  _id: string;
  name: string;
  activeYears: number[];
};

export type Course = {
  _id: string;
  name: string;
};

export type Section = {
  professorId: string;
  professorName: string;
  courseId: string;
  courseName: string;
  term: string;
  sectionType: "Lecture" | "Conference";
  report: Question[];
};

export type Question = {
  questionNumber: number;
  responses: number[5];
  n: number;
};
