const fs = require('fs');

let udb = fs.readFileSync('./src/lib/server/universityDatabase.ts', 'utf8');

const target = `    progress.completedVideoIds = Array.from(set);
    progress.progressPercentage = Math.round((progress.completedVideoIds.length / progress.totalVideos) * 100);
    this.recalculateCourseProgress(studentId, code, progress);

    if (progress.progressPercentage >= 100) {
      progress.status = "COMPLETED";
      if (!progress.certificateId) {
        const cert = this.issueCourseCertificate(studentId, code);
    // If all videos completed and no quiz was taken yet, let's also support direct 100% video completion milestone
    if (progress.completedVideoIds.length >= progress.totalVideos && !progress.certificateId) {
      // If student also passed quiz or if in legacy testing mode without quiz requirement
      if (progress.quizPassed || (progress.completedLabIds && progress.completedLabIds.length >= (progress.totalLabs || 0))) {
        progress.status = "COMPLETED";
        const cert = this.issueCourseCertificate(studentId, code, progress.quizScore || 18);
        progress.certificateId = cert.certificateId;
        progress.certificateIssuedAt = cert.completionDate;
      }
    } else {
      progress.status = "IN_PROGRESS";
    }

    return progress;`;

const replacement = `    progress.completedVideoIds = Array.from(set);
    this.recalculateCourseProgress(studentId, code, progress);

    if (progress.completedVideoIds.length >= progress.totalVideos && !progress.certificateId) {
      if (progress.quizPassed || (progress.completedLabIds && progress.completedLabIds.length >= (progress.totalLabs || 0))) {
        progress.status = "COMPLETED";
        const cert = this.issueCourseCertificate(studentId, code, progress.quizScore || 18);
        progress.certificateId = cert.certificateId;
        progress.certificateIssuedAt = cert.completionDate;
      }
    } else if (progress.progressPercentage < 100) {
      progress.status = "IN_PROGRESS";
    }

    return progress;`;

if (udb.includes(target)) {
  udb = udb.replace(target, replacement);
} else {
  // Line-ending agnostic regex
  udb = udb.replace(
    /progress\.completedVideoIds = Array\.from\(set\);[\s\S]*?return progress;/,
    replacement
  );
}

fs.writeFileSync('./src/lib/server/universityDatabase.ts', udb, 'utf8');
console.log('Fixed toggleVideoCompleted in universityDatabase.ts');

