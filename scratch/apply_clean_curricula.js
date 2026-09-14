const fs = require('fs');

const { cleanStarterCodes } = require('./clean_starter_codes.js');
const { extraCS401, extraCS305, generateExtraQuestions } = require('./questions_data.js');

let fileContent = fs.readFileSync('src/lib/server/courseLabsAndQuizzes.ts', 'utf8');

// 1. Replace starterCode solutions with clean templates
const labIds = Object.keys(cleanStarterCodes);
for (const id of labIds) {
  const newStarter = cleanStarterCodes[id];
  // Regex to find the lab object and replace its starterCode
  const labRegex = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?starterCode:\\s*)"[\\s\\S]*?"(\\s*,\\s*testCases:)`, 'g');
  if (labRegex.test(fileContent)) {
    fileContent = fileContent.replace(
      new RegExp(`(id:\\s*"${id}"[\\s\\S]*?starterCode:\\s*)"[\\s\\S]*?"(\\s*,\\s*testCases:)`),
      `$1${JSON.stringify(newStarter)}$2`
    );
    console.log(`Replaced starterCode for ${id}`);
  }
}

// Also for other labs that might have prefilled code, replace any starterCode
// with a clean template
fileContent = fileContent.replace(
  /starterCode:\s*"import numpy as np\\n\\ndef [^"]+"/g,
  (match) => {
    return 'starterCode: "# Write your Python implementation here\\nimport numpy as np\\n\\npass\\n"';
  }
);

// 2. Update points from 2 to 1 on all questions
fileContent = fileContent.replace(/points:\s*2\s*,/g, 'points: 1,');

// 3. Now let's append questions 11-20 for each course in defaultQuizzesData
const courseCodes = ['CS401', 'CS305', 'CS320', 'CS380', 'CS350', 'CS420', 'CS310', 'CS450'];
const courseTitles = {
  CS401: 'Machine Learning',
  CS305: 'Database Systems',
  CS320: 'Cloud Computing & DevOps',
  CS380: 'Cybersecurity & Cryptography',
  CS350: 'Computer Vision',
  CS420: 'Natural Language Processing',
  CS310: 'Web & Mobile Systems',
  CS450: 'Distributed Systems'
};

for (const code of courseCodes) {
  let extraList;
  if (code === 'CS401') extraList = extraCS401;
  else if (code === 'CS305') extraList = extraCS305;
  else extraList = generateExtraQuestions(code, courseTitles[code]);

  const formattedExtra = extraList.map(q => {
    return `      {
        id: ${JSON.stringify(q.id)},
        question: ${JSON.stringify(q.question)},
        options: ${JSON.stringify(q.options, null, 10).replace(/\n/g, '\n      ')},
        correctAnswerIndex: ${q.correctAnswerIndex},
        points: 1,
        explanation: ${JSON.stringify(q.explanation)}
      }`;
  }).join(',\n');

  // Look for end of questions array for this course
  // e.g. CS401: { ... questions: [ ... ]
  const courseBlockRegex = new RegExp(`(${code}:\\s*\\{[\\s\\S]*?questions:\\s*\\[[\\s\\S]*?)(\\n\\s*\\]\\s*\\})`, 'g');
  
  if (courseBlockRegex.test(fileContent)) {
    fileContent = fileContent.replace(courseBlockRegex, `$1,\n${formattedExtra}$2`);
    console.log(`Appended 10 questions to ${code}`);
  } else {
    console.warn(`Could not find questions block for ${code}`);
  }
}

fs.writeFileSync('src/lib/server/courseLabsAndQuizzes.ts', fileContent, 'utf8');
console.log("Successfully updated courseLabsAndQuizzes.ts!");

