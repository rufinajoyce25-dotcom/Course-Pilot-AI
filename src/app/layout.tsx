import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoursePilot AI — Real-Time AI Course Registration & Academic Agent",
  description: "Plan Smarter. Learn Further. Autonomous academic agent for course registration, eligibility checks, prerequisite validation, and timetable optimization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f3f6fc] text-[#0f172a] min-h-screen">
        {children}
      </body>
    </html>
  );
}

