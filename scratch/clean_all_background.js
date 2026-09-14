const fs = require('fs');

// 1. Clean src/app/layout.tsx
const layoutPath = 'src/app/layout.tsx';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
layoutContent = layoutContent.replace(
  /<body[\s\S]*?<body className="antialiased bg-\[#f3f6fc\] text-\[#0f172a\] min-h-screen">/,
  '<body className="antialiased bg-[#f3f6fc] text-[#0f172a] min-h-screen">'
);
fs.writeFileSync(layoutPath, layoutContent, 'utf8');
console.log('Cleaned layout.tsx');

// 2. Clean src/app/globals.css
const cssPath = 'src/app/globals.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');
cssContent = cssContent.replace(
  /background-image:\s*url\('\/platform-bg\.png'\);\s*background-size:\s*cover;\s*background-position:\s*center top;\s*background-attachment:\s*fixed;\s*background-repeat:\s*no-repeat;/g,
  ''
);
// Also ensure academic-card is clean
cssContent = cssContent.replace(
  /background:\s*rgba\(255,\s*255,\s*255,\s*0\.94\);\s*backdrop-filter:\s*blur\(16px\);\s*-webkit-backdrop-filter:\s*blur\(16px\);\s*border:\s*1px solid rgba\(226,\s*232,\s*240,\s*0\.85\);/,
  'background: #ffffff;\n  border: 1px solid #eef2f7;'
);
fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('Cleaned globals.css');

// 3. Clean src/app/page.tsx
const pagePath = 'src/app/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf8');
pageContent = pageContent.replace(
  /<div\s+className="flex min-h-screen relative bg-cover[\s\S]*?<div className="flex min-h-screen bg-\[#f4f7fc\]">/,
  '<div className="flex min-h-screen bg-[#f4f7fc]">'
);
fs.writeFileSync(pagePath, pageContent, 'utf8');
console.log('Cleaned page.tsx');

// 4. Clean Sidebar.tsx and TopNav.tsx
const sidebarPath = 'src/components/Sidebar.tsx';
let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
sidebarContent = sidebarContent.replace(
  'bg-white/90 backdrop-blur-xl border-r border-[#eaeff8]/80 flex flex-col justify-between min-h-screen py-6 px-4 select-none shadow-sm z-20',
  'bg-white border-r border-[#eaeff8] flex flex-col justify-between min-h-screen py-6 px-4 select-none'
);
fs.writeFileSync(sidebarPath, sidebarContent, 'utf8');
console.log('Cleaned Sidebar.tsx');

const topNavPath = 'src/components/TopNav.tsx';
let topNavContent = fs.readFileSync(topNavPath, 'utf8');
topNavContent = topNavContent.replace(
  'bg-white/90 backdrop-blur-xl border-b border-[#eaeff8]/80 px-8 flex items-center justify-between sticky top-0 z-30 select-none shadow-2xs',
  'bg-white border-b border-[#eaeff8] px-8 flex items-center justify-between sticky top-0 z-30 select-none'
);
fs.writeFileSync(topNavPath, topNavContent, 'utf8');
console.log('Cleaned TopNav.tsx');

// 5. Delete static files in public
['public/platform-bg.png', 'public/images/platform-bg.png'].forEach(f => {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log('Deleted ' + f);
  }
});

