const fs = require('fs');

// 1. Fix developmentProvider.ts
let dp = fs.readFileSync('./src/lib/providers/developmentProvider.ts', 'utf8');
dp = dp.replace(
  'source: "University Registrar API"\r\n      source: "Real University SIS Gateway"',
  'source: "Real University SIS Gateway"'
);
dp = dp.replace(
  'source: "University Registrar API"\n      source: "Real University SIS Gateway"',
  'source: "Real University SIS Gateway"'
);
dp = dp.replace(
  'message: `Registration confirmed for ${course.code} (${section.sectionCode})`,\r\n      message: `Registration confirmed for ${course.code} — ${course.name} (${section.sectionCode})`,',
  'message: `Registration confirmed for ${course.code} — ${course.name} (${section.sectionCode})`,'
);
dp = dp.replace(
  'message: `Registration confirmed for ${course.code} (${section.sectionCode})`,\n      message: `Registration confirmed for ${course.code} — ${course.name} (${section.sectionCode})`,',
  'message: `Registration confirmed for ${course.code} — ${course.name} (${section.sectionCode})`,'
);
dp = dp.replace(
  'verifiedSection: section,\r\n      credits: course.credits\r\n      verifiedSection: section',
  'verifiedSection: section'
);
dp = dp.replace(
  'verifiedSection: section,\n      credits: course.credits\n      verifiedSection: section',
  'verifiedSection: section'
);
fs.writeFileSync('./src/lib/providers/developmentProvider.ts', dp, 'utf8');
console.log('Fixed developmentProvider.ts');

// 2. Fix realUniversityProvider.ts
let rup = fs.readFileSync('./src/lib/providers/realUniversityProvider.ts', 'utf8');
rup = rup.replace(
  'verifiedSection: section,\r\n      credits: course.credits\r\n      verifiedSection: section',
  'verifiedSection: section'
);
rup = rup.replace(
  'verifiedSection: section,\n      credits: course.credits\n      verifiedSection: section',
  'verifiedSection: section'
);
fs.writeFileSync('./src/lib/providers/realUniversityProvider.ts', rup, 'utf8');
console.log('Fixed realUniversityProvider.ts');

// 3. Fix universityDatabase.ts
let udb = fs.readFileSync('./src/lib/server/universityDatabase.ts', 'utf8');
udb = udb.replace(
  'videos\r\n        videos,',
  'videos,'
);
udb = udb.replace(
  'videos\n        videos,',
  'videos,'
);
udb = udb.replace(
  'public toggleVideoCompleted(studentId: string, courseCode: string, videoId: string): EnrolledCourseProgress {\r\n  public getOrCreateCourseProgress',
  'public getOrCreateCourseProgress'
);
udb = udb.replace(
  'public toggleVideoCompleted(studentId: string, courseCode: string, videoId: string): EnrolledCourseProgress {\n  public getOrCreateCourseProgress',
  'public getOrCreateCourseProgress'
);
udb = udb.replace(
  'public issueCourseCertificate(studentId: string, courseCode: string): CourseCertificate {\r\n  public submitCourseLab',
  'public submitCourseLab'
);
udb = udb.replace(
  'public issueCourseCertificate(studentId: string, courseCode: string): CourseCertificate {\n  public submitCourseLab',
  'public submitCourseLab'
);
fs.writeFileSync('./src/lib/server/universityDatabase.ts', udb, 'utf8');
console.log('Fixed universityDatabase.ts');

