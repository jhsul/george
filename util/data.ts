import { Dataset, Question, Section } from "../types/main";

export const COLOR_PALETTE = [
  "#a1cef7A0",
  "#ff8c8cA0",
  "#61d465A0",
  "#cc5dd9A0",
  "#ff9e66A0",
  "#ff9e66A0",
];

/*
export const QUESTION_CATEGORIES: { [key: string]: number[] } = {
  "Estimated Grade": [18],
  "Course Quality": [0, 1, 2, 3, 4, 5],
  "Course Difficulty": [7, 8, 9, 10, 11, 19],
  "Instructor Quality": [12, 13, 14, 15, 16],
};
*/
export const QUESTION_CATEGORIES: { [key: string]: number[] } = {
  "Estimated Grade": [18],
  "Course Quality": [1, 2, 3, 7, 16],
  "Course Difficulty": [8, 11, 19],
  "Instructor Quality": [4, 5, 6, 9, 10, 12, 13, 14, 15, 17],
};

export const QUESTION_TEXTS: { [key: number]: string } = {
  1: "My overall rating of the quality of this course is",
  2: "My overall rating of the instructor's teaching is",
  3: "The educational value of the assigned work was",
  4: "The instructor's organization of the course was",
  5: "The instructor's clarity in communicating course objectives was",
  6: "The instructor's skill in providing understandable explanations was",
  7: "The amount I learned from the course was",
  8: "The intellectual challenge presented by the course was",
  9: "The instructor's personal interest in helping students learn was",
  10: "The instructor stimulated my interest in the subject matter",
  11: "The amount of reading, homework, and other assigned work was",
  12: "The instructor was well prepared to teach class.",
  13: "The instructor encouraged students to ask questions.",
  14: "The instructor treated students with respect.",
  15: "Instructor feedback on exams/assignments was timely and helpful.",
  16: "The exams and/or evaluations were good measures of the material covered.",
  17: "My grades were determined in a fair and impartial manner.",
  18: "What grade do you think you will receive in this course?",
  19: "On average, what were the total hours spent in each 7-day week OUTSIDE of formally scheduled class time in work related to this course (including studying, reading, writing, homework, rehearsal, etc.)?",
};
const termToNumber = (term: string) => {
  const year = parseInt(term.substring(0, 4));
  const termChar = term.charAt(term.length - 1);

  const termFrac =
    termChar === "A"
      ? 0.0
      : termChar === "B"
      ? 0.25
      : termChar === "C"
      ? 0.5
      : termChar === "D"
      ? 0.75
      : NaN;
  if (termFrac === NaN) {
    console.error(`Bad term: ${term}`);
    return 0;
  }
  console.log(year + termFrac);
  return year + termFrac;
};

export const numberToTerm = (termNumber: number) => {
  const year = Math.floor(termNumber).toString();
  const termFrac = termNumber - Math.floor(termNumber);

  const termChar =
    termFrac === 0.0
      ? "A"
      : termFrac === 0.25
      ? "B"
      : termFrac === 0.5
      ? "C"
      : termFrac === 0.75
      ? "D"
      : "IDK";

  return `${year} ${termChar}`;
};

// IF A PROFESSOR TAUGHT THE SAME CLASS TWICE IN THE SAME TERM, THIS GETS FUCKED
export const getCourseLineChart = (sections: Section[]) => {
  const professors: { [key: string]: { term: string; avg: number }[] } = {};
  const labels: string[] = [];
  for (const section of sections) {
    if (!labels.includes(section.term)) {
      labels.push(section.term);
    }
    const { total, n } = getAverageGrade(section.report[17].responses);
    if (!professors[section.professorName]) {
      professors[section.professorName] = [];
    }
    professors[section.professorName].push({
      term: section.term,
      avg: total / n,
    });
  }

  console.log(professors);

  const datasets = Object.keys(professors).map((k, i) => {
    const p = professors[k];
    return {
      label: k,
      borderColor: COLOR_PALETTE[i % COLOR_PALETTE.length],
      backgroundColor: COLOR_PALETTE[i % COLOR_PALETTE.length],
      data: p.map((v) => ({ x: termToNumber(v.term), y: v.avg })),
    };
  });

  console.log(datasets);

  //console.log(datasets);
  const data = { datasets };
  return data;
};

export const getGradesByProfessor = (sections: Section[]) => {
  const p: { [key: string]: { total: number; n: number; avg?: number } } = {};

  for (const section of sections) {
    const { total, n } = getAverageGrade(section.report[17].responses);
    if (p[section.professorName]) {
      p[section.professorName].total += total;
      p[section.professorName].n += n;
    } else {
      p[section.professorName] = { total, n };
    }
  }

  for (const k of Object.keys(p)) {
    p[k].avg = p[k].total / p[k].n;
  }

  const labels = Object.keys(p);
  //const data = labels.map((k) => p[k].avg);
  console.log(p);
  const data = {
    labels,
    datasets: [
      {
        data: labels.map((k) => p[k].avg),
        backgroundColor: labels.map((k, i) => {
          return COLOR_PALETTE[i % COLOR_PALETTE.length];
        }),
      },
    ],
  };
  /*
  const data = {
    labels,
    datasets: labels.map((k) => {
      return { data: p[k].avg };
    }),
  };
  */
  console.log(data);

  return data;
  /*
  const datasets: Dataset[] = [];
  let currentColorIndex = 0;
  for (const section of sections) {
    const existingDataset = datasets.find(
      (d) => d.label === section.professorName
    );

    if (existingDataset) {
      //TODO THIS IS FUCKING IMPORTANT
      existingDataset.data[0].push(
        ...convertGradeResponse(section.report[17].responses)
      );
    } else {
      datasets.push({
        label: section.professorName,
        data: [convertGradeResponse(section.report[17].responses)],
        backgroundColor: COLOR_PALETTE[currentColorIndex],
      });
      if (++currentColorIndex >= COLOR_PALETTE.length) currentColorIndex = 0;
    }
  }
  console.log(datasets);
  */
};

const getAverageGrade = (arr: number[]) => {
  // A=3
  // B=2
  // C=1
  // NR=0
  const total = 3 * arr[0] + 2 * arr[1] + arr[2];
  const n = arr.slice(0, 4).reduce((p, a) => p + a, 0);
  return { total, n };
};

const convertGradeResponse = (arr: number[]) => {
  const res = [];
  // A
  for (let i = 0; i < arr[0]; i++) {
    res.push(3);
  }
  // B
  for (let i = 0; i < arr[1]; i++) {
    res.push(2);
  }

  // C
  for (let i = 0; i < arr[2]; i++) {
    res.push(1);
  }

  // NR
  for (let i = 0; i < arr[3]; i++) {
    res.push(0);
  }

  //console.log(arr);
  //console.log(res);
  return res;
};

export const getLastName = (name: string) => {
  return name.substring(0, name.indexOf(","));
};

export const courseGetSectionTitle = (section: Section) => {
  return `${getLastName(section.professorName)} ${section.term.charAt(
    section.term.length - 1
  )}${section.term.substring(2, 4)}`;
};

export const professorGetSectionTitle = (section: Section) => {
  return `${section.courseId} ${section.term.charAt(
    section.term.length - 1
  )}${section.term.substring(2, 4)}`;
};
