import { jsPDF } from "jspdf";
import { Student, Course, CourseCertificate, CourseSection } from "@/types";

/**
 * Generates an official University Proof of Enrollment & Academic Confirmation as a downloadable PDF.
 * Reflects 100% tuition-free scholarship status ($0.00) with no tuition charges, and lifelong access.
 */
export function generateEnrollmentBillPdf(
  student: Student,
  course: Course,
  section?: CourseSection,
  sectionCode?: string,
  transactionId?: string
): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const sec =
    section ||
    (sectionCode ? course.sections.find((s) => s.sectionCode === sectionCode) : undefined) ||
    course.sections[0];

  const schedStr = sec.schedule
    .map((s: any) => `${s.day} ${s.startTime}–${s.endTime}`)
    .join(", ");

  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const txn = transactionId || `TXN-UNIV-${Math.floor(100000 + Math.random() * 900000)}`;

  // Top University Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 36, "F");

  // University Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("NATIONAL INSTITUTE OF HIGHER COMPUTING & TECHNOLOGY", 105, 14, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text("Office of the Registrar • Student Academic Affairs • Course Enrollment Division", 105, 21, { align: "center" });
  doc.text("Campus Plaza, Tech Tower East • accreditation.edu • registrar@nihct.edu", 105, 27, { align: "center" });

  // Document Badge / Title
  doc.setFillColor(79, 70, 229); // indigo-600
  doc.roundedRect(15, 45, 180, 12, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("OFFICIAL PROOF OF COURSE ENROLLMENT & ACADEMIC CONFIRMATION", 105, 52.5, { align: "center" });

  // Metadata Row
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Document Reference: ${txn}`, 15, 64);
  doc.text(`Issue Date: ${dateStr}`, 105, 64, { align: "center" });
  doc.text("Term: Fall 2026 Academic Session", 195, 64, { align: "right" });

  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(15, 67, 195, 67);

  // Student Particulars Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(15, 72, 180, 36, 2, 2, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("STUDENT PARTICULARS (UNIVERSITY SIS RECORDS)", 20, 80);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text("Full Name:", 20, 88);
  doc.setFont("helvetica", "bold");
  doc.text(`${student.name}`, 55, 88);

  doc.setFont("helvetica", "normal");
  doc.text("Student ID:", 20, 95);
  doc.setFont("helvetica", "bold");
  doc.text(`${student.id}`, 55, 95);

  doc.setFont("helvetica", "normal");
  doc.text("Degree Program:", 20, 102);
  doc.setFont("helvetica", "bold");
  doc.text(`${student.program} (Sem ${student.semester})`, 55, 102);

  doc.setFont("helvetica", "normal");
  doc.text("Academic Standing:", 115, 88);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52); // green-800
  doc.text(`${student.academicStanding} (CGPA: ${student.cgpa})`, 155, 88);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text("Enrollment Status:", 115, 95);
  doc.setFont("helvetica", "bold");
  doc.text("Active • Cleared & Confirmed", 155, 95);

  doc.setFont("helvetica", "normal");
  doc.text("Student Email:", 115, 102);
  doc.setFont("helvetica", "bold");
  doc.text(`${student.email}`, 155, 102);

  // Enrolled Course Details Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 114, 180, 48, 2, 2, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ENROLLED COURSE SPECIFICATIONS", 20, 122);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  doc.text("Course Code & Title:", 20, 130);
  doc.setFont("helvetica", "bold");
  doc.text(`${course.code} — ${course.name}`, 65, 130);

  doc.setFont("helvetica", "normal");
  doc.text("Assigned Section:", 20, 137);
  doc.setFont("helvetica", "bold");
  doc.text(`${sec.sectionCode} (${sec.instructor})`, 65, 137);

  doc.setFont("helvetica", "normal");
  doc.text("Lecture Room & Campus:", 20, 144);
  doc.setFont("helvetica", "bold");
  doc.text(`${sec.room} • Main Campus`, 65, 144);

  doc.setFont("helvetica", "normal");
  doc.text("Class Schedule:", 20, 151);
  doc.setFont("helvetica", "bold");
  doc.text(`${schedStr}`, 65, 151);

  doc.setFont("helvetica", "normal");
  doc.text("Credit Units Earnable:", 20, 158);
  doc.setFont("helvetica", "bold");
  doc.text(`${course.credits} Credits (${course.type} Requirement)`, 65, 158);

  // Academic Confirmation & Tuition-Free Sponsorship Table
  doc.setFillColor(15, 23, 42);
  doc.rect(15, 169, 180, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("ACADEMIC ENROLLMENT SPECIFICATION", 20, 174.5);
  doc.text("TERMS / ACCESS", 120, 174.5);
  doc.text("FEES / COST", 190, 174.5, { align: "right" });

  let y = 184;
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  // Line 1: Course Tuition Status
  doc.text(`Academic Enrollment — ${course.code} (${course.credits} Credits)`, 20, y);
  doc.text("Tuition-Free Sponsorship", 120, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52); // green-800
  doc.text("FREE ($0.00)", 190, y, { align: "right" });
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  y += 7;

  // Line 2: Lab & Infrastructure
  doc.text("Instructional Laboratories & Computing Infrastructure", 20, y);
  doc.text("Full Access Granted", 120, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52);
  doc.text("FREE ($0.00)", 190, y, { align: "right" });
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  y += 7;

  // Line 3: Lifelong Access Privilege
  doc.text("Course Content Privileges (Lectures, Labs, Evaluation)", 20, y);
  doc.text("Lifelong Unlimited Access", 120, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52);
  doc.text("INCLUDED", 190, y, { align: "right" });
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  y += 9;

  // Divider
  doc.setDrawColor(203, 213, 225);
  doc.line(15, y, 195, y);
  y += 7;

  // Total Billed Notice (Zero Cost)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("TOTAL TUITION & REGISTRATION BALANCE DUE:", 20, y);
  doc.setTextColor(22, 101, 52);
  doc.text("$0.00 USD (100% TUITION-FREE SCHOLARSHIP)", 190, y, { align: "right" });
  y += 10;

  // Academic Clearance Stamp
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.setDrawColor(74, 222, 128); // emerald-400
  doc.roundedRect(15, y, 180, 18, 2, 2, "FD");

  doc.setTextColor(21, 128, 61); // emerald-700
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("STATUS: OFFICIAL ENROLLMENT CONFIRMED • 100% TUITION-FREE SCHOLARSHIP", 22, y + 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Authorized via University Registrar Gateway. Lifelong access granted. Transaction ID: ${txn}`, 22, y + 13);

  // Footer & Official Signatures
  y += 30;
  doc.setDrawColor(226, 232, 240);
  doc.line(20, y, 75, y);
  doc.line(135, y, 190, y);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text("Dr. Marcus Vance", 47.5, y + 5, { align: "center" });
  doc.text("Registrar of Student Affairs", 47.5, y + 9, { align: "center" });

  doc.text("University Academic Council", 162.5, y + 5, { align: "center" });
  doc.text("Dean of Academic Computing", 162.5, y + 9, { align: "center" });

  // Bottom Notice
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("This document is an electronically verified official statement of registration and academic sponsorship issued by the National Institute of Higher Computing & Technology. Valid without handwritten signature.", 105, 285, { align: "center" });

  // Trigger Download
  doc.save(`Proof_of_Enrollment_Bill_${course.code}_${student.id}.pdf`);
}

/**
 * Generates an official Certificate of Academic Completion in PDF format.
 */
export function generateCertificatePdf(cert: CourseCertificate): void {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Page Dimensions: 297mm x 210mm
  // Outer Elegant Gold Border
  doc.setDrawColor(202, 138, 4); // gold-600
  doc.setLineWidth(2);
  doc.rect(10, 10, 277, 190);

  // Inner Thin Border
  doc.setDrawColor(234, 179, 8); // gold-500
  doc.setLineWidth(0.5);
  doc.rect(13, 13, 271, 184);

  // Header Banner
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("NATIONAL INSTITUTE OF HIGHER COMPUTING & TECHNOLOGY", 148.5, 30, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING • FACULTY OF ADVANCED COMPUTING", 148.5, 37, { align: "center" });

  // Gold Star Badge Icon
  doc.setTextColor(202, 138, 4);
  doc.setFontSize(14);
  doc.text("★ ★ ★ ★ ★", 148.5, 45, { align: "center" });

  // Main Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(30, 27, 75); // indigo-950
  doc.text("CERTIFICATE OF ACADEMIC COMPLETION", 148.5, 60, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text("This prestigious academic credential is formally awarded to", 148.5, 72, { align: "center" });

  // Recipient Student Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(67, 56, 202); // indigo-700
  doc.text(cert.studentName.toUpperCase(), 148.5, 87, { align: "center" });

  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.8);
  doc.line(65, 91, 232, 91);

  // Course Description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11.5);
  doc.setTextColor(51, 65, 85);
  doc.text("for successfully mastering all curriculum lectures, interactive lab modules, and formal evaluations for:", 148.5, 102, { align: "center" });

  // Course Name & Code
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text(`${cert.courseCode} — ${cert.courseName}`, 148.5, 114, { align: "center" });

  // Academic Standing & Credits
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Academic Credits Earned: ${cert.credits} Semester Units   |   Final Grade: ${cert.grade}   |   Honors: ${cert.honors}`, 148.5, 123, { align: "center" });

  // Final Assessment Quiz Score
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(22, 101, 52); // emerald-800
  doc.text(`Final Assessment Score: ${cert.quizScore ?? 18} / ${cert.quizMaxScore ?? 20} Marks (Passed • Passing Criterion: 12/20 Satisfied)`, 148.5, 131, { align: "center" });

  // Date and Certificate ID
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Awarded on this day: ${cert.completionDate}   •   Verification ID: ${cert.certificateId}`, 148.5, 138, { align: "center" });

  // Signatures
  const sigY = 162;
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);

  doc.line(35, sigY, 95, sigY);
  doc.line(202, sigY, 262, sigY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(cert.instructorName, 65, sigY + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Lead Professor & Course Instructor", 65, sigY + 9, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("Prof. Victoria Sterling, Ph.D.", 232, sigY + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Dean of Academic Affairs & Registrar", 232, sigY + 9, { align: "center" });

  // Gold Seal in Center
  doc.setFillColor(254, 240, 138); // yellow-200
  doc.setDrawColor(202, 138, 4); // gold
  doc.circle(148.5, sigY + 4, 13, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(161, 98, 7);
  doc.text("OFFICIAL SEAL", 148.5, sigY + 3, { align: "center" });
  doc.text("NIHCT 2026", 148.5, sigY + 7, { align: "center" });

  // Bottom Verification Code
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Digital Verification Hash: ${cert.verificationCode} • Verify at https://registry.nihct.edu/verify/${cert.certificateId}`, 148.5, 196, { align: "center" });

  // Trigger Download
  doc.save(`Certificate_Completion_${cert.courseCode}_${cert.studentId}.pdf`);
}
