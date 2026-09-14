const fs = require('fs');

// 1. src/app/api/registration/route.ts
let reg = fs.readFileSync('./src/app/api/registration/route.ts', 'utf8');
reg = reg.replace(
  `        transactionId: regResult.transactionId,\n        message: regResult.message,\n        timestamp: regResult.timestamp,\n        transactionId: reg.transactionId,`,
  `        transactionId: reg.transactionId,`
);
reg = reg.replace(
  `        transactionId: regResult.transactionId,\r\n        message: regResult.message,\r\n        timestamp: regResult.timestamp,\r\n        transactionId: reg.transactionId,`,
  `        transactionId: reg.transactionId,`
);
fs.writeFileSync('./src/app/api/registration/route.ts', reg, 'utf8');
console.log('Fixed api/registration/route.ts');

// 2. src/app/api/v1/learning/route.ts
let lrn = fs.readFileSync('./src/app/api/v1/learning/route.ts', 'utf8');
lrn = lrn.replace(
  `    const { action, studentId, courseCode, videoId } = body;\n    const { action, studentId, courseCode, videoId, watchedSeconds, totalDurationSeconds, labId, answers } = body;`,
  `    const { action, studentId, courseCode, videoId, watchedSeconds, totalDurationSeconds, labId, answers } = body;`
);
lrn = lrn.replace(
  `    const { action, studentId, courseCode, videoId } = body;\r\n    const { action, studentId, courseCode, videoId, watchedSeconds, totalDurationSeconds, labId, answers } = body;`,
  `    const { action, studentId, courseCode, videoId, watchedSeconds, totalDurationSeconds, labId, answers } = body;`
);
lrn = lrn.replace(
  `      const cert = certificates.find(c => c.courseCode.toUpperCase() === courseCode.toUpperCase()) || null;\n      const cert = certificates.find((c) => c.courseCode.toUpperCase() === courseCode.toUpperCase()) || null;`,
  `      const cert = certificates.find((c) => c.courseCode.toUpperCase() === courseCode.toUpperCase()) || null;`
);
lrn = lrn.replace(
  `      const cert = certificates.find(c => c.courseCode.toUpperCase() === courseCode.toUpperCase()) || null;\r\n      const cert = certificates.find((c) => c.courseCode.toUpperCase() === courseCode.toUpperCase()) || null;`,
  `      const cert = certificates.find((c) => c.courseCode.toUpperCase() === courseCode.toUpperCase()) || null;`
);
fs.writeFileSync('./src/app/api/v1/learning/route.ts', lrn, 'utf8');
console.log('Fixed api/v1/learning/route.ts');

// 3. src/app/page.tsx
let pg = fs.readFileSync('./src/app/page.tsx', 'utf8');
const oldPgBlock = `      courseCode: regResult.course || regResult.courseCode || "CS401",
      courseName: regResult.courseName || "Machine Learning",
      sectionCode: regResult.section || "Section A",
      room: regResult.room || "Turing Hall 302",
      schedule: regResult.schedule || "Monday & Wednesday 10:00–11:00 AM",
      credits: regResult.credits || 4,
      seatsRemaining: regResult.seatsRemaining !== undefined ? regResult.seatsRemaining : 7,
      completedCreditsNow: regResult.completedCreditsNow || (student ? student.completedCredits + 4 : 100),
      degreeProgressNow: regResult.degreeProgressNow || 71,
      courseCode: targetCourseCode,`;

pg = pg.replace(oldPgBlock, '      courseCode: targetCourseCode,');
pg = pg.replace(oldPgBlock.replace(/\n/g, '\r\n'), '      courseCode: targetCourseCode,');
fs.writeFileSync('./src/app/page.tsx', pg, 'utf8');
console.log('Fixed app/page.tsx');

// 4. src/components/views/CourseCatalogView.tsx
let cat = fs.readFileSync('./src/components/views/CourseCatalogView.tsx', 'utf8');
cat = cat.replace(
  '                  className="py-2.5 px-3 rounded-2xl bg-[#f8fafc] hover:bg-[#eef3fb] border border-[#e2e8f0] text-[12px] font-semibold text-[#334155] transition-colors text-center"\n                  className="py-2.5 px-3 rounded-2xl bg-[#f8fafc] hover:bg-[#eef3fb] border border-[#e2e8f0] text-[12px] font-semibold text-[#334155] transition-colors text-center cursor-pointer"',
  '                  className="py-2.5 px-3 rounded-2xl bg-[#f8fafc] hover:bg-[#eef3fb] border border-[#e2e8f0] text-[12px] font-semibold text-[#334155] transition-colors text-center cursor-pointer"'
);
cat = cat.replace(
  '                  className="py-2.5 px-3 rounded-2xl bg-[#f8fafc] hover:bg-[#eef3fb] border border-[#e2e8f0] text-[12px] font-semibold text-[#334155] transition-colors text-center"\r\n                  className="py-2.5 px-3 rounded-2xl bg-[#f8fafc] hover:bg-[#eef3fb] border border-[#e2e8f0] text-[12px] font-semibold text-[#334155] transition-colors text-center cursor-pointer"',
  '                  className="py-2.5 px-3 rounded-2xl bg-[#f8fafc] hover:bg-[#eef3fb] border border-[#e2e8f0] text-[12px] font-semibold text-[#334155] transition-colors text-center cursor-pointer"'
);
fs.writeFileSync('./src/components/views/CourseCatalogView.tsx', cat, 'utf8');
console.log('Fixed CourseCatalogView.tsx');

// 5. src/lib/providers/realUniversityProvider.ts
let rup = fs.readFileSync('./src/lib/providers/realUniversityProvider.ts', 'utf8');
rup = rup.replace(
  `      message: \`Enrolled in \${course.code}\`,\n      message: \`Enrolled in \${course.code} — \${course.name}\`,`,
  `      message: \`Enrolled in \${course.code} — \${course.name}\`,`
);
rup = rup.replace(
  `      message: \`Enrolled in \${course.code}\`,\r\n      message: \`Enrolled in \${course.code} — \${course.name}\`,`,
  `      message: \`Enrolled in \${course.code} — \${course.name}\`,`
);
fs.writeFileSync('./src/lib/providers/realUniversityProvider.ts', rup, 'utf8');
console.log('Fixed realUniversityProvider.ts');

// 6. src/lib/server/universityDatabase.ts
let udb = fs.readFileSync('./src/lib/server/universityDatabase.ts', 'utf8');
udb = udb.replace(
  '        totalVideos: curriculum?.videos.length || 6,\n        totalVideos: totalV,',
  '        totalVideos: totalV,'
);
udb = udb.replace(
  '        totalVideos: curriculum?.videos.length || 6,\r\n        totalVideos: totalV,',
  '        totalVideos: totalV,'
);

// remove duplicate getEnrolledCoursesWithProgress
const dupGetEnrolled = `  public getEnrolledCoursesWithProgress(studentId: string): EnrolledCourseProgress[] {
    const student = this.getStudent(studentId);
    if (!student) return [];

    // Ensure all currentEnrollments are reflected
    for (const code of (student.currentEnrollments || [])) {
      this.getOrCreateCourseProgress(studentId, code);
    }

    const map = this.learningProgress.get(studentId);
    return map ? Array.from(map.values()) : [];
  }`;

udb = udb.replace(dupGetEnrolled, '');
udb = udb.replace(dupGetEnrolled.replace(/\n/g, '\r\n'), '');

// remove duplicate grade & honors in issueCourseCertificate
udb = udb.replace(
  '      grade: "A (Honors)",\n      honors: "First Class with Distinction",\n      grade: quizScore >= 18 ?',
  '      grade: quizScore >= 18 ?'
);
udb = udb.replace(
  '      grade: "A (Honors)",\r\n      honors: "First Class with Distinction",\r\n      grade: quizScore >= 18 ?',
  '      grade: quizScore >= 18 ?'
);

// remove duplicate idx
udb = udb.replace(
  '    const idx = certs.findIndex(c => c.courseCode === code);\n    const idx = certs.findIndex((c) => c.courseCode === code);',
  '    const idx = certs.findIndex((c) => c.courseCode === code);'
);
udb = udb.replace(
  '    const idx = certs.findIndex(c => c.courseCode === code);\r\n    const idx = certs.findIndex((c) => c.courseCode === code);',
  '    const idx = certs.findIndex((c) => c.courseCode === code);'
);

fs.writeFileSync('./src/lib/server/universityDatabase.ts', udb, 'utf8');
console.log('Fixed universityDatabase.ts');

