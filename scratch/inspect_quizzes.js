const fs = require('fs');
const content = fs.readFileSync('src/lib/server/courseLabsAndQuizzes.ts', 'utf8');

const labCourses = [];
const quizCourses = [];

const lines = content.split('\n');
let inLabs = false;
let inQuizzes = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('defaultLabsData: Record')) {
    inLabs = true;
    inQuizzes = false;
  } else if (line.includes('defaultQuizzesData: Record')) {
    inLabs = false;
    inQuizzes = true;
  }
  
  if (inLabs) {
    const m = line.match(/^\s*([A-Z0-9]+):\s*\[/);
    if (m) labCourses.push(m[1]);
  }
  if (inQuizzes) {
    const m = line.match(/^\s*([A-Z0-9]+):\s*\{/);
    if (m) quizCourses.push(m[1]);
  }
}

console.log('Lab courses:', labCourses);
console.log('Quiz courses:', quizCourses);

