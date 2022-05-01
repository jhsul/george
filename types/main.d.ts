import { Color } from "chart.js";

export interface Professor {
  _id: string;
  name: string;
  activeYears?: number[];
}

export interface Course {
  _id: string;
  name: string;

  // Use this for each question category
  aggregatedData?: { [key: string]: number };
  aggregatedDataN?: number;
  aggregatedSections?: number;
}

export interface Section {
  professorId: string;
  professorName: string;
  courseId: string;
  courseName: string;
  term: string;
  sectionType: "Lecture" | "Conference" | "Lab";
  report: Question[];
}

export interface Dataset {
  label: string;
  data: number[][];
  backgroundColor: Color;
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
