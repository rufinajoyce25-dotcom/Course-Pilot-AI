// scratch/update_university_db.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'lib', 'server', 'universityDatabase.ts');
let content = fs.readFileSync(filePath, 'utf8');

const curriculaBlock = `
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
`;

// 1. Insert defaultCurriculaData before class UniversityDatabase
content = content.replace('class UniversityDatabase {', curriculaBlock + '\nclass UniversityDatabase {');

// 2. In constructor, populate curricula and initial learning progress for student1
const initBlock = `
    // Populate Curricula
    for (const [code, videos] of Object.entries(defaultCurriculaData)) {
      const course = this.courses.get(code);
      this.courseCurricula.set(code, {
        courseCode: code,
        courseName: course?.name || code,
        totalVideos: videos.length,
        totalDuration: videos.reduce((acc, v) => acc + parseInt(v.duration.split(":")[0], 10), 0) + " mins",
        videos
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
  }
`;

content = content.replace('this.notifications = [', initBlock.slice(0, -4) + '    this.notifications = [');

// 3. Add helper methods at the end of class UniversityDatabase
const helperMethods = `
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
          transactionId: \`TXN-UNIV-\${Math.floor(100000 + Math.random() * 900000)}\`,
          completedVideoIds: [],
          totalVideos: totalV,
          progressPercentage: 0,
          status: "IN_PROGRESS"
        });
      }
    }

    return Array.from(map.values());
  }

  public toggleVideoCompleted(studentId: string, courseCode: string, videoId: string): EnrolledCourseProgress {
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
      progress = {
        studentId,
        courseCode: code,
        courseName: course?.name || code,
        sectionCode: course?.sections[0]?.sectionCode || "Section A",
        instructor: course?.instructor || "University Faculty",
        credits: course?.credits || 3,
        enrolledAt: "Fall 2026",
        transactionId: \`TXN-UNIV-\${Math.floor(100000 + Math.random() * 900000)}\`,
        completedVideoIds: [],
        totalVideos: curriculum?.videos.length || 6,
        progressPercentage: 0,
        status: "IN_PROGRESS"
      };
      map.set(code, progress);
    }

    const set = new Set(progress.completedVideoIds || []);
    if (set.has(videoId)) {
      set.delete(videoId);
    } else {
      set.add(videoId);
    }
    progress.completedVideoIds = Array.from(set);
    progress.progressPercentage = Math.round((progress.completedVideoIds.length / progress.totalVideos) * 100);

    if (progress.progressPercentage >= 100) {
      progress.status = "COMPLETED";
      if (!progress.certificateId) {
        const cert = this.issueCourseCertificate(studentId, code);
        progress.certificateId = cert.certificateId;
        progress.certificateIssuedAt = cert.completionDate;
      }
    } else {
      progress.status = "IN_PROGRESS";
    }

    return progress;
  }

  public issueCourseCertificate(studentId: string, courseCode: string): CourseCertificate {
    const code = courseCode.toUpperCase();
    const student = this.getStudent(studentId) || this.getActiveStudent();
    const course = this.courses.get(code);

    const certificateId = \`CERT-UNIV-2026-\${Math.floor(100000 + Math.random() * 900000)}\`;
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
      grade: "A (Honors)",
      honors: "First Class with Distinction",
      verificationCode: \`VERIFY-\${Buffer.from(certificateId + code).toString("hex").slice(0, 10).toUpperCase()}\`,
      instructorName: course?.instructor || "University Department Faculty",
      department: course?.department || "Department of Computer Science"
    };

    let certs = this.certificates.get(studentId);
    if (!certs) {
      certs = [];
      this.certificates.set(studentId, certs);
    }
    const idx = certs.findIndex(c => c.courseCode === code);
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
`;

content = content.replace('  public removeTimetableSlot(studentId: string, courseCode: string): void {\n    let slots = this.timetable.get(studentId) || [];\n    slots = slots.filter(s => s.courseCode !== courseCode);\n    this.timetable.set(studentId, slots);\n  }\n}', '  public removeTimetableSlot(studentId: string, courseCode: string): void {\n    let slots = this.timetable.get(studentId) || [];\n    slots = slots.filter(s => s.courseCode !== courseCode);\n    this.timetable.set(studentId, slots);\n  }\n' + helperMethods + '\n}');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated universityDatabase.ts');

