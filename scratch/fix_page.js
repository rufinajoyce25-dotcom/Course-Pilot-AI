const fs = require('fs');
const path = './src/app/page.tsx';

let content = fs.readFileSync(path, 'utf8');

const regex = /<div\s+className="flex min-h-screen relative bg-cover[\s\S]*?<div className="flex min-h-screen bg-\[#f4f7fc\]">/;

if (regex.test(content)) {
  content = content.replace(regex, '<div className="flex min-h-screen bg-[#f4f7fc]">');
  fs.writeFileSync(path, content, 'utf8');
  console.log('SUCCESS: Cleaned up duplicate div in src/app/page.tsx');
} else {
  console.log('REGEX did not match. Let us inspect lines 475 to 488.');
  const lines = content.split(/\r?\n/);
  console.log(lines.slice(475, 488).join('\n'));
}

