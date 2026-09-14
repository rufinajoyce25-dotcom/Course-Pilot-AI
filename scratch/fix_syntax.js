const fs = require('fs');

// 1. Fix CourseLearningModal.tsx
let clm = fs.readFileSync('./src/components/CourseLearningModal.tsx', 'utf8');
clm = clm.replace(
  /import React, \{ useState, useEffect \} from "react";\r?\nimport React, \{ useState, useEffect, useRef \} from "react";/,
  'import React, { useState, useEffect, useRef } from "react";'
);
clm = clm.replace(
  /ChevronRight,\r?\n\s*Video\r?\n\s*Video,/,
  'ChevronRight,\n  Video,'
);
fs.writeFileSync('./src/components/CourseLearningModal.tsx', clm, 'utf8');
console.log('CourseLearningModal.tsx cleaned');

// 2. Fix EnrolledCoursesView.tsx
let ecv = fs.readFileSync('./src/components/views/EnrolledCoursesView.tsx', 'utf8');
ecv = ecv.replace(
  /Curriculum Video Progress[\s\S]*?Course Progress Breakdown:/,
  'Course Progress Breakdown:'
);
ecv = ecv.replace(
  /<div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">\s*<div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mb-2">/,
  '<div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mb-2">'
);
fs.writeFileSync('./src/components/views/EnrolledCoursesView.tsx', ecv, 'utf8');
console.log('EnrolledCoursesView.tsx cleaned');

