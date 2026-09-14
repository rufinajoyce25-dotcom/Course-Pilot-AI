import {
  Student,
  Course,
  TimetableSlot,
  UniversityDocument,
  NotificationItem,
  CourseCurriculum,
  CourseVideo,
  CourseLab,
  QuizQuestion,
  CourseQuiz,
  EnrolledCourseProgress,
  CourseCertificate
} from "@/types";
import { defaultLabsData, defaultQuizzesData } from "./courseLabsAndQuizzes";

export interface UniversitySeatRecord {
  courseCode: string;
  sectionCode: string;
  capacity: number;
  occupied: number;
  available: number;
  lastUpdated: string;
  source: string;
  status: "LIVE";
}

export interface UniversityRegistrationRecord {
  transactionId: string;
  studentId: string;
  courseCode: string;
  courseName: string;
  sectionCode: string;
  credits: number;
  schedule: string;
  room: string;
  term: string;
  timestamp: string;
  status: "CONFIRMED" | "CANCELLED";
  verificationHash: string;
}

export interface CompletedCourseItem {
  code: string;
  title: string;
  credits: number;
  grade: string;
  semester: string;
}


const defaultCurriculaData: Record<string, CourseVideo[]> = {
  CS401: [
    {
      id: "cs401-v1",
      title: "1. Introduction to Machine Learning & Paradigms",
      duration: "14:32",
      youtubeId: "jGwO_UgTS7I",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/jGwO_UgTS7I",
      description: "Supervised vs unsupervised learning, mathematical formulations, and evaluation metrics.",
      order: 1,
      thumbnail: "https://img.youtube.com/vi/jGwO_UgTS7I/hqdefault.jpg"
    },
    {
      id: "cs401-v2",
      title: "2. Linear Regression & Gradient Descent Optimization",
      duration: "18:45",
      youtubeId: "4b4MUYve_U8",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/4b4MUYve_U8",
      description: "Cost functions, learning rates, batch vs stochastic gradient descent, and normal equations.",
      order: 2,
      thumbnail: "https://img.youtube.com/vi/4b4MUYve_U8/hqdefault.jpg"
    },
    {
      id: "cs401-v3",
      title: "3. Logistic Regression & Classification Decision Boundaries",
      duration: "16:20",
      youtubeId: "yIYKR4sgzI8",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/yIYKR4sgzI8",
      description: "Sigmoid activation, maximum likelihood estimation, cross-entropy loss, and decision surfaces.",
      order: 3,
      thumbnail: "https://img.youtube.com/vi/yIYKR4sgzI8/hqdefault.jpg"
    },
    {
      id: "cs401-v4",
      title: "4. Overfitting, L1/L2 Regularization & Bias-Variance Tradeoff",
      duration: "21:10",
      youtubeId: "EuBBz3bI-aA",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/EuBBz3bI-aA",
      description: "K-fold cross validation, ridge and lasso penalties, and bias-variance tradeoff decomposition.",
      order: 4,
      thumbnail: "https://img.youtube.com/vi/EuBBz3bI-aA/hqdefault.jpg"
    },
    {
      id: "cs401-v5",
      title: "5. Support Vector Machines & Kernel Projections",
      duration: "19:50",
      youtubeId: "_PwhiWxHK8o",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/_PwhiWxHK8o",
      description: "Max-margin hyperplanes, dual Lagrange optimization, and radial basis functions.",
      order: 5,
      thumbnail: "https://img.youtube.com/vi/_PwhiWxHK8o/hqdefault.jpg"
    },
    {
      id: "cs401-v6",
      title: "6. Neural Networks & Backpropagation Explained Visually",
      duration: "24:15",
      youtubeId: "aircAruvnKk",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/aircAruvnKk",
      description: "Multilayer perceptrons, chain rule of partial derivatives, and activation nonlinearities.",
      order: 6,
      thumbnail: "https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg"
    },
    {
      id: "cs401-v7",
      title: "7. Unsupervised Learning & K-Means Clustering",
      duration: "17:35",
      youtubeId: "4b5d3muPQmA",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/4b5d3muPQmA",
      description: "Centroid initialization algorithms, inertia metrics, elbow method, and cluster analysis.",
      order: 7,
      thumbnail: "https://img.youtube.com/vi/4b5d3muPQmA/hqdefault.jpg"
    },
    {
      id: "cs401-v8",
      title: "8. Principal Component Analysis (PCA) & Dimensionality Reduction",
      duration: "20:40",
      youtubeId: "FgakZw6K1QQ",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/FgakZw6K1QQ",
      description: "Eigenvalues and eigenvectors of covariance matrices, variance preservation, and projection.",
      order: 8,
      thumbnail: "https://img.youtube.com/vi/FgakZw6K1QQ/hqdefault.jpg"
    }
  ],
  CS305: [
    {
      id: "cs305-v1",
      title: "1. Relational Database Architecture & SQL Mechanics",
      duration: "15:20",
      youtubeId: "HXV3zeQKqGY",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/HXV3zeQKqGY",
      description: "Tables, relations, primary and foreign keys, relational algebra, and ANSI SQL syntax.",
      order: 1,
      thumbnail: "https://img.youtube.com/vi/HXV3zeQKqGY/hqdefault.jpg"
    },
    {
      id: "cs305-v2",
      title: "2. Database Normalization: 1NF to BCNF Step-by-Step",
      duration: "22:40",
      youtubeId: "GFQaEYEc8_8",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/GFQaEYEc8_8",
      description: "Functional dependencies, elimination of insertion/update anomalies, and schema design.",
      order: 2,
      thumbnail: "https://img.youtube.com/vi/GFQaEYEc8_8/hqdefault.jpg"
    },
    {
      id: "cs305-v3",
      title: "3. Indexing Structures & B+ Tree Storage Engines",
      duration: "19:15",
      youtubeId: "aZjYr87r1b8",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/aZjYr87r1b8",
      description: "Clustered vs non-clustered indexes, disk block I/O efficiency, and branch splitting operations.",
      order: 3,
      thumbnail: "https://img.youtube.com/vi/aZjYr87r1b8/hqdefault.jpg"
    },
    {
      id: "cs305-v4",
      title: "4. Query Planning, Parsing & Cost-Based Optimization",
      duration: "23:05",
      youtubeId: "o_K6Xn5W8Xk",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/o_K6Xn5W8Xk",
      description: "Query execution trees, hash joins vs nested loop joins, and EXPLAIN ANALYZE interpretation.",
      order: 4,
      thumbnail: "https://img.youtube.com/vi/o_K6Xn5W8Xk/hqdefault.jpg"
    },
    {
      id: "cs305-v5",
      title: "5. ACID Transactions & Write-Ahead Logging (WAL)",
      duration: "18:50",
      youtubeId: "GAe53a23RGE",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/GAe53a23RGE",
      description: "Atomicity, consistency, isolation levels, durability guarantees, and ARIES recovery protocols.",
      order: 5,
      thumbnail: "https://img.youtube.com/vi/GAe53a23RGE/hqdefault.jpg"
    },
    {
      id: "cs305-v6",
      title: "6. Concurrency Control, Deadlocks & Two-Phase Locking (2PL)",
      duration: "21:30",
      youtubeId: "t_5f6f6e5z4",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/t_5f6f6e5z4",
      description: "Shared and exclusive locks, serializability, multi-version concurrency control (MVCC).",
      order: 6,
      thumbnail: "https://img.youtube.com/vi/t_5f6f6e5z4/hqdefault.jpg"
    },
    {
      id: "cs305-v7",
      title: "7. Distributed Databases, Sharding & CAP Theorem",
      duration: "25:10",
      youtubeId: "0buKQHokLK8",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/0buKQHokLK8",
      description: "Horizontal scaling, hash-based partition keys, eventual consistency, and document stores.",
      order: 7,
      thumbnail: "https://img.youtube.com/vi/0buKQHokLK8/hqdefault.jpg"
    }
  ],
  CS380: [
    {
      id: "cs380-v1",
      title: "1. Information Security Principles & Threat Modeling",
      duration: "16:40",
      youtubeId: "inWWhr5tnEA",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/inWWhr5tnEA",
      description: "CIA Triad, attack vectors, STRIDE framework, and zero-trust security postures.",
      order: 1,
      thumbnail: "https://img.youtube.com/vi/inWWhr5tnEA/hqdefault.jpg"
    },
    {
      id: "cs380-v2",
      title: "2. Symmetric Cryptography: Block Ciphers & AES",
      duration: "22:15",
      youtubeId: "gP4PqVGmMtg",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/gP4PqVGmMtg",
      description: "Feistel networks, Substitution-Permutation boxes, AES-256 rounds, and cipher block modes.",
      order: 2,
      thumbnail: "https://img.youtube.com/vi/gP4PqVGmMtg/hqdefault.jpg"
    },
    {
      id: "cs380-v3",
      title: "3. Asymmetric Cryptography: RSA & Diffie-Hellman Key Exchange",
      duration: "25:30",
      youtubeId: "GSIDS_lvRv4",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/GSIDS_lvRv4",
      description: "Euler's totient theorem, modular arithmetic, public-private key pairs, and discrete logarithms.",
      order: 3,
      thumbnail: "https://img.youtube.com/vi/GSIDS_lvRv4/hqdefault.jpg"
    },
    {
      id: "cs380-v4",
      title: "4. Cryptographic Hash Functions & Digital Signatures",
      duration: "18:10",
      youtubeId: "b4b8ktEV4Bg",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/b4b8ktEV4Bg",
      description: "Preimage resistance, collision resistance, SHA-256 compression functions, and HMAC verification.",
      order: 4,
      thumbnail: "https://img.youtube.com/vi/b4b8ktEV4Bg/hqdefault.jpg"
    },
    {
      id: "cs380-v5",
      title: "5. Public Key Infrastructure (PKI) & TLS 1.3 Handshake",
      duration: "20:45",
      youtubeId: "86cQCE80GWM",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/86cQCE80GWM",
      description: "Certificate authorities, X.509 chains of trust, ephemeral key exchanges, and TLS session tickets.",
      order: 5,
      thumbnail: "https://img.youtube.com/vi/86cQCE80GWM/hqdefault.jpg"
    },
    {
      id: "cs380-v6",
      title: "6. Web Application Security & OWASP Top 10 Vulnerabilities",
      duration: "26:00",
      youtubeId: "3Kq1MIfTWCE",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/3Kq1MIfTWCE",
      description: "SQL Injection, Cross-Site Scripting (XSS), CSRF tokens, and security header hardening.",
      order: 6,
      thumbnail: "https://img.youtube.com/vi/3Kq1MIfTWCE/hqdefault.jpg"
    },
    {
      id: "cs380-v7",
      title: "7. Network Security, Firewalls & Intrusion Detection (IDS/IPS)",
      duration: "21:20",
      youtubeId: "x_b_iLg5Wzg",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/x_b_iLg5Wzg",
      description: "Packet inspection, stateful firewalls, Snort signature detection, and network segmentation.",
      order: 7,
      thumbnail: "https://img.youtube.com/vi/x_b_iLg5Wzg/hqdefault.jpg"
    }
  ],
  CS320: [
    {
      id: "cs320-v1",
      title: "1. Cloud Architecture Paradigms: IaaS, PaaS & Serverless",
      duration: "17:15",
      youtubeId: "M988_vx27E8",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/M988_vx27E8",
      description: "Multi-tenant infrastructure, shared responsibility model, availability zones, and auto-scaling.",
      order: 1,
      thumbnail: "https://img.youtube.com/vi/M988_vx27E8/hqdefault.jpg"
    },
    {
      id: "cs320-v2",
      title: "2. Docker Containerization & Layer Optimization",
      duration: "24:20",
      youtubeId: "fqMOX6JJhGo",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/fqMOX6JJhGo",
      description: "Namespaces, cgroups, multi-stage Dockerfiles, caching strategies, and container runtime engines.",
      order: 2,
      thumbnail: "https://img.youtube.com/vi/fqMOX6JJhGo/hqdefault.jpg"
    },
    {
      id: "cs320-v3",
      title: "3. Kubernetes Orchestration: Pods, Services & Deployments",
      duration: "28:10",
      youtubeId: "X48VuDVv0do",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/X48VuDVv0do",
      description: "Control plane components, etcd state stores, replica sets, ingress controllers, and rolling updates.",
      order: 3,
      thumbnail: "https://img.youtube.com/vi/X48VuDVv0do/hqdefault.jpg"
    },
    {
      id: "cs320-v4",
      title: "4. Cloud Storage: S3 Object Stores & EBS Block Storage",
      duration: "18:35",
      youtubeId: "ubCNpX_eW9M",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/ubCNpX_eW9M",
      description: "Object metadata, eventual consistency, lifecycle retention policies, and cross-region replication.",
      order: 4,
      thumbnail: "https://img.youtube.com/vi/ubCNpX_eW9M/hqdefault.jpg"
    },
    {
      id: "cs320-v5",
      title: "5. Cloud IAM, Security Groups & Virtual Private Clouds (VPC)",
      duration: "22:50",
      youtubeId: "z3x69u1qQkE",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/z3x69u1qQkE",
      description: "CIDR subnets, route tables, internet gateways, NAT instances, and least-privilege IAM roles.",
      order: 5,
      thumbnail: "https://img.youtube.com/vi/z3x69u1qQkE/hqdefault.jpg"
    },
    {
      id: "cs320-v6",
      title: "6. Serverless Architectures with AWS Lambda",
      duration: "19:15",
      youtubeId: "eOBq__h4OJ4",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/eOBq__h4OJ4",
      description: "Event-driven execution, cold starts mitigation, execution timeouts, and API Gateway bindings.",
      order: 6,
      thumbnail: "https://img.youtube.com/vi/eOBq__h4OJ4/hqdefault.jpg"
    },
    {
      id: "cs320-v7",
      title: "7. CI/CD Infrastructure as Code with Terraform",
      duration: "23:45",
      youtubeId: "SLB_c_ayRMo",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/SLB_c_ayRMo",
      description: "Declarative cloud provisioning, state locking, continuous integration pipelines, and blue/green rollouts.",
      order: 7,
      thumbnail: "https://img.youtube.com/vi/SLB_c_ayRMo/hqdefault.jpg"
    }
  ],
  CS350: [
    {
      id: "cs350-v1",
      title: "1. Computer Vision Foundations & Digital Image Processing",
      duration: "18:10",
      youtubeId: "2-Mz2SW6kpk",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/2-Mz2SW6kpk",
      description: "Color spaces, convolution kernels, Sobel edge detectors, and image transformations.",
      order: 1,
      thumbnail: "https://img.youtube.com/vi/2-Mz2SW6kpk/hqdefault.jpg"
    },
    {
      id: "cs350-v2",
      title: "2. Convolutional Neural Networks (CNNs) & Feature Maps",
      duration: "26:45",
      youtubeId: "YRhxdVk_sIs",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/YRhxdVk_sIs",
      description: "Stride, padding, max pooling layers, receptive fields, and residual connections (ResNet).",
      order: 2,
      thumbnail: "https://img.youtube.com/vi/YRhxdVk_sIs/hqdefault.jpg"
    },
    {
      id: "cs350-v3",
      title: "3. Object Detection with YOLO & Anchor Boxes",
      duration: "24:15",
      youtubeId: "ag3DLKsl2vk",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/ag3DLKsl2vk",
      description: "Single-stage detectors, Intersection-over-Union (IoU), non-maximum suppression, and bounding boxes.",
      order: 3,
      thumbnail: "https://img.youtube.com/vi/ag3DLKsl2vk/hqdefault.jpg"
    },
    {
      id: "cs350-v4",
      title: "4. Semantic Segmentation with U-Net Architectures",
      duration: "21:50",
      youtubeId: "u1loyCU6nPQ",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/u1loyCU6nPQ",
      description: "Encoder-decoder architectures, skip connections, pixel-level classification, and mask loss.",
      order: 4,
      thumbnail: "https://img.youtube.com/vi/u1loyCU6nPQ/hqdefault.jpg"
    },
    {
      id: "cs350-v5",
      title: "5. Vision Transformers (ViT) & Modern Attention",
      duration: "25:00",
      youtubeId: "TrdevFK_am4",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/TrdevFK_am4",
      description: "Patch embeddings, multi-head self attention across image tokens, and modern vision backbones.",
      order: 5,
      thumbnail: "https://img.youtube.com/vi/TrdevFK_am4/hqdefault.jpg"
    }
  ],
  CS420: [
    {
      id: "cs420-v1",
      title: "1. Introduction to Natural Language Processing & Tokenization",
      duration: "17:40",
      youtubeId: "fOvTtapxa9c",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/fOvTtapxa9c",
      description: "Corpus normalization, Byte-Pair Encoding (BPE), vocabulary distributions, and n-gram models.",
      order: 1,
      thumbnail: "https://img.youtube.com/vi/fOvTtapxa9c/hqdefault.jpg"
    },
    {
      id: "cs420-v2",
      title: "2. Vector Embeddings: Word2Vec, GloVe & Semantic Spaces",
      duration: "21:15",
      youtubeId: "viZrOnJclY0",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/viZrOnJclY0",
      description: "Skip-gram with negative sampling, continuous bag-of-words (CBOW), and cosine similarity metrics.",
      order: 2,
      thumbnail: "https://img.youtube.com/vi/viZrOnJclY0/hqdefault.jpg"
    },
    {
      id: "cs420-v3",
      title: "3. The Transformer: Self-Attention & Positional Encodings",
      duration: "27:20",
      youtubeId: "4Bdc55j80l8",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/4Bdc55j80l8",
      description: "Query, Key, Value calculations, scaled dot-product attention, multi-head attention, and layer norm.",
      order: 3,
      thumbnail: "https://img.youtube.com/vi/4Bdc55j80l8/hqdefault.jpg"
    },
    {
      id: "cs420-v4",
      title: "4. Foundation Models: BERT & Masked Language Modeling",
      duration: "22:10",
      youtubeId: "xI0HHN5XKDo",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/xI0HHN5XKDo",
      description: "Bidirectional context encoding, next-sentence prediction, and downstream classification fine-tuning.",
      order: 4,
      thumbnail: "https://img.youtube.com/vi/xI0HHN5XKDo/hqdefault.jpg"
    },
    {
      id: "cs420-v5",
      title: "5. Large Language Models (LLMs) & Autoregressive Decoding",
      duration: "26:30",
      youtubeId: "zjkBMFhNj_g",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/zjkBMFhNj_g",
      description: "Decoder-only architectures (GPT), greedy vs beam search, temperature sampling, and RLHF alignment.",
      order: 5,
      thumbnail: "https://img.youtube.com/vi/zjkBMFhNj_g/hqdefault.jpg"
    }
  ],
  CS310: [
    {
      id: "cs310-v1",
      title: "1. Modern Full-Stack Architecture & Micro-Frontends",
      duration: "19:10",
      youtubeId: "zJSY8tbf_ys",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/zJSY8tbf_ys",
      description: "Separation of concerns, client vs server boundaries, state management, and edge caching.",
      order: 1,
      thumbnail: "https://img.youtube.com/vi/zJSY8tbf_ys/hqdefault.jpg"
    },
    {
      id: "cs310-v2",
      title: "2. Next.js App Router & React Server Components",
      duration: "25:00",
      youtubeId: "843nec-IvW0",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/843nec-IvW0",
      description: "Server Actions, streaming SSR with Suspense, dynamic routes, and hydration optimization.",
      order: 2,
      thumbnail: "https://img.youtube.com/vi/843nec-IvW0/hqdefault.jpg"
    },
    {
      id: "cs310-v3",
      title: "3. Relational Schema & ORM Patterns with Prisma",
      duration: "22:15",
      youtubeId: "RebA5J-rlhU",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/RebA5J-rlhU",
      description: "Type-safe database queries, schema migrations, relation modeling, and connection pooling.",
      order: 3,
      thumbnail: "https://img.youtube.com/vi/RebA5J-rlhU/hqdefault.jpg"
    },
    {
      id: "cs310-v4",
      title: "4. Cross-Platform Mobile Development with React Native",
      duration: "24:30",
      youtubeId: "0-S5a0eXPoc",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/0-S5a0eXPoc",
      description: "Native bridge architecture, component lifecycles, gesture handlers, and mobile device APIs.",
      order: 4,
      thumbnail: "https://img.youtube.com/vi/0-S5a0eXPoc/hqdefault.jpg"
    },
    {
      id: "cs310-v5",
      title: "5. Production Auth, JWT & Web Security Essentials",
      duration: "20:50",
      youtubeId: "mbsmsi7l3r4",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/mbsmsi7l3r4",
      description: "HTTP-only cookies, OAuth 2.0 PKCE flow, refresh tokens rotation, and CSRF defense.",
      order: 5,
      thumbnail: "https://img.youtube.com/vi/mbsmsi7l3r4/hqdefault.jpg"
    }
  ],
  CS450: [
    {
      id: "cs450-v1",
      title: "1. Distributed Systems Fundamentals & Network Partitions",
      duration: "18:45",
      youtubeId: "77XW84FV43g",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/77XW84FV43g",
      description: "Synchronous vs asynchronous networks, failure modes, Byzantine faults, and safety vs liveness.",
      order: 1,
      thumbnail: "https://img.youtube.com/vi/77XW84FV43g/hqdefault.jpg"
    },
    {
      id: "cs450-v2",
      title: "2. High-Performance RPC & Protocol Buffers with gRPC",
      duration: "21:20",
      youtubeId: "gnchfOoj9Ec",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/gnchfOoj9Ec",
      description: "HTTP/2 multiplexing, binary serialization, bidirectional streaming, and schema code generation.",
      order: 2,
      thumbnail: "https://img.youtube.com/vi/gnchfOoj9Ec/hqdefault.jpg"
    },
    {
      id: "cs450-v3",
      title: "3. Distributed Consensus: The Raft Algorithm Explained",
      duration: "28:10",
      youtubeId: "vYp4LYbnnW8",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/vYp4LYbnnW8",
      description: "Leader election, log replication, commit indices, term numbers, and safety invariance proofs.",
      order: 3,
      thumbnail: "https://img.youtube.com/vi/vYp4LYbnnW8/hqdefault.jpg"
    },
    {
      id: "cs450-v4",
      title: "4. Logical Clocks, Lamport Timestamps & Vector Clocks",
      duration: "23:05",
      youtubeId: "5eP_L_Y2bJ4",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/5eP_L_Y2bJ4",
      description: "Happened-before relations, partial ordering, causal consistency, and concurrent event detection.",
      order: 4,
      thumbnail: "https://img.youtube.com/vi/5eP_L_Y2bJ4/hqdefault.jpg"
    },
    {
      id: "cs450-v5",
      title: "5. Distributed Caching & In-Memory Stores with Redis",
      duration: "19:50",
      youtubeId: "jgpVdJB2sKQ",
      youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/jgpVdJB2sKQ",
      description: "Cache-aside, write-through strategies, eviction policies (LRU/LFU), and Redis Sentinel clustering.",
      order: 5,
      thumbnail: "https://img.youtube.com/vi/jgpVdJB2sKQ/hqdefault.jpg"
    }
  ]
};

class UniversityDatabase {
  public students: Map<string, Student>;
  public activeStudentId: string;
  public studentTranscripts: Map<string, CompletedCourseItem[]>;
  public courses: Map<string, Course>;
  public transactions: UniversityRegistrationRecord[];
  public notifications: NotificationItem[];
  public documents: UniversityDocument[];
  public timetable: Map<string, TimetableSlot[]>; // studentId -> TimetableSlot[]
  public courseCurricula: Map<string, CourseCurriculum>;
  public learningProgress: Map<string, Map<string, EnrolledCourseProgress>>; // studentId -> (courseCode -> EnrolledCourseProgress)
  public certificates: Map<string, CourseCertificate[]>; // studentId -> CourseCertificate[]

  constructor() {
    this.students = new Map();
    this.studentTranscripts = new Map();
    this.timetable = new Map();
    this.transactions = [];
    this.courseCurricula = new Map();
    this.learningProgress = new Map();
    this.certificates = new Map();

    // 1. Initial Students
    const student1: Student = {
      id: "STU-2024-8841",
      name: "Joyce Chen",
      avatar: "", // Removed default hardcoded photo - defaults to initials badge; customizable via upload or library
      email: "joyce.chen@university.edu",
      program: "Computer Science",
      department: "School of Computing & Data Science",
      semester: 6,
      cgpa: 8.7,
      completedCredits: 96,
      requiredCredits: 140,
      completedCourses: [
        "CS101", "CS102", "CS201", "CS202", "CS205",
        "MATH201", "MATH202", "CS301", "CS302", "CS304"
      ],
      currentEnrollments: ["CS401", "CS380"],
      academicStanding: "Honor Roll",
      backlogs: 0,
      careerGoal: "AI/ML Engineer",
      degreeProgressPercentage: 68,
      coreCoursesCompleted: 12,
      coreCoursesTotal: 16,
      electivesCompleted: 8,
      electivesTotal: 12,
      maxCreditLimit: 18,
      currentCreditLimit: 18,
    };

    const transcript1: CompletedCourseItem[] = [
      { code: "CS101", title: "Introduction to Computer Science", credits: 4, grade: "A", semester: "Fall 2023" },
      { code: "MATH201", title: "Discrete Mathematics", credits: 3, grade: "A-", semester: "Fall 2023" },
      { code: "CS102", title: "Object-Oriented Programming (Java)", credits: 4, grade: "A", semester: "Spring 2024" },
      { code: "MATH202", title: "Probability & Statistics for Computing", credits: 3, grade: "B+", semester: "Spring 2024" },
      { code: "CS201", title: "Data Structures & Algorithmic Analysis", credits: 4, grade: "A", semester: "Fall 2024" },
      { code: "CS205", title: "Computer Architecture & Organization", credits: 4, grade: "B+", semester: "Fall 2024" },
      { code: "CS202", title: "Algorithms Design & Complexity", credits: 4, grade: "A-", semester: "Spring 2025" },
      { code: "CS301", title: "Operating Systems Principles", credits: 4, grade: "B", semester: "Spring 2025" },
      { code: "CS302", title: "Software Engineering Methodologies", credits: 4, grade: "A", semester: "Fall 2025" },
      { code: "CS304", title: "Theory of Computation & Automata", credits: 3, grade: "B+", semester: "Fall 2025" },
    ];

    const student2: Student = {
      id: "STU-2024-5219",
      name: "Maya Patel",
      avatar: "", // Initials badge fallback (MP)
      email: "maya.patel@university.edu",
      program: "Cybersecurity & Information Assurance",
      department: "School of Computing & Data Science",
      semester: 5,
      cgpa: 7.9,
      completedCredits: 72,
      requiredCredits: 140,
      completedCourses: ["CS101", "CS102", "CS201", "CS205", "MATH201", "CS301"],
      currentEnrollments: ["CS380", "CS305"],
      academicStanding: "Good Standing",
      backlogs: 0,
      careerGoal: "Cybersecurity Specialist",
      degreeProgressPercentage: 51,
      coreCoursesCompleted: 9,
      coreCoursesTotal: 16,
      electivesCompleted: 4,
      electivesTotal: 12,
      maxCreditLimit: 18,
      currentCreditLimit: 18,
    };

    const transcript2: CompletedCourseItem[] = [
      { code: "CS101", title: "Introduction to Computer Science", credits: 4, grade: "A-", semester: "Fall 2024" },
      { code: "MATH201", title: "Discrete Mathematics", credits: 3, grade: "B+", semester: "Fall 2024" },
      { code: "CS102", title: "Object-Oriented Programming (Java)", credits: 4, grade: "A", semester: "Spring 2025" },
      { code: "CS201", title: "Data Structures & Algorithmic Analysis", credits: 4, grade: "B+", semester: "Fall 2025" },
      { code: "CS205", title: "Computer Architecture & Organization", credits: 4, grade: "B", semester: "Fall 2025" },
      { code: "CS301", title: "Operating Systems Principles", credits: 4, grade: "B+", semester: "Spring 2026" },
    ];

    const student3: Student = {
      id: "STU-2024-3104",
      name: "David Kim",
      avatar: "", // Initials badge fallback (DK)
      email: "david.kim@university.edu",
      program: "Cloud Systems & DevOps",
      department: "School of Computing & Data Science",
      semester: 4,
      cgpa: 9.1,
      completedCredits: 52,
      requiredCredits: 140,
      completedCourses: ["CS101", "CS102", "CS201", "CS301", "MATH201", "MATH202"],
      currentEnrollments: ["CS320", "CS450"],
      academicStanding: "Dean's List",
      backlogs: 0,
      careerGoal: "Cloud Solutions Architect",
      degreeProgressPercentage: 37,
      coreCoursesCompleted: 7,
      coreCoursesTotal: 16,
      electivesCompleted: 2,
      electivesTotal: 12,
      maxCreditLimit: 21,
      currentCreditLimit: 21,
    };

    const transcript3: CompletedCourseItem[] = [
      { code: "CS101", title: "Introduction to Computer Science", credits: 4, grade: "A+", semester: "Fall 2024" },
      { code: "MATH201", title: "Discrete Mathematics", credits: 3, grade: "A", semester: "Fall 2024" },
      { code: "CS102", title: "Object-Oriented Programming (Java)", credits: 4, grade: "A+", semester: "Spring 2025" },
      { code: "MATH202", title: "Probability & Statistics", credits: 3, grade: "A", semester: "Spring 2025" },
      { code: "CS201", title: "Data Structures & Algorithmic Analysis", credits: 4, grade: "A", semester: "Fall 2025" },
      { code: "CS301", title: "Operating Systems Principles", credits: 4, grade: "A", semester: "Spring 2026" },
    ];

    this.students.set(student1.id, student1);
    this.students.set(student2.id, student2);
    this.students.set(student3.id, student3);

    this.studentTranscripts.set(student1.id, transcript1);
    this.studentTranscripts.set(student2.id, transcript2);
    this.studentTranscripts.set(student3.id, transcript3);

    this.timetable.set(student1.id, []);
    this.timetable.set(student2.id, []);
    this.timetable.set(student3.id, []);

    this.activeStudentId = student1.id;

    // 2. Comprehensive University Course Catalog (Fall 2026)
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.courses = new Map();

    const courseList: Course[] = [
      {
        id: "c-cs401",
        code: "CS401",
        name: "Machine Learning",
        description: "Core course for AI specialization. Covers supervised & unsupervised learning, deep neural networks, loss landscape optimization, and real-world deployment.",
        credits: 4,
        department: "Computer Science",
        type: "Core",
        semester: "Fall 2026",
        level: 400,
        instructor: "Dr. Elena Rostova",
        prerequisites: ["CS201", "CS202", "MATH202"],
        minimumCgpa: 7.0,
        matchScore: 96,
        matchBadge: "High Match",
        matchReason: [
          "Directly aligns with AI/ML Engineer career roadmap",
          "All 3 prerequisites completed (CS201, CS202, MATH202)",
          "Required core course for AI track",
          "8 seats available in Section A"
        ],
        dataSource: { source: "University Registration API", timestamp: nowStr, status: "LIVE" },
        sections: [
          {
            id: "sec-cs401-a",
            sectionCode: "Section A",
            instructor: "Dr. Elena Rostova",
            room: "Turing Hall 302",
            schedule: [
              { day: "Monday", startTime: "10:00", endTime: "11:00" },
              { day: "Wednesday", startTime: "10:00", endTime: "11:00" }
            ],
            capacity: 50,
            occupied: 42,
            available: 8
          },
          {
            id: "sec-cs401-b",
            sectionCode: "Section B",
            instructor: "Dr. David Kim",
            room: "Lovelace 104",
            schedule: [
              { day: "Tuesday", startTime: "14:00", endTime: "15:30" },
              { day: "Thursday", startTime: "14:00", endTime: "15:30" }
            ],
            capacity: 45,
            occupied: 41,
            available: 4
          }
        ]
      },
      {
        id: "c-cs305",
        code: "CS305",
        name: "Database Systems",
        description: "Fundamentals of relational schemas, SQL indexing, ACID transactions, B-Trees, distributed databases, and sharding principles.",
        credits: 4,
        department: "Computer Science",
        type: "Core",
        semester: "Fall 2026",
        level: 300,
        instructor: "Prof. Marcus Vance",
        prerequisites: ["CS201"],
        minimumCgpa: 6.5,
        matchScore: 91,
        matchBadge: "Recommended",
        matchReason: [
          "Core requirement for CS majors",
          "Essential foundation for backend & data engineering",
          "Prerequisite CS201 satisfied",
          "12 seats available in Section A"
        ],
        dataSource: { source: "University Registration API", timestamp: nowStr, status: "LIVE" },
        sections: [
          {
            id: "sec-cs305-a",
            sectionCode: "Section A",
            instructor: "Prof. Marcus Vance",
            room: "Hopper Hall 210",
            schedule: [
              { day: "Monday", startTime: "13:00", endTime: "14:30" },
              { day: "Wednesday", startTime: "13:00", endTime: "14:30" }
            ],
            capacity: 60,
            occupied: 48,
            available: 12
          }
        ]
      },
      {
        id: "c-cs320",
        code: "CS320",
        name: "Cloud Computing",
        description: "Cloud architectures, containerization with Docker & Kubernetes, serverless microservices, distributed object storage, and multi-region resilience.",
        credits: 3,
        department: "Computer Science",
        type: "Elective",
        semester: "Fall 2026",
        level: 300,
        instructor: "Dr. Aisha Patel",
        prerequisites: ["CS301"],
        minimumCgpa: 6.5,
        matchScore: 87,
        matchBadge: "Good Fit",
        matchReason: [
          "Fulfills 3 upper-division elective credits",
          "Crucial for modern cloud deployment and distributed scale",
          "Prerequisite CS301 completed",
          "8 seats available in Section A"
        ],
        dataSource: { source: "University Registration API", timestamp: nowStr, status: "LIVE" },
        sections: [
          {
            id: "sec-cs320-a",
            sectionCode: "Section A",
            instructor: "Dr. Aisha Patel",
            room: "Berners-Lee 101",
            schedule: [
              { day: "Tuesday", startTime: "10:00", endTime: "11:30" },
              { day: "Thursday", startTime: "10:00", endTime: "11:30" }
            ],
            capacity: 40,
            occupied: 32,
            available: 8
          }
        ]
      },
      {
        id: "c-cs380",
        code: "CS380",
        name: "Cybersecurity & Cryptography",
        description: "Symmetric and asymmetric encryption, TLS, public key infrastructure (PKI), zero-trust architecture, threat modeling, and defensive security.",
        credits: 3,
        department: "Computer Science",
        type: "Elective",
        semester: "Fall 2026",
        level: 300,
        instructor: "Prof. Victor Thorne",
        prerequisites: ["CS201", "MATH201"],
        minimumCgpa: 6.5,
        matchScore: 98,
        matchBadge: "Top Match",
        matchReason: [
          "Prime core elective for Cybersecurity track",
          "Satisfies prerequisite chain for Advanced Cryptography",
          "Prerequisites CS201 and MATH201 fulfilled",
          "7 seats available in Section A"
        ],
        dataSource: { source: "University Registration API", timestamp: nowStr, status: "LIVE" },
        sections: [
          {
            id: "sec-cs380-a",
            sectionCode: "Section A",
            instructor: "Prof. Victor Thorne",
            room: "Diffie-Hellman 102",
            schedule: [
              { day: "Friday", startTime: "10:00", endTime: "13:00" }
            ],
            capacity: 45,
            occupied: 38,
            available: 7
          }
        ]
      },
      {
        id: "c-cs350",
        code: "CS350",
        name: "Computer Vision",
        description: "Image classification, CNNs, YOLO object detection, image segmentation, optical flow, and generative diffusion architectures.",
        credits: 3,
        department: "Computer Science",
        type: "Elective",
        semester: "Fall 2026",
        level: 300,
        instructor: "Dr. Kenji Sato",
        prerequisites: ["CS401"],
        minimumCgpa: 7.5,
        matchScore: 93,
        matchBadge: "High Match",
        matchReason: [
          "Specialized AI elective for visual perception",
          "Requires CS401 as prerequisite",
          "5 seats remaining in Section A"
        ],
        dataSource: { source: "University Registration API", timestamp: nowStr, status: "LIVE" },
        sections: [
          {
            id: "sec-cs350-a",
            sectionCode: "Section A",
            instructor: "Dr. Kenji Sato",
            room: "Shannon Hall 105",
            schedule: [
              { day: "Monday", startTime: "15:00", endTime: "16:30" },
              { day: "Wednesday", startTime: "15:00", endTime: "16:30" }
            ],
            capacity: 35,
            occupied: 30,
            available: 5
          }
        ]
      },
      {
        id: "c-cs420",
        code: "CS420",
        name: "Natural Language Processing",
        description: "Transformer models, BERT, GPT self-attention, fine-tuning LLMs, retrieval augmented generation (RAG), and token embeddings.",
        credits: 3,
        department: "Computer Science",
        type: "Elective",
        semester: "Fall 2026",
        level: 400,
        instructor: "Dr. Sarah Jenkins",
        prerequisites: ["CS401"],
        minimumCgpa: 7.5,
        matchScore: 89,
        matchBadge: "Recommended",
        matchReason: [
          "Frontier AI elective for Large Language Models",
          "Requires CS401 as prerequisite",
          "2 seats remaining in Section A"
        ],
        dataSource: { source: "University Registration API", timestamp: nowStr, status: "LIVE" },
        sections: [
          {
            id: "sec-cs420-a",
            sectionCode: "Section A",
            instructor: "Dr. Sarah Jenkins",
            room: "Turing 204",
            schedule: [
              { day: "Tuesday", startTime: "11:30", endTime: "13:00" },
              { day: "Thursday", startTime: "11:30", endTime: "13:00" }
            ],
            capacity: 35,
            occupied: 33,
            available: 2
          }
        ]
      },
      {
        id: "c-cs310",
        code: "CS310",
        name: "Modern Web & Mobile Systems",
        description: "Full-stack development, Next.js, reactive state architectures, REST/GraphQL APIs, OAuth2, and scalable frontend engineering.",
        credits: 3,
        department: "Computer Science",
        type: "Elective",
        semester: "Fall 2026",
        level: 300,
        instructor: "Prof. Rachel Green",
        prerequisites: ["CS201"],
        minimumCgpa: 6.0,
        matchScore: 92,
        matchBadge: "High Match",
        matchReason: [
          "Direct practical skills for full-stack engineering",
          "Prerequisite CS201 satisfied",
          "14 seats available in Section A"
        ],
        dataSource: { source: "University Registration API", timestamp: nowStr, status: "LIVE" },
        sections: [
          {
            id: "sec-cs310-a",
            sectionCode: "Section A",
            instructor: "Prof. Rachel Green",
            room: "Lovelace 201",
            schedule: [
              { day: "Monday", startTime: "11:30", endTime: "13:00" },
              { day: "Wednesday", startTime: "11:30", endTime: "13:00" }
            ],
            capacity: 50,
            occupied: 36,
            available: 14
          }
        ]
      },
      {
        id: "c-cs450",
        code: "CS450",
        name: "Distributed Systems & Microservices",
        description: "Raft consensus, CAP theorem, RPCs, event-driven streaming with Kafka, gRPC, and high-concurrency distributed caching.",
        credits: 4,
        department: "Computer Science",
        type: "Elective",
        semester: "Fall 2026",
        level: 400,
        instructor: "Dr. Linus Becker",
        prerequisites: ["CS301", "CS202"],
        minimumCgpa: 7.0,
        matchScore: 94,
        matchBadge: "Top Match",
        matchReason: [
          "Crucial for high-scale cloud and systems engineering",
          "Prerequisites CS301 and CS202 satisfied",
          "6 seats available in Section A"
        ],
        dataSource: { source: "University Registration API", timestamp: nowStr, status: "LIVE" },
        sections: [
          {
            id: "sec-cs450-a",
            sectionCode: "Section A",
            instructor: "Dr. Linus Becker",
            room: "Turing Hall 110",
            schedule: [
              { day: "Tuesday", startTime: "08:30", endTime: "10:00" },
              { day: "Thursday", startTime: "08:30", endTime: "10:00" }
            ],
            capacity: 40,
            occupied: 34,
            available: 6
          }
        ]
      }
    ];

    for (const c of courseList) {
      this.courses.set(c.id, c);
      this.courses.set(c.code, c);
      this.courses.set(c.code.toLowerCase(), c);
    }

    // 3. Official University Documents
    this.documents = [
      {
        id: "doc-1",
        title: "Academic Regulations 2026",
        category: "Regulations",
        section: "Section 4.2 - Credit Load & Overloads",
        content: "Undergraduate students in good standing (CGPA >= 6.0) may register for a maximum of 18 credits per regular semester. Students on the Dean's Honor Roll (CGPA >= 8.5) may petition for an overload up to 21 credits with academic advisor approval. Minimum full-time registration is 12 credits.",
        lastUpdated: "Fall 2026",
        sourceFile: "Regulations_2026_RevB.pdf"
      },
      {
        id: "doc-2",
        title: "Course Registration Policy",
        category: "Policy",
        section: "Section 2.1 - Add/Drop Periods & Live Seat Allocation",
        content: "Course registration takes place through the automated portal. Course seats are reserved on a verified first-come-first-served basis upon student confirmation. The last date to add courses without penalty is Oct 17, 2026. Drops before Oct 25, 2026 will not appear on official academic transcripts.",
        lastUpdated: "Aug 2026",
        sourceFile: "Registration_Policy_Fall2026.pdf"
      },
      {
        id: "doc-3",
        title: "Degree Requirements: B.S. Computer Science",
        category: "Requirements",
        section: "Specialization Tracks (AI/ML, Cybersecurity, Cloud Systems)",
        content: "To graduate with an AI/ML Specialization track, students must complete CS401 Machine Learning, and at least two AI electives (CS350 Computer Vision or CS420 Natural Language Processing). For Cybersecurity track, complete CS380 Cryptography and Network Security. For Cloud Systems, complete CS320 Cloud Computing and CS450 Distributed Systems.",
        lastUpdated: "Fall 2026",
        sourceFile: "BS_CS_Degree_Requirements_2026.pdf"
      },
      {
        id: "doc-4",
        title: "Prerequisite Enforcement Rules",
        category: "Handbook",
        section: "Section 3.5 - Mandatory Prerequisite Verification",
        content: "Prerequisites are verified automatically at the point of registration. A course marked as prerequisite must have a recorded passing grade (Grade >= C / 2.0) on the official university transcript. Automated registration blocks any student who has not completed prerequisite coursework.",
        lastUpdated: "Fall 2026",
        sourceFile: "Course_Handbook_2026.pdf"
      }
    ];

    
    // Populate Curricula
    // Populate Curricula with Videos, Labs, and 20-Mark Quizzes
    for (const [code, videos] of Object.entries(defaultCurriculaData)) {
      const course = this.courses.get(code);
      this.courseCurricula.set(code, {
        courseCode: code,
        courseName: course?.name || code,
        totalVideos: videos.length,
        totalDuration: videos.reduce((acc, v) => acc + parseInt(v.duration.split(":")[0], 10), 0) + " mins",
        videos,
        labs: defaultLabsData[code] || [],
        quiz: defaultQuizzesData[code]
      });
    }

    // Initialize Learning Progress for Student 1 (Joyce Chen)
    const progressMap1 = new Map<string, EnrolledCourseProgress>();
    progressMap1.set("CS401", {
      studentId: student1.id,
      courseCode: "CS401",
      courseName: "Machine Learning",
      sectionCode: "Section A",
      instructor: "Dr. Elena Rostova",
      credits: 4,
      enrolledAt: "Fall 2026",
      transactionId: "TXN-UNIV-914022",
      completedVideoIds: ["cs401-v1", "cs401-v2", "cs401-v3"],
      totalVideos: 8,
      progressPercentage: 38,
      status: "IN_PROGRESS",
      lastAccessedVideoId: "cs401-v4"
    });
    progressMap1.set("CS380", {
      studentId: student1.id,
      courseCode: "CS380",
      courseName: "Cybersecurity & Cryptography",
      sectionCode: "Section A",
      instructor: "Dr. Marcus Vance",
      credits: 3,
      enrolledAt: "Fall 2026",
      transactionId: "TXN-UNIV-882194",
      completedVideoIds: ["cs380-v1"],
      totalVideos: 7,
      progressPercentage: 14,
      status: "IN_PROGRESS",
      lastAccessedVideoId: "cs380-v2"
    });
    this.learningProgress.set(student1.id, progressMap1);
    this.notifications = [
      {
        id: "notif-1",
        timestamp: "Just now",
        title: "University SIS Synchronized",
        message: "Connected to Authorized University Registration API (Fall 2026 Window: Oct 10–25, 2026).",
        priority: "high",
        type: "success",
        read: false,
        source: "University Registrar API"
      }
    ];
  }

  // --- Student Management API ---

  public getActiveStudent(): Student {
    const s = this.students.get(this.activeStudentId);
    if (!s) {
      return Array.from(this.students.values())[0];
    }
    return s;
  }

  public getStudent(id: string): Student | undefined {
    const s = this.students.get(id);
    if (s && s.currentEnrollments) {
      s.currentEnrollments = Array.from(new Set(s.currentEnrollments));
    }
    return s;
  }

  public isCourseEnrolledOrCompleted(studentId: string, courseCode: string): boolean {
    const s = this.students.get(studentId) || this.getActiveStudent();
    if (!s) return false;
    const code = courseCode.toUpperCase();
    return (
      (s.currentEnrollments || []).some(c => c.toUpperCase() === code) ||
      (s.completedCourses || []).some(c => c.toUpperCase() === code)
    );
  }

  public listStudents(): Student[] {
    return Array.from(this.students.values()).map(s => {
      s.currentEnrollments = Array.from(new Set(s.currentEnrollments || []));
      return s;
    });
  }

  public setActiveStudent(id: string): Student {
    const s = this.students.get(id);
    if (!s) {
      throw new Error(`Student ID ${id} not found.`);
    }
    s.currentEnrollments = Array.from(new Set(s.currentEnrollments || []));
    this.activeStudentId = id;
    return s;
  }

  public createStudent(studentData: {
    id?: string;
    name: string;
    email?: string;
    program?: string;
    department?: string;
    semester?: number;
    cgpa?: number;
    careerGoal?: string;
    avatar?: string;
    completedCourses?: string[];
    currentEnrollments?: string[];
  }): Student {
    const trimmedName = studentData.name.trim();
    if (!trimmedName) {
      throw new Error("Student name is required.");
    }

    const normalizedName = trimmedName.toLowerCase();

    // STRICT CONSTRAINT: One student should have only one student profile
    for (const existing of this.students.values()) {
      if (studentData.id && existing.id.trim().toUpperCase() === studentData.id.trim().toUpperCase()) {
        throw new Error(`A student profile with ID '${studentData.id}' already exists. Each student can only have one profile.`);
      }
      if (existing.name.trim().toLowerCase() === normalizedName) {
        throw new Error(`A student profile for '${existing.name}' already exists (ID: ${existing.id}). Each student can only have one profile.`);
      }
    }

    const uniqueId = studentData.id?.trim().toUpperCase() || `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const compCourses = studentData.completedCourses || ["CS101", "CS102", "MATH201"];
    const enrollments = studentData.currentEnrollments && studentData.currentEnrollments.length > 0
      ? studentData.currentEnrollments
      : ["CS401", "CS380"];

    const sem = studentData.semester || 1;
    const gpa = studentData.cgpa || 8.0;

    const newStudent: Student = {
      id: uniqueId,
      name: trimmedName,
      avatar: studentData.avatar || "",
      email: studentData.email?.trim() || `${trimmedName.toLowerCase().replace(/\s+/g, ".")}@university.edu`,
      program: studentData.program || "Computer Science",
      department: studentData.department || "School of Computing & Data Science",
      semester: sem,
      cgpa: gpa,
      completedCredits: compCourses.length * 4,
      requiredCredits: 140,
      completedCourses: compCourses,
      currentEnrollments: enrollments,
      academicStanding: gpa >= 8.5 ? "Honor Roll" : "Good Standing",
      backlogs: 0,
      careerGoal: studentData.careerGoal || "AI/ML Engineer",
      degreeProgressPercentage: Math.round(((compCourses.length * 4) / 140) * 100),
      coreCoursesCompleted: Math.min(16, compCourses.length),
      coreCoursesTotal: 16,
      electivesCompleted: Math.max(0, compCourses.length - 8),
      electivesTotal: 12,
      maxCreditLimit: gpa >= 8.5 ? 21 : 18,
      currentCreditLimit: gpa >= 8.5 ? 21 : 18,
    };

    this.students.set(newStudent.id, newStudent);
    this.timetable.set(newStudent.id, []);
    this.studentTranscripts.set(
      newStudent.id,
      compCourses.map((code, idx) => ({
        code,
        title: this.courses.get(code)?.name || `Course ${code}`,
        credits: 4,
        grade: "A",
        semester: `Semester ${Math.min(idx + 1, sem)}`,
      }))
    );
    this.certificates.set(newStudent.id, []);

    // Set as active student immediately
    this.activeStudentId = newStudent.id;
    return newStudent;
  }

  public updateStudentProfile(id: string, updates: Partial<Student>): Student {
    const current = this.students.get(id) || this.getActiveStudent();
    const updated: Student = {
      ...current,
      ...updates,
      // Recalculate progress if credits changed
      degreeProgressPercentage: updates.completedCredits !== undefined
        ? Math.round((updates.completedCredits / (updates.requiredCredits || current.requiredCredits)) * 100)
        : current.degreeProgressPercentage,
    };

    if (updates.completedCourses) {
      updated.completedCourses = updates.completedCourses;
    }

    this.students.set(updated.id, updated);
    return updated;
  }

  public getStudentTranscript(studentId: string): CompletedCourseItem[] {
    return this.studentTranscripts.get(studentId) || [];
  }

  public addCompletedCourse(studentId: string, course: CompletedCourseItem): Student {
    const student = this.students.get(studentId) || this.getActiveStudent();
    const transcript = this.studentTranscripts.get(student.id) || [];

    // Avoid duplicates
    if (!transcript.some(c => c.code === course.code)) {
      transcript.push(course);
      this.studentTranscripts.set(student.id, transcript);

      student.completedCourses.push(course.code);
      student.completedCredits += course.credits;
      student.degreeProgressPercentage = Math.round((student.completedCredits / student.requiredCredits) * 100);
      this.students.set(student.id, student);
    }

    return student;
  }

  public removeCompletedCourse(studentId: string, courseCode: string): Student {
    const student = this.students.get(studentId) || this.getActiveStudent();
    let transcript = this.studentTranscripts.get(student.id) || [];

    const removed = transcript.find(c => c.code === courseCode);
    if (removed) {
      transcript = transcript.filter(c => c.code !== courseCode);
      this.studentTranscripts.set(student.id, transcript);

      student.completedCourses = student.completedCourses.filter(c => c !== courseCode);
      student.completedCredits = Math.max(0, student.completedCredits - removed.credits);
      student.degreeProgressPercentage = Math.round((student.completedCredits / student.requiredCredits) * 100);
      this.students.set(student.id, student);
    }

    return student;
  }

  // --- Dynamic Course Recommendations based on Active Student ---

  public getRecommendedCoursesForStudent(student: Student): Course[] {
    const goal = (student.careerGoal || "").toLowerCase();
    const completed = new Set(student.completedCourses);
    const enrolled = new Set(student.currentEnrollments || []);

    const allCourses = Array.from(new Set(Array.from(this.courses.values())));

    return allCourses
      // Don't recommend already completed or enrolled
      .filter(c => !completed.has(c.code) && !enrolled.has(c.code))
      .map(c => {
        let score = 70;
        let badge: "Top Match" | "High Match" | "Recommended" | "Good Fit" = "Good Fit";
        const reasons: string[] = [];

        // 1. Career Goal Matching
        if (goal.includes("ai") || goal.includes("machine learning")) {
          if (c.code === "CS401") { score = 96; badge = "High Match"; reasons.push("Core required foundation for AI/ML specialization"); }
          else if (c.code === "CS350") { score = 93; badge = "High Match"; reasons.push("Specialized computer vision track requirement"); }
          else if (c.code === "CS420") { score = 89; badge = "Recommended"; reasons.push("Key modern LLM & NLP elective"); }
          else if (c.code === "CS305") { score = 85; badge = "Recommended"; reasons.push("Essential data layer for model training pipelines"); }
          else if (c.code === "CS320") { score = 80; badge = "Good Fit"; reasons.push("Cloud deployment infrastructure for AI models"); }
        } else if (goal.includes("cyber") || goal.includes("security")) {
          if (c.code === "CS380") { score = 98; badge = "Top Match"; reasons.push("Primary core requirement for Cybersecurity career path"); }
          else if (c.code === "CS305") { score = 88; badge = "Recommended"; reasons.push("Database security and access control principles"); }
          else if (c.code === "CS320") { score = 86; badge = "Good Fit"; reasons.push("Cloud security and container isolation"); }
          else if (c.code === "CS401") { score = 82; badge = "Good Fit"; reasons.push("AI in behavioral anomaly detection"); }
        } else if (goal.includes("cloud") || goal.includes("devops") || goal.includes("system")) {
          if (c.code === "CS320") { score = 98; badge = "Top Match"; reasons.push("Direct match for Cloud Solutions Architect career goal"); }
          else if (c.code === "CS450") { score = 94; badge = "High Match"; reasons.push("Distributed computing, microservices & consensus protocols"); }
          else if (c.code === "CS305") { score = 90; badge = "Recommended"; reasons.push("Distributed database storage & replication fundamentals"); }
          else if (c.code === "CS380") { score = 84; badge = "Good Fit"; reasons.push("Cloud network security and IAM authorization"); }
        } else if (goal.includes("full") || goal.includes("software") || goal.includes("web")) {
          if (c.code === "CS310") { score = 97; badge = "Top Match"; reasons.push("Direct match for Full-Stack Software Engineer track"); }
          else if (c.code === "CS305") { score = 93; badge = "High Match"; reasons.push("Database design, querying & persistent backends"); }
          else if (c.code === "CS320") { score = 88; badge = "Recommended"; reasons.push("Containerized cloud hosting and CI/CD"); }
          else if (c.code === "CS380") { score = 82; badge = "Good Fit"; reasons.push("Web application vulnerability defense"); }
        } else {
          // Default scoring
          if (c.type === "Core") { score = 92; badge = "Recommended"; reasons.push("Core requirement for your major"); }
          else { score = 85; badge = "Good Fit"; reasons.push("Upper-division elective credit"); }
        }

        // 2. Prerequisite Check
        const missingPrereqs = (c.prerequisites || []).filter(p => !completed.has(p));
        if (missingPrereqs.length === 0) {
          reasons.push(`All ${c.prerequisites?.length || 0} prerequisite courses completed`);
        } else {
          score -= 15;
          reasons.push(`Missing prerequisites: ${missingPrereqs.join(", ")}`);
        }

        // 3. CGPA fit
        if (student.cgpa >= (c.minimumCgpa || 6.0)) {
          reasons.push(`CGPA requirement met (${student.cgpa} ≥ ${c.minimumCgpa || 6.0})`);
        }

        // 4. Seats
        const secA = c.sections[0];
        if (secA) {
          reasons.push(`${secA.available} seats available in ${secA.sectionCode}`);
        }

        return {
          ...c,
          matchScore: Math.min(99, Math.max(50, score)),
          matchBadge: badge,
          matchReason: reasons
        };
      })
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  // --- Timetable API ---

  public getStudentTimetable(studentId: string): TimetableSlot[] {
    return this.timetable.get(studentId) || [];
  }

  public addTimetableSlot(studentId: string, slot: TimetableSlot): void {
    const slots = this.timetable.get(studentId) || [];
    slots.push(slot);
    this.timetable.set(studentId, slots);
  }

  public removeTimetableSlot(studentId: string, courseCode: string): void {
    let slots = this.timetable.get(studentId) || [];
    slots = slots.filter(s => s.courseCode !== courseCode);
    this.timetable.set(studentId, slots);
  }

  // --- Video Learning & Curricula API ---

  public getCourseCurriculum(courseCode: string): CourseCurriculum | null {
    const code = courseCode.toUpperCase();
    return this.courseCurricula.get(code) || null;
  }

  public getEnrolledCoursesWithProgress(studentId: string): EnrolledCourseProgress[] {
    const student = this.getStudent(studentId);
    if (!student) return [];

    let map = this.learningProgress.get(studentId);
    if (!map) {
      map = new Map();
      this.learningProgress.set(studentId, map);
    }

    // Ensure all currentEnrollments are reflected
    for (const code of (student.currentEnrollments || [])) {
      if (!map.has(code)) {
        const course = this.courses.get(code);
        const curriculum = this.courseCurricula.get(code);
        const totalV = curriculum?.videos.length || 6;
        map.set(code, {
          studentId,
          courseCode: code,
          courseName: course?.name || code,
          sectionCode: course?.sections[0]?.sectionCode || "Section A",
          instructor: course?.instructor || "University Faculty",
          credits: course?.credits || 3,
          enrolledAt: "Fall 2026",
          transactionId: `TXN-UNIV-${Math.floor(100000 + Math.random() * 900000)}`,
          completedVideoIds: [],
          totalVideos: totalV,
          progressPercentage: 0,
          status: "IN_PROGRESS"
        });
      }
    }

    return Array.from(map.values());
  }

  public getOrCreateCourseProgress(studentId: string, courseCode: string): EnrolledCourseProgress {
    const code = courseCode.toUpperCase();
    let map = this.learningProgress.get(studentId);
    if (!map) {
      map = new Map();
      this.learningProgress.set(studentId, map);
    }

    let progress = map.get(code);
    if (!progress) {
      const course = this.courses.get(code);
      const curriculum = this.courseCurricula.get(code);
      const totalV = curriculum?.videos.length || 6;
      const totalL = curriculum?.labs?.length || 3;

      progress = {
        studentId,
        courseCode: code,
        courseName: course?.name || code,
        sectionCode: course?.sections[0]?.sectionCode || "Section A",
        instructor: course?.instructor || "University Faculty",
        credits: course?.credits || 3,
        enrolledAt: "Fall 2026",
        transactionId: `TXN-UNIV-${Math.floor(100000 + Math.random() * 900000)}`,
        completedVideoIds: [],
        totalVideos: totalV,
        completedLabIds: [],
        totalLabs: totalL,
        quizScore: undefined,
        quizPassed: false,
        quizAttempts: 0,
        watchedSeconds: {},
        progressPercentage: 0,
        status: "IN_PROGRESS"
      };
      map.set(code, progress);
    }
    return progress;
  }

  public recalculateCourseProgress(studentId: string, courseCode: string, progress: EnrolledCourseProgress): void {
    const code = courseCode.toUpperCase();
    const curriculum = this.courseCurricula.get(code);
    const totalV = Math.max(1, progress.totalVideos || curriculum?.videos.length || 6);
    const totalL = Math.max(1, progress.totalLabs || curriculum?.labs?.length || 3);

    const completedV = (progress.completedVideoIds || []).length;
    const completedL = (progress.completedLabIds || []).length;
    const quizPassed = Boolean(progress.quizPassed);

    // Weights: Videos 50%, Labs 30%, Quiz 20%
    const videoPct = (completedV / totalV) * 50;
    const labPct = (completedL / totalL) * 30;
    const quizPct = quizPassed ? 20 : (progress.quizScore ? (progress.quizScore / 20) * 15 : 0);

    progress.progressPercentage = Math.min(100, Math.round(videoPct + labPct + quizPct));

    // Certificate issuance strictly requires: All Videos + All Labs + Quiz Passed (>=12 marks)
    const allVideosDone = completedV >= totalV;
    const allLabsDone = completedL >= totalL;

    if (allVideosDone && allLabsDone && quizPassed) {
      progress.progressPercentage = 100;
      progress.status = "COMPLETED";
      if (!progress.certificateId) {
        const cert = this.issueCourseCertificate(studentId, code, progress.quizScore || 18);
        progress.certificateId = cert.certificateId;
        progress.certificateIssuedAt = cert.completionDate;
      }
    } else {
      progress.status = "IN_PROGRESS";
    }
  }



  public verifyVideoWatch(
    studentId: string,
    courseCode: string,
    videoId: string,
    watchedSeconds: number,
    totalDurationSeconds: number
  ): { progress: EnrolledCourseProgress; verified: boolean; message: string } {
    const code = courseCode.toUpperCase();
    const progress = this.getOrCreateCourseProgress(studentId, code);

    if (!progress.watchedSeconds) progress.watchedSeconds = {};
    progress.watchedSeconds[videoId] = Math.max(progress.watchedSeconds[videoId] || 0, watchedSeconds);

    // Strict Anti-cheat: Video must be played through to within 3 seconds of the end
    const requiredThreshold = Math.max(1, totalDurationSeconds - 3);
    const isCompletedWatch = watchedSeconds >= requiredThreshold;

    if (isCompletedWatch) {
      const set = new Set(progress.completedVideoIds || []);
      set.add(videoId);
      progress.completedVideoIds = Array.from(set);
      this.recalculateCourseProgress(studentId, code, progress);
      return {
        progress,
        verified: true,
        message: `Lesson completed and verified (${watchedSeconds}s / ${totalDurationSeconds}s).`
      };
    }

    return {
      progress,
      verified: false,
      message: `Lesson in progress: ${Math.round(watchedSeconds)}s / ${Math.round(totalDurationSeconds)}s watched. Full playback required to mark complete.`
    };
  }

  public toggleVideoCompleted(studentId: string, courseCode: string, videoId: string): EnrolledCourseProgress {
    const code = courseCode.toUpperCase();
    const progress = this.getOrCreateCourseProgress(studentId, code);

    const set = new Set(progress.completedVideoIds || []);
    if (set.has(videoId)) {
      set.delete(videoId);
    } else {
      set.add(videoId);
    }
    progress.completedVideoIds = Array.from(set);
    progress.progressPercentage = Math.round((progress.completedVideoIds.length / progress.totalVideos) * 100);
    this.recalculateCourseProgress(studentId, code, progress);
    return progress;
  }

  public submitCourseLab(studentId: string, courseCode: string, labId: string, submittedCode?: string): { progress: EnrolledCourseProgress; labCompleted: boolean; success: boolean; message?: string } {
    const code = courseCode.toUpperCase();
    const progress = this.getOrCreateCourseProgress(studentId, code);

    // Validate that code was actually written by the student and is not empty or default placeholder
    if (submittedCode !== undefined) {
      const trimmed = submittedCode.trim();
      const nonCommentLines = trimmed
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith("#") && !l.startsWith("--") && !l.startsWith("//"));

      const codeBody = nonCommentLines.join(" ");
      const isOnlyPass = /^pass;?$/i.test(codeBody) || /def\s+\w+\s*\(.*?\):\s*pass;?$/i.test(codeBody);
      const isPlaceholder = codeBody.includes("raise NotImplementedError") || codeBody.includes("WRITE YOUR IMPLEMENTATION");
      const isTooShort = codeBody.length < 15;

      if (!trimmed || isOnlyPass || isPlaceholder || isTooShort) {
        return {
          progress,
          labCompleted: false,
          success: false,
          message: "❌ Submission Rejected: No custom code implementation detected. Please write your code solution in the compiler before submitting."
        };
      }
    }

    const set = new Set(progress.completedLabIds || []);
    set.add(labId);
    progress.completedLabIds = Array.from(set);
    this.recalculateCourseProgress(studentId, code, progress);

    return { progress, labCompleted: true, success: true, message: "✅ Lab verified and test suite passed!" };
  }

  public submitCourseQuiz(
    studentId: string,
    courseCode: string,
    selectedAnswers: Record<string, number>
  ): {
    score: number;
    maxScore: number;
    passingMarks: number;
    passed: boolean;
    certificateIssued: boolean;
    progress: EnrolledCourseProgress;
    certificate?: CourseCertificate;
    detailedFeedback: { questionId: string; correct: boolean; explanation: string }[];
    attemptsUsed: number;
    maxAttempts: number;
    canReattempt: boolean;
    isLocked: boolean;
    error?: string;
  } {
    const code = courseCode.toUpperCase();
    const curriculum = this.courseCurricula.get(code);
    const quiz = curriculum?.quiz || defaultQuizzesData[code];
    if (!quiz) {
      throw new Error(`No final assessment quiz found for course ${code}`);
    }

    const progress = this.getOrCreateCourseProgress(studentId, code);
    const currentAttempts = progress.quizAttempts || 0;

    // Enforce 3-attempts limit
    if (currentAttempts >= 3 && !progress.quizPassed) {
      return {
        score: progress.quizScore || 0,
        maxScore: quiz.totalMarks,
        passingMarks: quiz.passingMarks,
        passed: false,
        certificateIssued: false,
        progress,
        detailedFeedback: [],
        attemptsUsed: currentAttempts,
        maxAttempts: 3,
        canReattempt: false,
        isLocked: true,
        error: "Maximum assessment attempts reached (3/3). Assessment is locked. Please review course lectures and contact your advisor."
      };
    }

    let correctCount = 0;
    const detailedFeedback = quiz.questions.map((q) => {
      const selected = selectedAnswers[q.id];
      const isCorrect = selected === q.correctAnswerIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        correct: isCorrect,
        explanation: q.explanation
      };
    });

    // Each question worth points based on totalMarks / questions.length (e.g. 20 / 20 = 1 mark)
    const pointsPerQuestion = quiz.totalMarks / quiz.questions.length;
    const score = Math.round(correctCount * pointsPerQuestion);
    const passed = score >= quiz.passingMarks; // Passing mark: 12

    progress.quizScore = score;
    progress.quizPassed = passed;
    progress.quizAttempts = currentAttempts + 1;

    let cert: CourseCertificate | undefined = undefined;

    // Issue certificate ONLY if: all videos completed + all labs completed + quiz score >= 12
    const allVideosDone = progress.completedVideoIds.length >= progress.totalVideos;
    const allLabsDone = (progress.completedLabIds || []).length >= (progress.totalLabs || 0);

    if (allVideosDone && allLabsDone && passed) {
      cert = this.issueCourseCertificate(studentId, code, score);
      progress.status = "COMPLETED";
      progress.progressPercentage = 100;
      progress.certificateId = cert.certificateId;
      progress.certificateIssuedAt = cert.completionDate;
    } else {
      this.recalculateCourseProgress(studentId, code, progress);
    }

    const attemptsNow = progress.quizAttempts;
    const canReattempt = !passed && attemptsNow < 3;
    const isLocked = !passed && attemptsNow >= 3;

    return {
      score,
      maxScore: quiz.totalMarks,
      passingMarks: quiz.passingMarks,
      passed,
      certificateIssued: Boolean(progress.certificateId),
      progress,
      certificate: cert,
      detailedFeedback,
      attemptsUsed: attemptsNow,
      maxAttempts: 3,
      canReattempt,
      isLocked
    };
  }

  public issueCourseCertificate(studentId: string, courseCode: string, quizScore: number = 18): CourseCertificate {
    const code = courseCode.toUpperCase();
    const student = this.getStudent(studentId) || this.getActiveStudent();
    const course = this.courses.get(code);

    const certificateId = `CERT-UNIV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const completionDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const cert: CourseCertificate = {
      certificateId,
      studentId: student.id,
      studentName: student.name,
      courseCode: code,
      courseName: course?.name || code,
      credits: course?.credits || 4,
      completionDate,
      grade: quizScore >= 18 ? "A+ (Highest Honors)" : quizScore >= 16 ? "A (Honors)" : "B+ (Distinction)",
      honors: quizScore >= 18 ? "First Class with Highest Distinction" : "First Class with Distinction",
      quizScore,
      quizMaxScore: 20,
      verificationCode: `VERIFY-${Buffer.from(certificateId + code).toString("hex").slice(0, 10).toUpperCase()}`,
      instructorName: course?.instructor || "University Department Faculty",
      department: course?.department || "Department of Computer Science"
    };

    let certs = this.certificates.get(studentId);
    if (!certs) {
      certs = [];
      this.certificates.set(studentId, certs);
    }
    const idx = certs.findIndex((c) => c.courseCode === code);
    if (idx >= 0) {
      certs[idx] = cert;
    } else {
      certs.push(cert);
    }

    return cert;
  }

  public getStudentCertificates(studentId: string): CourseCertificate[] {
    return this.certificates.get(studentId) || [];
  }

  public updateStudentAvatar(studentId: string, avatar: string): void {
    const s = this.getStudent(studentId);
    if (s) {
      s.avatar = avatar;
    }
  }

}

// Global server singleton
const globalUnivDb = new UniversityDatabase();
export { globalUnivDb };
