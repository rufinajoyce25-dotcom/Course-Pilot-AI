const fs = require('fs');
const content = fs.readFileSync('src/components/TopNav.tsx', 'utf8');
const idx = content.indexOf('return (');
console.log('Substring:', JSON.stringify(content.slice(idx, idx + 100)));
for (let i = idx; i < idx + 40; i++) {
  console.log(i, content[i], content.charCodeAt(i));
}

