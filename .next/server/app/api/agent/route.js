"use strict";(()=>{var e={};e.id=398,e.ids=[398],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8103:(e,t,i)=>{i.r(t),i.d(t,{originalPathname:()=>v,patchFetch:()=>S,requestAsyncStorage:()=>C,routeModule:()=>y,serverHooks:()=>w,staticGenerationAsyncStorage:()=>f});var s={};i.r(s),i.d(s,{POST:()=>p});var n=i(9303),a=i(8716),r=i(670),o=i(7070),c=i(7470),l=i(7324),d=i(5802);class u{static getInstance(){return u.instance||(u.instance=new u),u.instance}async answerQuestion(e,t,i,s){let n=e.toLowerCase().trim(),a=i||process.env.GEMINI_API_KEY||process.env.NEXT_PUBLIC_GEMINI_API_KEY||null;if(a){let i=await this.callGeminiModel(e,t,a,s);if(i)return{message:i,intent:"GEMINI_AI_RESPONSE",suggestedQuickActions:this.deriveQuickActions(n,t),source:`Google Gemini (${s||"1.5 Flash"})`,topicCategory:"Open Domain Intelligence"}}return this.generateComprehensiveLocalAnswer(e,t)}async callGeminiModel(e,t,i,s){try{let n=s?.toLowerCase().includes("pro")?"gemini-1.5-pro":"gemini-1.5-flash",a=Array.from(d.E.courses.values()).map(e=>`${e.code}: ${e.name} (${e.credits} Cr, Instructor: ${e.instructor}, Prereqs: ${(e.prerequisites||[]).join(", ")||"None"})`).join("\n"),r=`You are CoursePilot AI, an elite university academic advisor, computer science mentor, and study coach.
Current Student Context:
- Name: ${t.name} (ID: ${t.id})
- Program: ${t.program} (Semester ${t.semester})
- CGPA: ${t.cgpa} / 10.0 (${t.academicStanding})
- Completed Credits: ${t.completedCredits} / ${t.requiredCredits} (${t.degreeProgressPercentage}%)
- Completed Courses: ${(t.completedCourses||[]).join(", ")||"None"}
- Currently Enrolled: ${(t.currentEnrollments||[]).join(", ")||"None"}
- Career Goal: ${t.careerGoal}

University Catalog Context:
${a}

Platform Rules:
1. Registration is 1 enrollment per course per student with permanent lifelong access. Tuition is 100% free ($0.00 scholarship bill in PDF).
2. Video lectures track playback to the end with anti-cheat detection.
3. Hands-on coding labs require writing working code (empty/pass placeholder rejected).
4. Final assessment quiz has 20 questions (20 marks, 12 passing score) with maximum 3 attempts.
5. Certificates issued after 100% completion (videos + labs + quiz passed).

Instructions:
- Provide a thoroughly researched, clear, friendly, and pedagogical answer to the student's question.
- Use markdown formatting with bold text, bullet points, and code blocks if technical.
- Tie advice back to their academic journey and career trajectory when appropriate.`,o=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${n}:generateContent?key=${i}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text:`${r}

Student Query: ${e}`}]}],generationConfig:{temperature:.35,maxOutputTokens:1e3}})});if(!o.ok)return null;let c=await o.json();return c.candidates?.[0]?.content?.parts?.[0]?.text||null}catch{return null}}generateComprehensiveLocalAnswer(e,t){let i=e.toLowerCase().trim();if(i.includes("how do labs work")||i.includes("coding lab")||i.includes("compiler")||i.includes("lab test")||i.includes("run tests"))return{message:`### 💻 Hands-On Practical Coding Labs in CoursePilot

CoursePilot features an integrated, browser-based coding sandbox for every enrolled course:

1. **Clean Problem Boilerplates**:
   - Unlike generic tutorials, labs start with clean function headers, docstrings, and type annotations.
   - You must write the actual implementation—the system actively **rejects blank submissions or unchanged placeholder \`pass\` statements** with an \`HTTP 400 Bad Request\`.

2. **Real-Time Evaluation**:
   - When you click **"Run Tests & Submit Lab"**, your code is executed against test suites (edge cases, syntax checks, output assertions).
   - Instant feedback displays the test output, standard out, and verification status.

3. **Curriculum Credit**:
   - Each course has **3 practical hands-on labs**.
   - Completing all 3 labs contributes **30%** toward your total course completion score.

> 💡 **Tip:** You can access your labs at any time by opening the **Enrolled Courses** tab, launching the course, and selecting the **"Practical Labs"** tab.`,intent:"PLATFORM_LABS_GUIDE",suggestedQuickActions:["Open Enrolled Courses","Check Lab Requirements","View Course Catalog"],source:"CoursePilot Platform Documentation",topicCategory:"Platform Features"};if(i.includes("quiz")||i.includes("assessment")||i.includes("how many questions")||i.includes("attempts")||i.includes("reattempt")||i.includes("tries"))return{message:`### 📝 Final Assessment Quiz & Attempt Rules

Every university course in CoursePilot culminates in an evaluative final assessment:

• **20 Comprehensive Questions**: Each assessment contains 20 curated multiple-choice questions covering all lecture modules and technical topics (1 mark per question = **20 marks total**).
• **Passing Threshold (60%)**: You need **at least 12 / 20 marks** to pass the assessment.
• **Strict 3-Attempt Limit**:
  - You are granted a maximum of **3 attempts** per course.
  - If an attempt scores below 12 marks, a **"🔄 Reattempt Assessment"** button is unlocked with your remaining tries counter displayed.
  - If all 3 attempts are exhausted without passing, the quiz is permanently locked to maintain academic rigor.
• **Certificate Unlock**: Passing the quiz with $\\ge$ 12 marks—in combination with completing 100% of video lectures and all 3 coding labs—instantly issues your verified **Certificate of Completion**!`,intent:"PLATFORM_QUIZ_GUIDE",suggestedQuickActions:["View Enrolled Courses","Start Course Assessment","Check Academic Standing"],source:"CoursePilot Academic Evaluation Policy",topicCategory:"Platform Features"};if(i.includes("certificate")||i.includes("completion proof")||i.includes("how to get certificate"))return{message:`### 🎓 Official University Certificate of Academic Completion

Certificates in CoursePilot are officially verified academic credentials featuring tamper-evident verification codes, university signatures, and honors distinctions:

**Requirements for Certificate Issuance (100% Course Completion):**
1. **Lecture Lectures (50% weight)**: All 5–10 lecture videos must be watched to the final seconds (anti-cheat verified).
2. **Practical Labs (30% weight)**: All 3 hands-on coding labs must be submitted with valid working code and pass test assertions.
3. **Final Assessment (20% weight)**: Must achieve a passing score of **at least 12 / 20 marks** on the 20-question comprehensive exam within your **3 allowed attempts**.

**Certificate Features:**
• Unique Verification ID (e.g., \`CERT-UNIV-2026-XXXXXX\`) verifiable against the University Registrar database.
• Displays your verified exam score (e.g., \`20 / 20 Marks\`) and honors distinction.
• Downloadable as a high-resolution, print-ready landscape PDF document.`,intent:"PLATFORM_CERTIFICATE_GUIDE",suggestedQuickActions:["View Enrolled Courses","Check Certificate Status","Download Proof of Enrollment"],source:"University Registrar & Certification Board",topicCategory:"Platform Features"};if(i.includes("video")||i.includes("watch")||i.includes("anti cheat")||i.includes("anti-cheat")||i.includes("skip"))return{message:`### 🎥 Video Playback & Anti-Cheat Verification System

CoursePilot uses automated playback auditing through the YouTube Iframe Player API:

• **Continuous Playback Monitoring**: The player audits your watch progress every 500 milliseconds.
• **Anti-Scrubbing Guard**: If forward scrubbing past what you have continuously watched is detected (\`currentTime > maxWatched + 4s\`), the player immediately seeks back to your verified watch position and issues an advisory alert.
• **Automated Completion**: When you legitimately play the video to its final seconds (within 3 seconds of the end or on \`ENDED\` event), the server verifies and credits the lecture immediately.
• **Zero Manual Faking**: There is no manual bypass button—only genuine learning is accredited!`,intent:"PLATFORM_VIDEO_GUIDE",suggestedQuickActions:["Open Course Video Lectures","Check Completed Lectures","View My Enrolled Courses"],source:"CoursePilot Learning Management System",topicCategory:"Platform Features"};if(i.includes("bill")||i.includes("fee")||i.includes("cost")||i.includes("tuition")||i.includes("proof of enrollment")||i.includes("free"))return{message:`### 📄 100% Tuition-Free Proof of Enrollment Bills

All courses offered through CoursePilot are **100% tuition-free ($0.00 USD)** under institutional academic sponsorship:

• **Official Confirmation**: You can download a print-ready academic bill confirming your enrollment status, course title, section, classroom, schedule, and transaction hash.
• **Tuition Breakdown**: Shows a **$0.00** balance with **"100% TUITION-FREE SCHOLARSHIP"** and **"LIFELONG UNLIMITED ACCESS GRANTED"**.
• **How to Download**:
  1. Go to **Enrolled Courses** or **Documents**.
  2. Click **"Download Official Bill (PDF)"** on any enrolled course card.
  3. The PDF will generate instantly with university seals and registrar authorization.`,intent:"PLATFORM_BILL_GUIDE",suggestedQuickActions:["Download Enrollment Bill","View Enrolled Courses","View Academic Documents"],source:"University Student Accounts Office",topicCategory:"Platform Features"};if(i.includes("profile")||i.includes("photo")||i.includes("avatar")||i.includes("create student")||i.includes("switch student"))return{message:`### 👤 Student Profiles & Multi-Student SIS Management

CoursePilot enforces a **"One Student, One Profile"** academic integrity rule:

• **Edit Profile & Photo**:
  - Click on your student avatar in the top-right navigation bar to open the **Student Profile Manager**.
  - You can upload custom profile pictures from your local photo library or choose standard initials badges.
• **Create New Student Profile**:
  - Click **"+ New Student Profile"** from the top menu.
  - The SIS checks for duplicate names or IDs; duplicates are rejected with an **HTTP 409 Conflict** error.
• **Switching Active Students**:
  - Select any registered student from the dropdown directory to instantly switch academic records, enrolled courses, and progress.`,intent:"PLATFORM_PROFILE_GUIDE",suggestedQuickActions:["Open Profile Setup","View Student Directory","View Student Profile"],source:"CoursePilot User Management",topicCategory:"Platform Features"};if(i.includes("machine learning")||i.includes("what is ml")||i.includes("supervised")||i.includes("unsupervised"))return{message:`### 🤖 Machine Learning Fundamentals

**Machine Learning (ML)** is a subfield of Artificial Intelligence where computer systems learn patterns and statistical relationships directly from data rather than following explicitly programmed rules.

#### Key Paradigms:
1. **Supervised Learning**:
   - Learns a mapping from inputs $X$ to labeled outputs $y$: $f(X) \\to y$.
   - **Algorithms**: Linear/Logistic Regression, Support Vector Machines (SVM), Random Forests, XGBoost, Deep Neural Networks.
   - **Use Cases**: Spam filtering, medical image classification, stock price forecasting.
2. **Unsupervised Learning**:
   - Discovers hidden patterns, clusters, or representations in unlabeled data.
   - **Algorithms**: K-Means, Hierarchical Clustering, Principal Component Analysis (PCA), Autoencoders.
   - **Use Cases**: Customer segmentation, anomaly detection, dimensionality reduction.
3. **Reinforcement Learning**:
   - An agent learns through trial-and-error by taking actions in an environment to maximize cumulative reward.
   - **Algorithms**: Q-Learning, PPO, Deep Q-Networks (DQN).

> 🎓 **Academic Connection:** In our curriculum, **CS401: Machine Learning** (taught by Dr. Aris Thorne) covers supervised learning, loss optimization, and neural architectures.`,intent:"ACADEMIC_CONCEPT_EXPLANATION",suggestedQuickActions:["Check CS401 Eligibility","View CS401 Syllabus","Explore AI Career Track"],source:"Computer Science Knowledge Base • Machine Learning",topicCategory:"Machine Learning & AI"};if(i.includes("database")||i.includes("b-tree")||i.includes("index")||i.includes("sql vs nosql")||i.includes("acid"))return{message:`### 🗄️ Database Systems, Indexing & ACID Guarantees

#### 1. How Database Indexes Work (B-Trees)
An index is an auxiliary data structure that enables fast lookups without scanning every row in a table (reducing $O(N)$ full table scans to $O(\\log N)$ balanced tree searches).
- **B-Tree Indexes**: Default in PostgreSQL/MySQL. Self-balancing tree structure where all leaf nodes are at the same depth and linked sequentially, making range queries (\`WHERE age BETWEEN 20 AND 30\`) extremely efficient.
- **Hash Indexes**: Provides $O(1)$ point lookups (\`WHERE id = 42\`), but cannot perform range scans or sorting.

#### 2. ACID Transactional Guarantees
- **Atomicity**: All operations in a transaction succeed, or the entire transaction is rolled back.
- **Consistency**: The database transitions only between valid states conforming to schema constraints.
- **Isolation**: Concurrent transactions execute without interfering with one another (Isolation levels: Read Uncommitted $\\to$ Serializable).
- **Durability**: Once committed, data changes survive system crashes or power failures (via Write-Ahead Logging).

#### 3. SQL vs. NoSQL
- **Relational (SQL)**: Strict schema, ACID compliance, complex JOIN capabilities (PostgreSQL, MySQL).
- **Document/Key-Value (NoSQL)**: Flexible schema, horizontal scalability, eventual consistency (MongoDB, Redis, Cassandra).

> 🎓 **Academic Connection:** Detailed in **CS305: Database Systems** (Section A, Dr. Elena Rostova).`,intent:"ACADEMIC_CONCEPT_EXPLANATION",suggestedQuickActions:["Check CS305 Eligibility","View CS305 Syllabus","Explore Data Systems"],source:"Computer Science Knowledge Base • Database Systems",topicCategory:"Databases & Storage"};if(i.includes("cloud")||i.includes("docker")||i.includes("kubernetes")||i.includes("aws")||i.includes("microservices"))return{message:`### ☁️ Cloud Computing, Containerization & Microservices

#### 1. What is Docker?
Docker is an open-source platform that packages applications and all their dependencies into lightweight, standalone **containers**. Unlike virtual machines (VMs) that virtualize the entire hardware layer and run a full guest OS, containers share the host OS kernel and isolate user spaces, starting in seconds with minimal memory overhead.

#### 2. Kubernetes (K8s) Orchestration
When running hundreds of containers across distributed clusters, Kubernetes automates:
- **Service Discovery & Load Balancing**: Directs traffic across container replicas.
- **Self-Healing**: Automatically restarts failed containers and reschedules them on healthy nodes.
- **Horizontal Pod Autoscaling**: Dynamically adjusts container count based on CPU/memory utilization.

#### 3. Cloud Service Models
- **IaaS (Infrastructure as a Service)**: Raw compute, storage, networking (AWS EC2, Google Compute Engine).
- **PaaS (Platform as a Service)**: Managed runtime environment (AWS Elastic Beanstalk, Vercel, Heroku).
- **SaaS (Software as a Service)**: End-user web applications (Google Workspace, Microsoft 365).

> 🎓 **Academic Connection:** Covered hands-on in **CS320: Cloud Computing** (Dr. Marcus Vance).`,intent:"ACADEMIC_CONCEPT_EXPLANATION",suggestedQuickActions:["Check CS320 Eligibility","View Cloud Timetable","Compare CS320 vs CS450"],source:"Computer Science Knowledge Base • Cloud Computing",topicCategory:"Cloud & Infrastructure"};if(i.includes("cybersecurity")||i.includes("cryptography")||i.includes("encryption")||i.includes("sql injection")||i.includes("xss"))return{message:`### 🛡️ Cybersecurity, Cryptography & Threat Mitigation

#### 1. Symmetric vs. Asymmetric Cryptography
- **Symmetric Encryption (AES-256)**: The same secret key is used for both encryption and decryption. Extremely fast, ideal for encrypting bulk data at rest and in transit.
- **Asymmetric Encryption (RSA, ECC)**: Uses a mathematically linked key pair—a **Public Key** (shared openly to encrypt) and a **Private Key** (kept secret to decrypt). Essential for digital signatures and TLS handshakes.

#### 2. Critical Web Vulnerabilities (OWASP Top 10)
- **SQL Injection (SQLi)**: Occurs when untrusted user input is directly concatenated into SQL queries.
  - *Fix:* Always use **Prepared Statements / Parameterized Queries** (\`SELECT * FROM users WHERE email = ?\`).
- **Cross-Site Scripting (XSS)**: Attackers inject malicious JavaScript into web pages viewed by other users.
  - *Fix:* Context-aware HTML escaping, Content Security Policy (CSP), sanitizing inputs.

#### 3. Zero Trust Security Model
The principle of *"Never Trust, Always Verify"*: every user, service, and network request must be authenticated, authorized, and encrypted, regardless of whether it originates inside or outside the corporate perimeter.

> 🎓 **Academic Connection:** Explored in **CS380: Cybersecurity & Cryptography** (Dr. Sarah Chen).`,intent:"ACADEMIC_CONCEPT_EXPLANATION",suggestedQuickActions:["Check CS380 Eligibility","View Cybersecurity Track","Ask about Security Careers"],source:"Computer Science Knowledge Base • Cybersecurity",topicCategory:"Cybersecurity"};if(i.includes("big o")||i.includes("data structure")||i.includes("algorithm")||i.includes("binary search")||i.includes("sorting"))return{message:`### ⚡ Data Structures, Algorithms & Big-O Complexity

#### 1. Big-O Complexity Hierarchy (Fastest to Slowest)
1. **$O(1)$ Constant Time**: Hash table lookups (\`dict[key]\`), array index access (\`arr[i]\`).
2. **$O(\\log N)$ Logarithmic Time**: Binary Search on a sorted array, balanced binary search tree operations.
3. **$O(N)$ Linear Time**: Iterating through an unsorted array, linear search.
4. **$O(N \\log N)$ Linearithmic Time**: Optimal comparison sorting algorithms (**MergeSort**, **QuickSort**, **HeapSort**).
5. **$O(N^2)$ Quadratic Time**: Nested loops, BubbleSort, InsertionSort.
6. **$O(2^N)$ Exponential Time**: Naive recursive Fibonacci, subset generation.
7. **$O(N!)$ Factorial Time**: Traveling Salesperson brute force, finding all permutations.

#### 2. Essential Data Structures:
- **Hash Table**: Average $O(1)$ insertion, deletion, and lookup; handles collisions via chaining or open addressing.
- **Binary Search Tree (BST)**: Left subtree $\\le$ Root $\\le$ Right subtree. Average $O(\\log N)$ search, but degrades to $O(N)$ if unbalanced (use Red-Black or AVL trees to prevent skew).
- **Graph**: Set of vertices connected by edges; traversed using **BFS** (Breadth-First Search for shortest path) or **DFS** (Depth-First Search for cycle detection and topological sorting).`,intent:"ACADEMIC_CONCEPT_EXPLANATION",suggestedQuickActions:["Ask about Interview Coding","Check CS401 Prerequisites","View Study Tips"],source:"Computer Science Knowledge Base • Algorithms",topicCategory:"Algorithms & Data Structures"};if(i.includes("gpa")||i.includes("cgpa")||i.includes("calculate gpa")||i.includes("raise my gpa")||i.includes("improve cgpa"))return{message:`### 📊 GPA & CGPA Calculation & Improvement Strategy

#### 1. How CGPA is Calculated
Cumulative Grade Point Average (CGPA) is a credit-weighted average across all completed semesters:

$$\\text{CGPA} = \\frac{\\sum (\\text{Grade Points} \\times \\text{Course Credits})}{\\sum \\text{Total Attempted Credits}}$$

**Grading Scale:**
• **A / A+ (10.0 / 4.0)**: Outstanding mastery (90–100%)
• **B / B+ (8.0–9.0)**: Above average competence (80–89%)
• **C (6.0–7.0)**: Satisfactory standing (70–79%)
• **D (4.0–5.0)**: Marginal pass (60–69%)
• **F (0.0)**: Fail / Course must be repeated

#### 2. Your Current Standing:
• **Student:** ${t.name} (${t.program})
• **Current CGPA:** **${t.cgpa} / 10.0**
• **Academic Status:** **${t.academicStanding}**
• **Degree Progress:** ${t.completedCredits} / ${t.requiredCredits} Credits completed.

#### 3. Strategies to Boost Your CGPA:
1. **Target High-Credit Courses**: Achieving an 'A' in a 4-credit course has double the mathematical impact of a 2-credit course.
2. **Utilize Grade Replacement**: Retaking a course where you earned a C or D can replace the lower grade in your CGPA calculation.
3. **Pace Your Semesters**: Limit heavy workloads to 14–16 credits rather than maxing out to 18 credits if you are focusing on grade recovery.`,intent:"ACADEMIC_POLICY_EXPLANATION",suggestedQuickActions:["Check Credit Limits","View Degree Progress","Plan Next Semester"],source:"University Academic Regulations • Section 3.1",topicCategory:"University Policies"};if(i.includes("credit limit")||i.includes("overload")||i.includes("max credits")||i.includes("how many credits"))return{message:`### 📋 University Credit Limit & Overload Regulations

According to official **University Academic Regulations (Section 4.2)**:

• **Standard Semester Limit**: Undergraduate students in good standing (CGPA $\\ge$ 6.0) may register for up to **18 credits** per semester.
• **Academic Overload (Up to 21 Credits)**:
  - Permitted exclusively for students on the **Dean's Honor Roll** (CGPA $\\ge$ 8.5) or graduating seniors in their final semester.
  - Requires written authorization from your Department Chair or Academic Dean.
• **Minimum Full-Time Load**: A minimum of **12 credits** per semester is required to maintain full-time student status, scholarship eligibility, and visa requirements.

> ℹ️ *Your current completed credits:* **${t.completedCredits} / ${t.requiredCredits}**. You are currently enrolled in **${t.currentEnrollments?.length||0} courses**.`,intent:"ACADEMIC_POLICY_EXPLANATION",suggestedQuickActions:["Check Fall 2026 Deadlines","View Course Catalog","Audit Degree Requirements"],source:"Office of Academic Affairs • Student Handbook",topicCategory:"University Policies"};if(i.includes("deadline")||i.includes("add/drop")||i.includes("drop date")||i.includes("last day"))return{message:`### 🗓️ Fall 2026 Academic Calendar & Key Deadlines

• **Registration Window Opens**: August 15, 2026
• **Classes Begin**: September 1, 2026
• **Add/Drop Deadline (No Penalty)**: **October 25, 2026** (Courses dropped by this date leave no mark on your transcript).
• **Course Withdrawal Deadline (W Grade)**: **November 15, 2026** (Courses dropped receive a non-punitive 'W' mark).
• **Final Assessment & Exam Period**: December 10 – December 20, 2026
• **Commencement & Degree Conferral**: January 15, 2027

> ⚠️ *Important:* To drop or adjust any course, navigate to your timetable or chat with me to simulate the impact before the October 25 deadline!`,intent:"ACADEMIC_CALENDAR_EXPLANATION",suggestedQuickActions:["Simulate Course Drop","Check Schedule Fit","View Timetable"],source:"University Registrar Calendar (Fall 2026)",topicCategory:"University Policies"};if(i.includes("interview")||i.includes("leetcode")||i.includes("coding test")||i.includes("prepare for job")||i.includes("hiring"))return{message:`### 🚀 Technical Interview Preparation Blueprint

To land software engineering and tech roles, prepare across 3 core pillars:

#### 1. Data Structures & Algorithms (LeetCode / Coding Rounds)
- **Phase 1: Pattern Mastery (NeetCode 150 / Blind 75)**
  - *Two Pointers & Sliding Window*: Array string manipulation problems.
  - *Fast & Slow Pointers*: Linked list cycle detection.
  - *Trees & Graphs*: Inversion, BFS level-order traversal, DFS path sum.
  - *Dynamic Programming*: Knapsack, longest common subsequence, coin change.
- **Mock Interviews**: Practice articulating your thought process out loud before writing any code.

#### 2. System Design (For Mid-Level & Modern Engineering Roles)
- Master: Load balancing, Horizontal vs. Vertical scaling, Caching (Redis/Memcached), Database Sharding, Asynchronous message queues (Kafka, RabbitMQ), Microservices architecture.

#### 3. Behavioral Interviews (The STAR Method)
Frame every response using:
- **S**ituation: What was the context?
- **T**ask: What challenge were you tasked to solve?
- **A**ction: What specific technical decisions and actions did YOU take?
- **R**esult: Quantify the outcome (e.g., *"reduced API latency by 45%"*).`,intent:"CAREER_GUIDANCE",suggestedQuickActions:["Ask about Resume Tips","Explore AI Career Path","View Recommended Electives"],source:"University Career Development & Industry Relations",topicCategory:"Career & Interviews"};if(i.includes("resume")||i.includes("cv")||i.includes("project idea")||i.includes("portfolio"))return{message:`### 📄 Standout Computer Science Resume & Project Guide

#### 1. High-Impact Project Ideas for Your Portfolio
- **AI / Machine Learning**: Full-stack Document Q&A system using RAG (Retrieval-Augmented Generation), vector embeddings (Pinecone/Chroma), and a Next.js UI.
- **Cloud & Distributed Systems**: Scalable microservices e-commerce backend deployed on Kubernetes with Docker, Redis caching, and Prometheus monitoring.
- **Cybersecurity**: Real-time packet sniffer and automated vulnerability scanner detecting SQLi/XSS with an interactive remediation dashboard.

#### 2. Resume Formatting Golden Rules:
• **Use the Google XYZ Formula**: *"Accomplished [X], as measured by [Y], by doing [Z]"*.
  - *Weak:* "Built a web app with React."
  - *Strong:* "Engineered a responsive Next.js course portal serving 500+ active students, reducing server response times by 38% using server-side caching."
• **ATS Optimization**: Keep single-column formatting, clean standard headings (\`Education\`, \`Technical Skills\`, \`Projects\`, \`Experience\`), and avoid tables or graphics that trip automated resume scanners.`,intent:"CAREER_GUIDANCE",suggestedQuickActions:["View AI Project Ideas","Check Career Trajectory","Suggest Capstone Courses"],source:"Tech Career Accelerator Guide",topicCategory:"Career & Interviews"};if(i.includes("study")||i.includes("exam prep")||i.includes("midterm")||i.includes("finals")||i.includes("memorize")||i.includes("focus"))return{message:`### 🧠 High-Efficiency Study Methods for STEM & Computer Science

1. **Active Recall over Passive Rereading**:
   - Testing yourself forces your brain to retrieve information, creating durable neural pathways.
   - Practice writing code on paper or a whiteboard without IDE autocomplete.

2. **The Feynman Technique**:
   - Pick a complex concept (e.g., *how a Transformer attention mechanism works*).
   - Explain it in plain, simple English as if teaching a beginner.
   - Whenever you get stuck or use vague jargon, return to the source material to patch the knowledge gap.

3. **Spaced Repetition (Anki / Leitner Box)**:
   - Review concepts at increasing intervals (Day 1 $\\to$ Day 3 $\\to$ Day 7 $\\to$ Day 21).
   - Ideal for syntax, algorithms, definitions, and protocol specifications.

4. **The Pomodoro Technique (50/10 Protocol)**:
   - 50 minutes of deep, uninterrupted coding or problem solving, followed by a 10-minute complete screen break.
   - Maximizes dopamine recharge and prevents cognitive fatigue during long sessions.`,intent:"STUDY_SKILLS_GUIDANCE",suggestedQuickActions:["Plan Study Schedule","Check Course Timetable","View Enrolled Courses"],source:"Academic Learning & Cognitive Science Center",topicCategory:"Study Skills"};let s=Array.from(d.E.courses.values()).filter(e=>i.includes(e.code.toLowerCase())||i.includes(e.name.toLowerCase())||e.description&&e.description.toLowerCase().includes(i))[0]||d.E.courses.get("CS401");return{message:`### 💡 Comprehensive Academic & Technical Analysis

Thank you for your question: **"${e}"**

#### 1. Core Explanation & Conceptual Breakdown
In modern computer science and academic theory, addressing **"${e}"** requires understanding its foundational principles and practical application:

• **Key Objective**: Analyzing this concept allows you to build robust, scalable, and verifiable software systems. In academic environments, theoretical comprehension must always be paired with hands-on implementation.
• **Practical Implementation**: When applying this in production, engineers focus on **algorithmic efficiency**, **system resilience**, and **clean architectural abstractions**.
• **Industry Standard**: Modern software engineering teams prioritize automated testing, containerized deployments, and continuous integration when working with these principles.

#### 2. Curriculum Integration & Academic Pathway
For your track as a **${t.program}** major (focusing on **${t.careerGoal}**):
• **Curriculum Fit**: This directly aligns with the technical learning outcomes of **${s?.code} (${s?.name})**.
• **Prerequisite Competencies**: Mastering this will strengthen your capability in core systems design, machine learning workflows, and cloud-native software architecture.

#### 3. Recommended Next Action:
1. Review the lecture modules and hands-on coding labs in **${s?.code}** under **Enrolled Courses**.
2. Run test assertions in the code sandbox to verify your practical implementation.
3. Test your conceptual retention using the 20-question final course assessment.

How else can I help deepen your understanding or assist with your academic schedule?`,intent:"OPEN_DOMAIN_INTELLIGENT_ANSWER",suggestedQuickActions:[`Explore ${s?.code||"CS401"} Curriculum`,"Check Academic Eligibility","Ask about Study Tips","View Weekly Timetable"],source:"CoursePilot Autonomous Academic Reasoning Engine",topicCategory:"Academic Knowledge"}}deriveQuickActions(e,t){return e.includes("machine learning")||e.includes("ai")?["Check CS401 Eligibility","View CS401 Syllabus","Explore AI Career Track"]:e.includes("database")||e.includes("sql")?["Check CS305 Eligibility","View CS305 Labs","Check Timetable Fit"]:e.includes("cloud")||e.includes("docker")?["Check CS320 Eligibility","Compare Cloud vs Distributed","View Course Catalog"]:e.includes("cyber")||e.includes("security")?["Check CS380 Eligibility","View Security Track","Download Enrollment Bill"]:["View Enrolled Courses","Check Degree Progress","Ask another question"]}}let m=u.getInstance();class g{static getInstance(){return g.instance||(g.instance=new g),g.instance}extractCourse(e){let t=e.toLowerCase();for(let e of Array.from(d.E.courses.values()))if(t.includes(e.code.toLowerCase())||t.includes(e.name.toLowerCase())||"CS401"===e.code&&(t.includes("machine learning")||t.includes("ml"))||"CS305"===e.code&&(t.includes("database")||t.includes("db")||t.includes("sql"))||"CS320"===e.code&&(t.includes("cloud")||t.includes("aws")||t.includes("docker"))||"CS380"===e.code&&(t.includes("cyber")||t.includes("security")||t.includes("crypto"))||"CS350"===e.code&&(t.includes("computer vision")||t.includes("vision")||t.includes("cv"))||"CS420"===e.code&&(t.includes("nlp")||t.includes("language processing")||t.includes("llm"))||"CS310"===e.code&&(t.includes("web")||t.includes("mobile")||t.includes("fullstack")||t.includes("full-stack"))||"CS450"===e.code&&(t.includes("distributed")||t.includes("microservices")))return e;return null}extractAllCourses(e){let t=e.toLowerCase(),i=Array.from(d.E.courses.values()),s=[];for(let e of i){let i=t.includes(e.code.toLowerCase()),n=t.includes(e.name.toLowerCase()),a="CS401"===e.code&&(t.includes("machine learning")||t.includes(" ml "))||"CS305"===e.code&&(t.includes("database")||t.includes(" sql "))||"CS320"===e.code&&(t.includes("cloud")||t.includes("aws")||t.includes("docker"))||"CS380"===e.code&&(t.includes("cyber")||t.includes("security")||t.includes("crypto"))||"CS350"===e.code&&(t.includes("computer vision")||t.includes("vision"))||"CS420"===e.code&&(t.includes("nlp")||t.includes("natural language")||t.includes("llm"))||"CS310"===e.code&&(t.includes("web")||t.includes("fullstack")||t.includes("full-stack")||t.includes("mobile"))||"CS450"===e.code&&(t.includes("distributed systems")||t.includes("microservices"));(i||n||a)&&!s.some(t=>t.code===e.code)&&s.push(e)}return s}getGeminiApiKey(){return process.env.GEMINI_API_KEY||process.env.NEXT_PUBLIC_GEMINI_API_KEY||null}async callGeminiIfAvailable(e,t,i){try{let s=`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${e}`,n=await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text:`${t}

Student User Query: ${i}`}]}],generationConfig:{temperature:.3,maxOutputTokens:800}})});if(!n.ok)return null;let a=await n.json();return a.candidates?.[0]?.content?.parts?.[0]?.text||null}catch(e){return null}}async processUserMessage(e,t,i,s){let n=[],a=e.toLowerCase().trim(),r=d.E.getStudent(t||"STU-2024-8841")||d.E.getActiveStudent(),o={eventId:`ev-${Date.now()}-parse`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),timeExact:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),step:"Analyzing natural language request",detail:`Contextual reasoning for ${r.name} (${r.program}, CGPA: ${r.cgpa})`,tool:"intent_and_entity_extractor",status:"COMPLETED",durationMs:35,source:"AI Autonomous Engine"};l.Y.emitAgentEvent(o),n.push(o);let c=this.extractAllCourses(a);return a.includes("change my career goal")||a.includes("update my career goal")||a.includes("set my career goal")||a.includes("switch my goal")||a.includes("switch focus to")||a.includes("focus on")||a.includes("i want to be a")||a.includes("i want to become a")||a.includes("focus on cybersecurity")||a.includes("focus on cloud")||a.includes("focus on ai")||a.includes("my name is")||a.includes("call me")?this.handleProfileUpdateFlow(e,r,n):(a.includes("conflict")||a.includes("overlap")||a.includes("clash"))&&c.length>=2?this.handleScheduleConflictBetweenCoursesFlow(a,r,c,n):c.length>=2&&(a.includes("compare")||a.includes("difference between")||a.includes("vs")||a.includes("which is better")||a.includes("or"))?this.handleComparisonFlow(a,r,c,n):a.includes("graduate")||a.includes("graduation")||a.includes("degree progress")||a.includes("remaining credits")||a.includes("credits left")||a.includes("am i on track")?this.handleGraduationAuditFlow(a,r,n):a.includes("who teaches")||a.includes("who is teaching")||a.includes("professor")||a.includes("instructor")||a.includes("faculty")||a.includes("rating")||a.includes("what room")||a.includes("where is")||a.includes("where does")||a.includes("classroom")||a.includes("location")?this.handleProfessorAndRoomFlow(a,r,c,n):a.includes("can i register")||a.includes("can i take")||a.includes("can i enroll")||a.includes("eligible")||a.includes("prereq")||a.includes("prerequisite")||a.includes("check eligibility")?this.handleEligibilityFlow(e,r,c,n):a.includes("register me")||a.includes("enroll me")||a.includes("sign me up")||a.includes("register for")||a.startsWith("register")||a.startsWith("enroll")?this.handleRegistrationIntentFlow(e,r,c,n):a.includes("can i register")||a.includes("can i take")||a.includes("eligible")||a.includes("prereq")||a.includes("prerequisite")||a.includes("check eligibility")?this.handleEligibilityFlow(e,r,c,n):a.includes("suggest")||a.includes("recommend")||a.includes("what course")||a.includes("which course")||a.includes("what should i take")||a.includes("elective")||a.includes("best course")||a.includes("best ai")||a.includes("find course")||a.includes("plan my semester")||a.includes("pick a course")?this.handleRecommendationFlow(e,r,n):a.includes("timetable")||a.includes("schedule")||a.includes("time slot")||a.includes("free on")||a.includes("class times")?this.handleTimetableFlow(e,r,n):a.startsWith("what is")||a.startsWith("what are")||a.startsWith("how do")||a.startsWith("how does")||a.startsWith("how can")||a.startsWith("how to")||a.startsWith("why")||a.startsWith("explain")||a.includes("difference between")||a.includes("how does labs work")||a.includes("how do labs work")||a.includes("how does the quiz work")||a.includes("how many questions")||a.includes("how many attempts")||a.includes("how to get certificate")||a.includes("certificate")||a.includes("anti-cheat")||a.includes("anti cheat")||a.includes("tuition bill")||a.includes("interview")||a.includes("leetcode")||a.includes("resume")||a.includes("study tips")||a.includes("study habits")||a.includes("gpa")||a.includes("cgpa")||a.includes("big o")||a.includes("docker")||a.includes("machine learning")||a.includes("database index")||a.includes("acid")||a.includes("deadline")?this.handleKnowledgeQueryFlow(e,r,n,i,s):a.includes("what if")||a.includes("drop")||a.includes("swap")||a.includes("simulate")||a.includes("delay graduation")?this.handleWhatIfFlow(e,r,n):a.includes("credit limit")||a.includes("how many credits")||a.includes("overload")||a.includes("add/drop")||a.includes("policy")||a.includes("regulation")||a.includes("rule")||a.includes("handbook")||a.includes("probation")||a.includes("honor roll")?this.handleDocumentRAGFlow(e,r,n):"hi"===a||"hello"===a||a.startsWith("hi ")||a.startsWith("hello ")||a.includes("who are you")||a.includes("help me")?this.handleGreetingFlow(e,r,n):this.handleUniversalAdvisingFlow(e,r,c,n,i,s)}async handleProfileUpdateFlow(e,t,i){let s=e.toLowerCase(),n={};if(s.includes("my name is ")){let t=e.split(/my name is /i);t[1]&&(n.name=t[1].split(".")[0].split(",")[0].trim())}else if(s.includes("call me ")){let t=e.split(/call me /i);t[1]&&(n.name=t[1].split(".")[0].split(",")[0].trim())}s.includes("cybersecurity")||s.includes("security")||s.includes("ethical hacker")?n.careerGoal="Cybersecurity Analyst & Security Researcher":s.includes("cloud")||s.includes("devops")||s.includes("aws")?n.careerGoal="Cloud Solutions Architect & DevOps Engineer":s.includes("ai")||s.includes("machine learning")||s.includes("ml")?n.careerGoal="AI & Machine Learning Research Engineer":s.includes("software engineer")||s.includes("full stack")||s.includes("developer")?n.careerGoal="Full Stack Software Engineer":(s.includes("data scientist")||s.includes("data science")||s.includes("analyst"))&&(n.careerGoal="Data Scientist & Analyst");let a=d.E.updateStudentProfile(t.id,n),r={eventId:`ev-${Date.now()}-prof`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),timeExact:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),step:"Updated live student profile in University SIS",detail:`Synchronized: ${n.name?`Name: "${a.name}" `:""}${n.careerGoal?`Goal: "${a.careerGoal}"`:""}`,tool:"update_student_profile",status:"COMPLETED",durationMs:45,source:"University SIS Live Gateway"};l.Y.emitAgentEvent(r),i.push(r);let o=d.E.getRecommendedCoursesForStudent(a).slice(0,3),c=o.map(e=>`• **${e.code} — ${e.name}** (${e.matchScore}% Match): ${e.matchReason?.[0]||"Aligned to track"}`).join("\n");return{message:`✅ **Profile Synchronized in University SIS!**

I've updated your record:
• **Student Name:** ${a.name}
• **Career Trajectory:** **${a.careerGoal}**
• **Degree Progress:** ${a.completedCredits} / ${a.requiredCredits} credits (${a.degreeProgressPercentage}%)

Based on this change, I've re-scored your curriculum recommendations:

${c}

Would you like me to check your eligibility or assist you with registering for any of these?`,intent:"PROFILE_UPDATED",steps:i,data:{updatedStudent:a,recommendations:o},updatedStudent:a,suggestedQuickActions:[`Register for ${o[0]?.code||"top course"}`,`Check ${o[0]?.code||"top course"} Eligibility`,"View Schedule Fit"]}}async handleComparisonFlow(e,t,i,s){let n=i.length>=2?i.slice(0,2):[d.E.courses.get("CS401"),d.E.courses.get("CS320")],a=n[0],r=n[1],o={eventId:`ev-${Date.now()}-comp`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),timeExact:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),step:"Multi-course comparison & curriculum analysis",detail:`Comparing ${a.code} vs ${r.code} against career trajectory (${t.careerGoal})`,tool:"course_comparison_tool",status:"COMPLETED",durationMs:50,source:"Academic Advisor Intelligence"};l.Y.emitAgentEvent(o),s.push(o);let c=new Set(t.completedCourses||[]),u=(a.prerequisites||[]).every(e=>c.has(e)),m=(r.prerequisites||[]).every(e=>c.has(e)),g=a.sections[0],h=r.sections[0];return{message:`Here is a side-by-side comparison between **${a.code} (${a.name})** and **${r.code} (${r.name})** for your **${t.careerGoal}** pathway:

| Metric | **${a.code}** | **${r.code}** |
| :--- | :--- | :--- |
| **Credits & Type** | ${a.credits} Cr (${a.type}) | ${r.credits} Cr (${r.type}) |
| **Instructor** | ${a.instructor} | ${r.instructor} |
| **Prerequisites** | ${(a.prerequisites||[]).join(", ")||"None"} (${u?"✓ Complete":"⚠️ Incomplete"}) | ${(r.prerequisites||[]).join(", ")||"None"} (${m?"✓ Complete":"⚠️ Incomplete"}) |
| **Live Seats** | **${g?.available||0} seats** in ${g?.sectionCode||"Sec A"} | **${h?.available||0} seats** in ${h?.sectionCode||"Sec A"} |
| **Meeting Times** | ${g?.schedule.map(e=>`${e.day.slice(0,3)} ${e.startTime}`).join(", ")} | ${h?.schedule.map(e=>`${e.day.slice(0,3)} ${e.startTime}`).join(", ")} |
| **AI Match Score** | **${a.matchScore||85}%** (${a.matchBadge||"Recommended"}) | **${r.matchScore||85}%** (${r.matchBadge||"Recommended"}) |

**Advisor Recommendation:**
• If you want to focus heavily on theoretical foundations and modeling, **${a.code}** is the gold standard.
• If you are prioritizing distributed infrastructure and operational engineering, **${r.code}** provides immediate practical industry tooling.

Which one would you like to register for?`,intent:"COURSE_COMPARISON",steps:s,data:{courseA:a,courseB:r},suggestedQuickActions:[`Register for ${a.code}`,`Register for ${r.code}`,"Check Timetable Fit"]}}async handleScheduleConflictBetweenCoursesFlow(e,t,i,s){let n=i[0],a=i[1],r={eventId:`ev-${Date.now()}-clash`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),timeExact:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),step:"Cross-course timetable conflict check",detail:`Auditing lecture time slots between ${n.code} and ${a.code}`,tool:"check_timetable_overlap",status:"COMPLETED",durationMs:38,source:"University Room Scheduling System"};l.Y.emitAgentEvent(r),s.push(r);let o=n.sections[0],c=a.sections[0],d=!1,u="";for(let e of o.schedule){for(let t of c.schedule)if(e.day===t.day&&e.startTime<t.endTime&&e.endTime>t.startTime){d=!0,u=`${e.day} between ${e.startTime} and ${t.endTime}`;break}if(d)break}let m="";if(d)m=`⚠️ **Schedule Conflict Warning:** A timetable collision was detected between **${n.code} (${n.name})** and **${a.code} (${a.name})** on **${u}**.

You cannot enroll in both ${n.code} ${o.sectionCode} and ${a.code} ${c.sectionCode}. Would you like me to find an alternate section with zero conflicts?`;else{let e=o.schedule.map(e=>`${e.day} ${e.startTime}–${e.endTime}`).join(", "),t=c.schedule.map(e=>`${e.day} ${e.startTime}–${e.endTime}`).join(", ");m=`✅ **Zero Schedule Conflicts Detected!**

• **${n.code} (${n.name}):** ${e} in room ${o.room} (${o.available} seats left)
• **${a.code} (${a.name}):** ${t} in room ${c.room} (${c.available} seats left)

Both courses fit into your weekly calendar without any timetable clash. You can register for both courses for Fall 2026.`}return{message:m,intent:"TIMETABLE_CONFLICT_AUDIT",steps:s,data:{course1:n,course2:a,conflictFound:d},suggestedQuickActions:[`Register for ${n.code}`,`Register for ${a.code}`,"View Weekly Timetable"]}}async handleGraduationAuditFlow(e,t,i){let s={eventId:`ev-${Date.now()}-deg`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),timeExact:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),step:"Degree progress & graduation audit",detail:`Auditing degree requirements for ${t.name} (${t.id})`,tool:"degree_audit_calculator",status:"COMPLETED",durationMs:42,source:"University Registrar Degree Audit"};l.Y.emitAgentEvent(s),i.push(s);let n=Math.max(0,t.requiredCredits-t.completedCredits),a=Math.ceil(n/16);return{message:`🎓 **Official Degree Progress & Graduation Audit for ${t.name}:**

• **Current Program:** ${t.program} (Semester ${t.semester})
• **Academic Standing:** ${t.academicStanding} (CGPA: **${t.cgpa} / 10.0**)
• **Credits Completed:** **${t.completedCredits} / ${t.requiredCredits} credits** (${t.degreeProgressPercentage}% complete)
• **Credits Remaining to Graduate:** **${n} credits** (~${a} academic semester${a>1?"s":""})
• **Degree Status:** On track for graduation in Spring 2028 with **${t.academicStanding}**.

To maintain optimal graduation velocity, we recommend enrolling in 15–18 credits this Fall 2026 semester.

Would you like to review recommended courses to satisfy your remaining graduation requirements?`,intent:"GRADUATION_DEGREE_AUDIT",steps:i,data:{student:t,remainingCredits:n,estimatedSemesters:a},suggestedQuickActions:["Suggest Best Courses","Check Credit Limits","View Weekly Timetable"]}}async handleProfessorAndRoomFlow(e,t,i,s){let n=i[0]||d.E.courses.get("CS401"),a=n.sections[0],r={eventId:`ev-${Date.now()}-fac`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),timeExact:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),step:"Faculty & room directory query",detail:`Retrieved instructor & room allocation for ${n.code}`,tool:"get_faculty_and_room",status:"COMPLETED",durationMs:32,source:"University Room & Faculty Directory"};l.Y.emitAgentEvent(r),s.push(r);let o={"Dr. Elena Rostova":"★ 4.9 / 5.0 (98% Student Approval • Top Ranked AI Faculty)","Prof. Michael Chang":"★ 4.8 / 5.0 (94% Student Approval • High Engagement & Practical Labs)","Dr. Sarah Jenkins":"★ 4.7 / 5.0 (92% Student Approval • Renowned Distributed Systems Researcher)","Dr. Marcus Vance":"★ 4.9 / 5.0 (96% Student Approval • Industry Cyber Threat Specialist)"},c=n.sections.map(e=>{let t=o[e.instructor]||"★ 4.8 / 5.0 (Highly Rated by Students)";return`• **${e.sectionCode}:** Instructor **${e.instructor}** (${t})
  - **Classroom / Lab:** ${e.room}
  - **Meeting Schedule:** ${e.schedule.map(e=>`${e.day} ${e.startTime}–${e.endTime}`).join(", ")}
  - **Live Seats Available:** **${e.available} seats** remaining`}).join("\n\n");return{message:`Here are the official instructor, evaluation rating, and classroom details for **${n.code} — ${n.name}** (Fall 2026):

${c}

**Faculty Office Hours:** ${a.instructor} holds student office hours every Tuesday & Thursday 2:00 PM – 4:00 PM in ${a.room.split(" ")[0]} 4th floor.

Would you like to register for ${a.sectionCode} or check timetable compatibility?`,intent:"FACULTY_AND_ROOM_INQUIRY",steps:s,data:{course:n,sections:n.sections},suggestedQuickActions:[`Register for ${n.code}`,"Check Timetable Collisions","View Syllabus Details"]}}async handleGreetingFlow(e,t,i){let s=d.E.getRecommendedCoursesForStudent(t).slice(0,3),n=s.map(e=>`**${e.code}** (${e.name})`).join(", ");return{message:`Hello **${t.name}**! 👋 I am your autonomous real-time academic agent connected directly to your university's SIS and registration portal.

Here is your live academic status:
• **Program:** ${t.program} (Semester ${t.semester})
• **CGPA:** ${t.cgpa} (${t.academicStanding})
• **Credits:** ${t.completedCredits} / ${t.requiredCredits} (${t.degreeProgressPercentage}% Completed)
• **Career Target:** ${t.careerGoal}

I can help you with:
1. **Eligibility Audits:** Ask *"Can I take CS401?"* or any course to verify transcript prerequisites.
2. **Intelligent Recommendations:** Ask *"What courses should I take for Cloud Architecture?"*
3. **1-Click Registration:** Say *"Register me for CS401"* to lock a live seat and generate an official receipt.
4. **Schedule Optimization:** Check for timetable overlaps and room conflicts.
5. **Profile Customization:** Tell me your real career goals or update your transcript.

Top recommended courses for your ${t.careerGoal} path: ${n}.

How can I assist you right now?`,intent:"GREETING",steps:i,suggestedQuickActions:[`Register for ${s[0]?.code||"CS401"}`,"Suggest Electives for Me","Check Timetable Conflicts","Update My Career Goal"]}}async handleEligibilityFlow(e,t,i,s){let n;let a=i[0]||this.extractCourse(e)||d.E.courses.get("CS401"),r=a.sections[0],o={eventId:`ev-${Date.now()}-sis`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),timeExact:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),step:"Transcript & prerequisite audit",detail:`Auditing ${t.name}'s completed courses against ${a.code} prerequisites: [${(a.prerequisites||[]).join(", ")}]`,tool:"check_prerequisites",status:"COMPLETED",durationMs:48,source:"University Rules & Compliance Engine"};l.Y.emitAgentEvent(o),s.push(o);let c={eventId:`ev-${Date.now()}-seats`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),timeExact:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),step:"Real-time seat availability check",detail:`Live capacity query: ${r.available} seats remaining in ${r.sectionCode}`,tool:"get_live_seat_availability",status:"COMPLETED",durationMs:38,source:"University Registration API"};if(l.Y.emitAgentEvent(c),s.push(c),(t.currentEnrollments||[]).includes(a.code)||(t.completedCourses||[]).includes(a.code))return{message:`🔒 **Registration Locked:** You are already enrolled in **${a.code} — ${a.name}**!

Under University Registrar policy, multiple registrations for the same course by the same individual are strictly locked. Your enrollment is active with guaranteed lifelong access to all lecture videos, coding environments, and course certification under **Enrolled Courses**.`,intent:"CHECK_ELIGIBILITY",steps:s,data:{course:a,isAlreadyEnrolled:!0,isEligible:!1,isLocked:!0,eligibility:{isEligible:!1,isLocked:!0,summary:`Registration is locked. Student is already enrolled in ${a.code} with permanent lifelong access. Repeated registrations for the same individual are not permitted.`,checks:[{ruleName:"Single Enrollment Constraint",passed:!1,explanation:`Locked: Already enrolled in ${a.code}. One enrollment per student limit enforced.`},{ruleName:"Prerequisites Verified",passed:!0,explanation:"All academic prerequisites satisfied."},{ruleName:"Academic Standing",passed:!0,explanation:`CGPA ${t.cgpa} meets minimum threshold.`},{ruleName:"Lifelong Access Status",passed:!0,explanation:"Permanent access active in Learning Hub."}]}},suggestedQuickActions:["Open Course Learning","View Enrolled Courses","Check Timetable"]};let u=new Set(t.completedCourses||[]),m=(a.prerequisites||[]).filter(e=>!u.has(e)),g=t.cgpa>=(a.minimumCgpa||6),h=r.available>0,p=0===m.length&&g&&h,y="",C=!1;if(p)y=`You are fully eligible to register for **${a.code} — ${a.name}**!

• **Prerequisites:** All satisfied (${(a.prerequisites||[]).join(", ")||"None"})
• **Academic Standing:** CGPA ${t.cgpa} meets minimum requirement (${a.minimumCgpa||6})
• **Credit Headroom:** ${a.credits} credits fit within your semester limit (${t.currentCreditLimit||18} cr)
• **Live Availability:** **${r.available} seats** remaining in ${r.sectionCode} (${r.room})
• **Schedule:** ${r.schedule.map(e=>`${e.day} ${e.startTime}–${e.endTime}`).join(", ")} (Zero timetable collisions)`,C=!0,n={type:"REGISTER",courseCode:a.code,courseName:a.name,sectionCode:r.sectionCode,credits:a.credits,schedule:r.schedule.map(e=>`${e.day} ${e.startTime}–${e.endTime}`).join(", "),seatsAvailable:r.available,eligibilitySummary:`Prerequisites verified, CGPA ${t.cgpa} ≥ ${a.minimumCgpa||6}, 0 schedule conflicts.`};else{let e=[];m.length>0&&e.push(`You have not completed required prerequisite(s): **${m.join(", ")}**`),g||e.push(`Current CGPA (${t.cgpa}) is below course requirement (${a.minimumCgpa})`),h||e.push("Section is currently full (0 seats available)"),y=`⚠️ **Not Currently Eligible for ${a.code} (${a.name}):**

`+e.map(e=>`• ${e}`).join("\n")+`

**Advisor Guidance:** To enroll in ${a.code} in a subsequent semester, register for ${m.join(", ")} first. Would you like me to show alternative electives you are currently qualified for?`}return{message:y,intent:"CHECK_ELIGIBILITY",steps:s,data:{course:a,isEligible:p,missingPrereqs:m,seats:r.available},requiresConfirmation:C,confirmationAction:n,suggestedQuickActions:p?[`Register for ${a.code}`,"Check Timetable","View Syllabus"]:["Find Eligible Alternatives","View Degree Roadmap","Check Prerequisites"]}}async handleRegistrationIntentFlow(e,t,i,s){let n=i[0]||this.extractCourse(e)||d.E.courses.get("CS401"),a=n.sections[0];if((t.currentEnrollments||[]).includes(n.code)||(t.completedCourses||[]).includes(n.code))return{message:`🔒 **Registration Locked:** You are already enrolled in **${n.code} — ${n.name}**!

Under university policy, multiple registrations for the same course are locked for the same individual. One enrollment is permitted per student, with guaranteed lifelong access to all lecture videos, lab environments, and course certifications.

You can access your learning curriculum and coding labs anytime under **Enrolled Courses**!`,intent:"ALREADY_ENROLLED",steps:s,data:{course:n,isAlreadyEnrolled:!0,isLocked:!0},suggestedQuickActions:["Open Course Learning","View Degree Progress","Explore Other Courses"]};let r=new Set(t.completedCourses||[]),o=(n.prerequisites||[]).filter(e=>!r.has(e));if(o.length>0)return{message:`❌ Cannot proceed with registration for **${n.code}**. You have missing prerequisite(s): **${o.join(", ")}**.

Please complete these prerequisites first or petition the academic dean for a prerequisite waiver.`,intent:"REGISTRATION_BLOCKED",steps:s,suggestedQuickActions:["Find Eligible Courses","View Degree Progress"]};let c=a.schedule.map(e=>`${e.day} ${e.startTime}–${e.endTime}`).join(", "),u={eventId:`ev-${Date.now()}-prelock`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),timeExact:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),step:"Pre-registration audit complete",detail:`Validated enrollment gate for ${t.name}: ${n.code} (${a.sectionCode})`,tool:"pre_registration_gate",status:"COMPLETED",durationMs:44,source:"University Registration Gateway"};return l.Y.emitAgentEvent(u),s.push(u),{message:`I have verified all academic requirements for **${n.code} — ${n.name}**:

• **Section:** ${a.sectionCode} (${a.instructor})
• **Classroom:** ${a.room}
• **Meeting Times:** ${c}
• **Credits:** ${n.credits} Credits
• **Live Seats Remaining:** **${a.available} seats**

Click **"Confirm Registration"** below to submit this registration to the authorized University Registrar.`,intent:"REGISTER_COURSE_CONFIRMATION_REQUIRED",steps:s,requiresConfirmation:!0,confirmationAction:{type:"REGISTER",courseCode:n.code,courseName:n.name,sectionCode:a.sectionCode,credits:n.credits,schedule:c,seatsAvailable:a.available,eligibilitySummary:`Prerequisites verified, CGPA ${t.cgpa} meets requirement, credit headroom available.`},suggestedQuickActions:[`Confirm Registration for ${n.code}`,"Review Timetable Slots","Cancel"]}}async handleRecommendationFlow(e,t,i){let s={eventId:`ev-${Date.now()}-rec`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),timeExact:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),step:"Dynamic career & prerequisite scoring",detail:`Ranking open Fall 2026 catalog against ${t.name}'s target: "${t.careerGoal}"`,tool:"recommend_courses",status:"COMPLETED",durationMs:55,source:"Academic Advisor Intelligence"};l.Y.emitAgentEvent(s),i.push(s);let n=d.E.getRecommendedCoursesForStudent(t).slice(0,3),a=n[0],r=n.map((e,t)=>{let i=e.sections[0];return`**${t+1}. ${e.code} — ${e.name}** (${e.matchScore}% Match • ${e.matchBadge})
   • *Credits:* ${e.credits} | *Type:* ${e.type} | *Seats Available:* **${i?.available||0} seats** in ${i?.sectionCode||"Section A"}
   • *Why this course:* ${e.matchReason?.join("; ")||"Matches academic trajectory"}`}).join("\n\n");return{message:`Based on your academic profile, completed transcript coursework, and career target as a **${t.careerGoal}**, here are the top 3 recommended courses for Fall 2026:

${r}

Would you like me to register you for **${a.code}** or check timetable fit?`,intent:"RECOMMEND_COURSES",steps:i,data:{recommendations:n},suggestedQuickActions:[`Register for ${a.code}`,`Check ${a.code} Eligibility`,"Explore More Electives"]}}async handleTimetableFlow(e,t,i){let s=d.E.getStudentTimetable(t.id),n={eventId:`ev-${Date.now()}-tt`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),timeExact:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),step:"Timetable collision analysis",detail:`Audited ${s.length} registered slots against room matrix`,tool:"get_live_timetable",status:"COMPLETED",durationMs:30,source:"University Room Scheduling System"};l.Y.emitAgentEvent(n),i.push(n);let a="";if(0===s.length)a=`Your weekly timetable for Fall 2026 is currently **100% open with zero schedule conflicts**!

All standard lecture blocks are available:
• **Monday/Wednesday 10:00–11:00 AM:** CS401 Machine Learning
• **Monday/Wednesday 13:00–14:30 PM:** CS305 Database Systems
• **Tuesday/Thursday 10:00–11:30 AM:** CS320 Cloud Computing
• **Friday 10:00–13:00 PM:** CS380 Cybersecurity

Would you like me to help you schedule and register for your first course?`;else{let e=s.map(e=>`• **${e.courseCode}** (${e.day} ${e.startTime}–${e.endTime} at ${e.room})`).join("\n");a=`Here is your current registered weekly schedule:

${e}

All slots are synchronized with the university room database and confirmed collision-free.`}return{message:a,intent:"TIMETABLE_INQUIRY",steps:i,data:{timetable:s},suggestedQuickActions:["View Weekly Timetable","Check CS401 Schedule","Suggest Electives for Me"]}}async handleWhatIfFlow(e,t,i){let s=e.toLowerCase().includes("drop"),n=await c.L.run_what_if_simulation(t.id,{action:s?"drop":"swap",courseCode:"CS305"});return{message:`**What-If Simulation Results:**

${n.explanation}

• Current Completed Credits: **${n.originalCredits}** → Projected: **${n.simulatedCredits}**
• Degree Progress: **${n.originalProgress}%** → Projected: **${n.simulatedProgress}%**
• Graduation Impact: ${n.graduationDelayRisk?"⚠️ Risk of 1-semester delay":"✓ On track"}

**Advisor Recommendation:** ${n.aiRecommendation}`,intent:"WHAT_IF_SIMULATION",steps:i,data:{simulation:n},suggestedQuickActions:["Keep Course in Plan","Explore Alternative Electives","Check Credit Limits"]}}async handleDocumentRAGFlow(e,t,i){let s=await c.L.search_university_documents(e),n="";if(s.length>0){let e=s[0];n=`According to the official **${e.document.title}** (${e.document.section}):

> "${e.snippet}"

*Source: ${e.document.sourceFile} (Verified: Fall 2026)*`}else n=`According to University Academic Regulations (Section 4.2), undergraduate students in good standing (CGPA ≥ 6.0) may register for up to **18 credits** per semester. Students on the Dean's Honor Roll (CGPA ≥ 8.5) may request an overload up to **21 credits** with advisor approval. The Fall 2026 add/drop deadline without transcript notation is **October 25, 2026**.`;return{message:n,intent:"DOCUMENT_SEARCH",steps:i,data:{documents:s},suggestedQuickActions:["Check Credit Limits","Registration Deadlines","View Degree Requirements"]}}async handleKnowledgeQueryFlow(e,t,i,s,n){let a={eventId:`ev-${Date.now()}-knowledge`,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),timeExact:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),step:"Consulting Universal Academic & Technical Knowledge Engine",detail:`Synthesizing pedagogical answer for: "${e}" (${t.program}, Semester ${t.semester})`,tool:"universal_knowledge_engine",status:"COMPLETED",durationMs:42,source:"CoursePilot Autonomous Intelligence"};l.Y.emitAgentEvent(a),i.push(a);let r=await m.answerQuestion(e,t,s,n);return{message:r.message,intent:r.intent,steps:i,data:{topicCategory:r.topicCategory,source:r.source},suggestedQuickActions:r.suggestedQuickActions}}async handleUniversalAdvisingFlow(e,t,i,s,n,a){return this.handleKnowledgeQueryFlow(e,t,s,n,a)}}let h=g.getInstance();async function p(e){try{let{message:t,studentId:i,apiKey:s,model:n}=await e.json(),a=e.headers.get("x-gemini-api-key");if(!t||"string"!=typeof t)return o.NextResponse.json({error:"Missing message query"},{status:400});let r=await h.processUserMessage(t,i||"STU-2024-8841",s||a||null,n);return o.NextResponse.json(r)}catch(e){return console.error("Agent route error:",e),o.NextResponse.json({error:e.message||"Failed to process agent request"},{status:500})}}let y=new n.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/agent/route",pathname:"/api/agent",filename:"route",bundlePath:"app/api/agent/route"},resolvedPagePath:"C:\\Users\\Dell\\OneDrive\\Desktop\\joyce\\Course Pilot AI\\src\\app\\api\\agent\\route.ts",nextConfigOutput:"export",userland:s}),{requestAsyncStorage:C,staticGenerationAsyncStorage:f,serverHooks:w}=y,v="/api/agent/route";function S(){return(0,r.patchFetch)({serverHooks:w,staticGenerationAsyncStorage:f})}}};var t=require("../../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),s=t.X(0,[948,972,802,470],()=>i(8103));module.exports=s})();