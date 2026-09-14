const fs = require('fs');
const content = fs.readFileSync('src/lib/server/courseLabsAndQuizzes.ts', 'utf8');

const regex = /([A-Z0-9]+):\s*\{\s*courseCode:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?questions:\s*\[([\s\S]*?)\]\s*\}/g;

let match;
while ((match = regex.exec(content)) !== null) {
  const code = match[1];
  const qText = match[4];
  const qMatches = [...qText.matchAll(/id:\s*"([^"]+)"/g)];
  console.log(`Course ${code}: ${qMatches.length} questions`);
}

