import { Course, Professor, SearchResult } from "../types/main";

/*

export const search = (
  input: string,
  professors: Professor[],
  courses: Course[]
): SearchResult[] => {
  const words = input
    .replace(/[^\w\s]|_/g, "")
    .split(" ")
    .filter((w) => w.length > 0)
    .map((w) => new RegExp(w));

  const results = [];


  for (const professor of professors) {
    for (const word of words) {
      if (word.test(professor.name.toLowerCase())) {
        console.log(professor);
        if (!currentResult)
          currentResult = { score: 0, type: "professor", value: professor };
        currentResult.score += 1 / words.length;
      }
    }
    
  }
  console.log(words);

  console.table(results);
  return results;
};
*/
