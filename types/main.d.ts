export interface Professor {
  _id: string;
  name: string;
  activeYears?: number[];
}

export interface Course {
  _id: string;
  name: string;
}

export interface Section {
  professorId: string;
  professorName: string;
  courseId: string;
  courseName: string;
  term: string;
  sectionType: "Lecture" | "Conference";
  report: Question[];
}

export interface SearchResult {
  score: number;
  type: "course" | "professor";
  _id: string;
  name: string;
}

export interface Question {
  questionNumber: number;
  responses: number[5];
  //n: number;
}
