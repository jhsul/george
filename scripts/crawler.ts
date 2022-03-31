import fs from "fs";
import { MongoClient, ObjectId } from "mongodb";
import { config } from "dotenv";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";

config({ path: ".env.local" });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const OSCAR_URL = "https://oscar.wpi.edu/";

const COOKIE = process.env.COOKIE || "shittycookiewontwork";
const COOKIE_STRING = `MOD_AUTH_CAS_S=${COOKIE};`;

const YEARS = [2018, 2019, 2020, 2021];
//const YEARS = [2018];

const mongoClient = new MongoClient(process.env.MONGO_URI!);
await mongoClient.connect();
const db = mongoClient.db("george");
console.log("Connected to Mongo :)");

let decrypt: (data: string) => void;

const main = async () => {
  console.log("Clearing database");
  await clearDb();

  console.log(`Starting crawler with CAS cookie ${COOKIE}`);
  const cookieIsValid = await testCookie();

  if (!cookieIsValid) {
    console.error("Cookie invalid, aborting");
    process.exit(1);
  } else {
    console.log(`Cookie is valid, scraping ${OSCAR_URL}`);
  }

  console.log("Getting decryption function");
  decrypt = await getDecryptFunction();

  for (const year of YEARS) {
    console.log(`Scraping data from ${year}-${year + 1}`);

    await getYearData(year);
  }
  console.log("Finished");
};

const clearDb = async () => {
  for (const c of await db.listCollections().toArray()) {
    await db.dropCollection(c.name);
  }
};

const testCookie = async (): Promise<boolean> => {
  const res = await fetch(`${OSCAR_URL}`, {
    headers: { cookie: COOKIE_STRING },
  });

  const text = await res.text();

  if (/OSCAR/.test(text)) {
    return true;
  }

  return false;
};

/**
 * Example => [[735, Addison, W., ...], [735, ..]]
735;Addison, W.;INTRO-EUROPEAN CULTRL HIST;HI 1322;Lecture;201901_A
735;Addison, W.;INQ SEM: GLOBAL ISSUES ;HU 3900;Seminar;201901_B
735;Addison, W.;TOPICS IN COMP. CIVILIZATION ;HI 3342;Lecture;201902_C
735;Addison, W.;INQ SEM:WORLD HIST&PRJ CENTERS;HU 3900;Seminar;201902_D
 */
const parseTextResponse = (text: string) => {
  return text
    .split("\n")
    .slice(0, -1)
    .map((line) => line.split(";"));
};

// Reports are arrays of 9 numbers
// Last number is av which can be calculated with more precision on frontend
const parseReportQuestion = (data: number[]) => {
  //console.log(data);

  return {
    questionNumber: data[0],
    responses: data.slice(1, 6),
    n: data[7],
  };
};

/**
 * Decrypts the section report data that we receive from /byPandC
 */
const getDecryptFunction = async (): Promise<(data: string) => void> => {
  const res = await fetchWithoutTimingOut(
    `${OSCAR_URL}/oscar/1.3/js/oscar.js`,
    {
      headers: { cookie: COOKIE_STRING },
    }
  );
  const file = await res.text();
  const lines = file.split("\n");
  for (const line of lines) {
    if (/var _/.test(line)) {
      console.log("Found decryption code");
      console.log(line);

      return (data: string) => {
        const evalString = eval(`${line};processDone("${data}")`);
        const rawNumbers = evalString.split(",").slice(0, -1).map(parseFloat);

        const questions = [];
        const blockSize = 9;
        for (let i = 0; i < rawNumbers.length; i += blockSize) {
          const block = rawNumbers.slice(i, i + blockSize);
          questions.push(parseReportQuestion(block));
        }
        return questions;
      };
    }
  }
  return (data: string) => {};
};

const getYearData = async (year: number): Promise<void> => {
  const res = await fetchWithoutTimingOut(
    `${OSCAR_URL}/oscar/${year}-${year + 1}.html`,
    {
      headers: { cookie: COOKIE_STRING },
    }
  );
  const dom = new JSDOM(await res.text());

  await getProfessors(dom, year);
  await getCourses(dom, year);
};

/**
 * Parse the list of professors in the given year from the DOM
 *
 */
const getProfessors = async (dom: JSDOM, year: number): Promise<void> => {
  const professorsSelect = dom.window.document.getElementById(
    "IN_PIDM"
  ) as HTMLSelectElement;

  for (let i = 0; i < professorsSelect.children.length; i++) {
    //for (let i = 0; i < 4; i++) {
    const node = professorsSelect.children[i];

    const professorId = node.getAttribute("value");
    const professorName = node.innerHTML;

    if (!professorId || professorId === "0") continue;

    console.log(`[${year}-${year + 1}]Stalking ${professorName}`);
    await getProfessor(professorId, professorName, year);
    await sleep(100); // pls dont crash
  }
  console.log(
    `[${year}-${year + 1}] Found ${professorsSelect.children.length} professors`
  );
};

/**
 * Get a professor's course history in the given year from OSCAR server
 */
const getProfessor = async (
  professorId: string,
  professorName: string,
  year: number
) => {
  // Upload basic info to mongo
  await db.collection("professors").updateOne(
    { _id: professorId },
    {
      $set: { _id: professorId, name: professorName },
      $push: { activeYears: year },
    },
    { upsert: true }
  );

  // Get course history

  /*
  const res = await fetch(
    `${OSCAR_URL}/cgi-bin/oscar/1.3/byP.cgi?pidm_id=${professorId}&year=${year}-${
      year + 1
    }`,
    { headers: { cookie: COOKIE_STRING } }
  );

  const text = await res.text();

  const history = parseTextResponse(text).map((section) => {
    const [, , courseName, courseId, sectionType, term] = section;
    return { courseName, courseId, sectionType, term };
  });
  //const [, , courseName, courseId, sectionType, term] = parseTextResponse(text);

  console.log(history);

  // Add course list for the given year to mongo
  await db.collection("professors").updateOne(
    { _id: professorId },
    {
      $push: {
        history: {
          $each: history,
        },
      },
    }
  );
  */
};

const getCourses = async (dom: JSDOM, year: number): Promise<void> => {
  const coursesSelect = dom.window.document.getElementById(
    "IN_SUBCRSE"
  ) as HTMLSelectElement;

  //for (let i = 0; i < 3; i++) {
  for (let i = 0; i < coursesSelect.children.length; i++) {
    const node = coursesSelect.children[i];
    const courseId = node.getAttribute("value");
    const courseName = node.innerHTML;

    if (!courseId || courseId === "0") continue;

    await getCourse(courseId, courseName, year);
    await sleep(100); // pls dont crash
  }
};

const getCourse = async (
  courseId: string,
  courseName: string,
  year: number
) => {
  if (/HU 39/.test(courseId)) {
    console.log("Skipping humanities bs");
    return;
  }
  if (/ID 20/.test(courseId)) {
    console.log("Skipping IQP bs");
    return;
  }
  const res = await fetchWithoutTimingOut(
    `${OSCAR_URL}/cgi-bin/oscar/1.3/byC.cgi?courseNumber=${courseId}&year=${year}-${
      year + 1
    }`,
    {
      headers: { cookie: COOKIE_STRING },
    }
  );
  console.log(`Getting course ${courseName}`);
  const text = await res.text();
  //console.log(text);

  // Add basic info to mongo
  await db
    .collection("courses")
    .updateOne(
      { _id: courseId },
      { $set: { name: courseName } },
      { upsert: true }
    );

  const sections = parseTextResponse(text).map((section) => {
    const [
      professorId,
      professorName,
      courseName,
      courseId,
      sectionType,
      term,
    ] = section;
    return {
      professorId,
      professorName,
      courseName,
      courseId,
      sectionType,
      term,
    };
  });

  for (const section of sections) {
    await getSection(
      section.professorId,
      section.professorName,
      section.courseId,
      section.term
    );
  }
};

const getSection = async (
  professorId: string,
  professorName: string,
  courseId: string,
  term: string
) => {
  console.log(`Getting section for ${courseId} with ${professorName}`);

  const url = encodeURI(
    `https://oscar.wpi.edu/cgi-bin/oscar/1.3/byPandC.cgi?pidm_id=${professorId}&courseNumber=${courseId}&term=${term}`
  );
  //console.log(url);
  const res = await fetchWithoutTimingOut(url, {
    headers: { cookie: COOKIE_STRING },
  });

  const text = await res.text();
  const [, , courseName, , , sectionType, , data] = parseTextResponse(text)[0];
  //const section = parseTextResponse(await res.text());

  //console.log(section);
  //console.log(data);
  const cleanData = decrypt(data!);

  //console.log(cleanData);

  const sectionRes = await db.collection("sections").insertOne({
    professorId,
    professorName,
    courseId,
    courseName,
    term,
    sectionType,
    report: cleanData,
  });

  const sectionId = sectionRes.insertedId;

  await db.collection("courses").updateOne(
    { _id: courseId },
    {
      $push: { sections: sectionId },
    }
  );

  await db.collection("professors").updateOne(
    { _id: professorId },
    {
      $push: { sections: sectionId },
    }
  );
  // Add to section info of course
  /*
  await db.collection("courses").updateOne(
    { _id: courseId },
    {
      $push: {
        sections: { professorId, professorName, term, report: cleanData },
      },
    }
  );
  */
};

const fetchWithoutTimingOut = async (
  url: string,
  options: { headers: { cookie: string } }
) => {
  while (true) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (e) {
      console.log(`REQUEST TIMED OUT, TRYING AGAIN (${url})`);
    }
  }
};

await main();
process.exit(0);
