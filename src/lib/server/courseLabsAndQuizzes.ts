import { CourseLab, CourseQuiz } from "@/types";

export const defaultLabsData: Record<string, CourseLab[]> = {
  CS401: [
    {
      id: "cs401-lab1",
      title: "Lab 1: Data Preprocessing, Normalization & Feature Scaling",
      description: "Clean missing values, apply min-max normalization, Z-Score standard scaling, and one-hot encoding on high-dimensional tabular datasets in Python.",
      objectives: [
        "Perform iterative imputation for missing features",
        "Implement Z-Score standardizer: (x - μ) / σ",
        "Verify zero mean (μ=0) and unit variance (σ=1) on training splits"
      ],
      starterCode: "# Lab 1: Data Preprocessing & Feature Scaling\n# Python 3.11 Runtime Environment\n# Objective: Implement the preprocess_pipeline function below.\n# Do not leave this function empty.\n\nimport numpy as np\n\ndef preprocess_pipeline(X):\n    \"\"\"\n    Takes a 2D numpy array X with potential NaN values.\n    1. Impute any missing (NaN) values with column means.\n    2. Standardize features to zero mean and unit variance: (X - mean) / std.\n    3. Return the normalized numpy array.\n    \"\"\"\n    # WRITE YOUR IMPLEMENTATION BELOW:\n    pass\n",
      testCases: [
        { name: "Null check", expected: "0 NaN values remaining" },
        { name: "Unit variance", expected: "Standard deviation = 1.0 ± 0.05" }
      ],
      points: 10
    },
    {
      id: "cs401-lab2",
      title: "Lab 2: Mini-Batch Gradient Descent for Logistic Regression",
      description: "Implement vectorized binary cross-entropy loss and mini-batch gradient descent optimization from mathematical first principles without ML libraries.",
      objectives: [
        "Implement sigmoid activation function: 1 / (1 + e^-z)",
        "Compute cross-entropy loss and weight gradients analytically",
        "Tune learning rate schedule across 200 epochs for optimal convergence"
      ],
      starterCode: "# Lab 2: Mini-Batch Gradient Descent for Logistic Regression\n# Python 3.11 Runtime Environment\n# Objective: Implement logistic regression training from scratch.\n\nimport numpy as np\n\ndef train_logistic_regression(X, y, lr=0.05, epochs=200):\n    \"\"\"\n    Trains binary logistic regression using gradient descent.\n    X: 2D feature matrix (N, D)\n    y: 1D label vector (N,) with binary targets (0 or 1)\n    Returns: 1D learned weights vector (D,)\n    \"\"\"\n    # WRITE YOUR IMPLEMENTATION BELOW:\n    pass\n",
      testCases: [
        { name: "Loss convergence", expected: "Log-Loss < 0.22" },
        { name: "Classification accuracy", expected: "Accuracy >= 91.5%" }
      ],
      points: 10
    },
    {
      id: "cs401-lab3",
      title: "Lab 3: Deep Multilayer Perceptron & Confusion Matrix Auditing",
      description: "Construct a 3-layer feedforward neural network with ReLU activations, Softmax classification output, and audit macro F1-score performance.",
      objectives: [
        "Forward pass with ReLU and Softmax activations",
        "Backpropagation with Adam optimizer momentum terms",
        "Confusion matrix generation with Precision, Recall, and AUC-ROC"
      ],
      starterCode: "# Lab 3: Deep Multilayer Perceptron & Neural Networks\n# Python 3.11 Runtime Environment\n# Objective: Complete the DeepNeuralNetwork class.\n\nimport numpy as np\n\nclass DeepNeuralNetwork:\n    def __init__(self, input_dim, hidden_dim, output_dim):\n        \"\"\"\n        Initialize weight matrices W1 and W2 with random initialization.\n        \"\"\"\n        # WRITE YOUR INITIALIZATION HERE:\n        pass\n    \n    def forward(self, X):\n        \"\"\"\n        Forward pass:\n        Layer 1: ReLU activation\n        Layer 2: Softmax output probabilities\n        \"\"\"\n        # WRITE YOUR FORWARD PASS HERE:\n        pass\n",
      testCases: [
        { name: "Macro F1-score", expected: "F1-Score >= 0.89" },
        { name: "Convergence rate", expected: "Training loss < 0.15" }
      ],
      points: 10
    }
  ],
  CS305: [
    {
      id: "cs305-lab1",
      title: "Lab 1: Advanced Relational Queries & Window Functions",
      description: "Author complex SQL queries utilizing partitioned window functions (ROW_NUMBER, DENSE_RANK), recursive CTEs, and multi-table inner/outer joins.",
      objectives: [
        "Construct 3NF compliant entity relationship schemas",
        "Write partitioned cumulative sum window queries",
        "Implement recursive hierarchical category tree lookups"
      ],
      points: 10
    },
    {
      id: "cs305-lab2",
      title: "Lab 2: B-Tree Index Optimization & Query Execution Plans",
      description: "Analyze EXPLAIN ANALYZE query trees, replace sequential table scans with composite B-Tree indexes, and eliminate disk temporary tables.",
      objectives: [
        "Analyze execution plan cost and I/O buffer hits",
        "Create covering indexes for multi-column WHERE/ORDER BY queries",
        "Benchmark 10x throughput improvement under high concurrency"
      ],
      points: 10
    },
    {
      id: "cs305-lab3",
      title: "Lab 3: ACID Transactions & Concurrency Lock Isolation",
      description: "Simulate concurrent read-write transactions, evaluate dirty reads vs phantom reads across SERIALIZABLE and REPEATABLE READ isolation levels.",
      objectives: [
        "Implement two-phase locking (2PL) protocols",
        "Handle deadlock detection and exponential retry backoff",
        "Verify MVCC snapshot isolation guarantees"
      ],
      points: 10
    }
  ],
  CS320: [
    {
      id: "cs320-lab1",
      title: "Lab 1: Multi-Stage Dockerfile Containerization & Layer Caching",
      description: "Containerize a cloud service with multi-stage Alpine Linux builds, non-root user enforcement, layer cache optimization, and vulnerability scanning.",
      objectives: [
        "Reduce production container image size to under 100MB",
        "Enforce unprivileged user execution (UID 10001)",
        "Pass container security scan with 0 critical/high CVEs"
      ],
      points: 10
    },
    {
      id: "cs320-lab2",
      title: "Lab 2: Kubernetes Ingress, Pod Autoscaling & Rolling Deployments",
      description: "Deploy multi-replica Kubernetes pods, configure ClusterIP/Ingress routing, and benchmark Horizontal Pod Autoscaler (HPA) under spike traffic.",
      objectives: [
        "Configure HPA target at 70% average CPU utilization",
        "Perform zero-downtime rolling update with readiness probes",
        "Verify graceful termination with preStop lifecycle hooks"
      ],
      points: 10
    },
    {
      id: "cs320-lab3",
      title: "Lab 3: Serverless Event Processing with DynamoDB & AWS Lambda",
      description: "Build an asynchronous event-driven streaming pipeline using cloud storage triggers, dead letter queues (DLQ), and idempotent event handlers.",
      objectives: [
        "Deploy serverless function triggered by object storage uploads",
        "Implement DLQ retry routing for poison pill payloads",
        "Enforce idempotent message processing with Redis deduplication"
      ],
      points: 10
    }
  ],
  CS380: [
    {
      id: "cs380-lab1",
      title: "Lab 1: Cryptographic Hash Functions, Salts & PBKDF2/Argon2",
      description: "Implement secure password authentication using cryptographically secure random salts, Argon2/PBKDF2 key derivation, and timing-safe comparisons.",
      objectives: [
        "Generate 256-bit cryptographically secure random salts",
        "Compute PBKDF2 hashes with 100,000 iterations",
        "Demonstrate immunity against timing-attack character comparison"
      ],
      points: 10
    },
    {
      id: "cs380-lab2",
      title: "Lab 2: RSA Public-Key Cryptography & Digital Signature Verification",
      description: "Generate 2048-bit RSA key pairs from distinct prime numbers, execute OAEP ciphertext encryption, and verify tamper-evident digital signatures.",
      objectives: [
        "Compute modular multiplicative inverses for private exponents",
        "Encrypt and decrypt sensitive payload blocks using RSA-OAEP",
        "Detect deliberate 1-bit tampering in signed documents"
      ],
      points: 10
    },
    {
      id: "cs380-lab3",
      title: "Lab 3: OWASP Top 10 Web Security Audit & Threat Remediation",
      description: "Identify and remediate SQL injection, Cross-Site Scripting (XSS), and Cross-Site Request Forgery (CSRF) vulnerabilities across web APIs.",
      objectives: [
        "Convert dynamic SQL string concatenation into parameterized queries",
        "Configure strict Content-Security-Policy (CSP) and CORS policies",
        "Implement anti-CSRF tokens and SameSite=Strict cookies"
      ],
      points: 10
    }
  ],
  CS350: [
    {
      id: "cs350-lab1",
      title: "Lab 1: 2D Spatial Filtering & Canny Edge Detection Kernels",
      description: "Implement 2D convolution kernels, Gaussian blur smoothing filters, Sobel gradient operators, and non-maximum suppression in Python.",
      objectives: [
        "Implement 2D spatial convolution kernel operator",
        "Compute gradient magnitude and orientation arrays",
        "Apply double-threshold hysteresis for edge linking"
      ],
      points: 10
    },
    {
      id: "cs350-lab2",
      title: "Lab 2: Deep Convolutional Neural Network for Image Recognition",
      description: "Train a PyTorch CNN with Conv2D, BatchNorm, MaxPooling, and Dropout layers, applying random affine data augmentations.",
      objectives: [
        "Construct 4-block deep convolutional neural network",
        "Apply real-time image augmentation to prevent overfitting",
        "Achieve >= 92% validation accuracy on test benchmark"
      ],
      points: 10
    },
    {
      id: "cs350-lab3",
      title: "Lab 3: Real-Time YOLO Object Detection & Non-Maximum Suppression",
      description: "Implement Intersection over Union (IoU) metrics and Non-Maximum Suppression (NMS) to eliminate duplicate bounding boxes.",
      objectives: [
        "Compute IoU bounding box coordinates: (A ∩ B) / (A ∪ B)",
        "Apply greedy NMS algorithm with 0.45 IoU threshold",
        "Calculate mean Average Precision (mAP) at 0.50 IoU"
      ],
      points: 10
    }
  ],
  CS420: [
    {
      id: "cs420-lab1",
      title: "Lab 1: BPE Subword Tokenization & Word2Vec Vector Embeddings",
      description: "Implement Byte-Pair Encoding subword tokenization and train Skip-gram word embeddings with negative sampling from raw text corpora.",
      objectives: [
        "Construct 10,000 token vocabulary using BPE frequency merges",
        "Train Skip-gram Word2Vec embeddings with negative sampling",
        "Verify semantic vector analogies (e.g. King - Man + Woman ≈ Queen)"
      ],
      points: 10
    },
    {
      id: "cs420-lab2",
      title: "Lab 2: Bidirectional LSTM Sequence Modeling for Sentiment",
      description: "Build a bidirectional LSTM neural network with embedded dropout and sequence padding to classify natural language sentiment.",
      objectives: [
        "Formulate input, forget, cell state, and output gating mechanisms",
        "Implement bidirectional context concatenation",
        "Evaluate binary cross-entropy on validation test split"
      ],
      points: 10
    },
    {
      id: "cs420-lab3",
      title: "Lab 3: Multi-Head Scaled Dot-Product Self-Attention Transformer",
      description: "Code multi-head scaled dot-product attention: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V with sinusoidal positional embeddings.",
      objectives: [
        "Implement multi-head projection splitting and tensor transposition",
        "Apply causal attention mask to prevent future token lookahead",
        "Add sinusoidal positional embeddings to input representations"
      ],
      points: 10
    }
  ],
  CS310: [
    {
      id: "cs310-lab1",
      title: "Lab 1: Modern Full-Stack Server Actions & Zod Validation",
      description: "Architect Next.js 14 server actions with strict schema parsing, optimistic UI mutations, and robust error boundary handling.",
      objectives: [
        "Write authenticated Server Actions with cookie validation",
        "Parse client payloads with Zod schemas for runtime validation",
        "Implement optimistic UI updates with rollback on server failure"
      ],
      points: 10
    },
    {
      id: "cs310-lab2",
      title: "Lab 2: GraphQL Schema Resolvers & DataLoader Batching",
      description: "Design typed GraphQL schemas, implement nested query resolvers, and integrate DataLoader to eliminate N+1 database queries.",
      objectives: [
        "Define GraphQL TypeDefs and Query/Mutation resolvers",
        "Implement DataLoader batching to collapse multiple DB queries",
        "Optimize in-memory normalized client cache updates"
      ],
      points: 10
    },
    {
      id: "cs310-lab3",
      title: "Lab 3: Core Web Vitals Auditing & Production CI/CD Pipeline",
      description: "Audit web application performance to achieve 95+ scores on Largest Contentful Paint (LCP) and Interaction to Next Paint (INP).",
      objectives: [
        "Implement dynamic route chunking and lazy-loaded components",
        "Configure modern image srcset formats (AVIF/WebP)",
        "Pass Google Lighthouse Core Web Vitals automated CI gate"
      ],
      points: 10
    }
  ],
  CS450: [
    {
      id: "cs450-lab1",
      title: "Lab 1: High-Performance gRPC Bidirectional Streaming",
      description: "Define Protocol Buffer contracts and implement bidirectional asynchronous gRPC streaming with automatic reconnects and exponential backoff.",
      objectives: [
        "Compile proto3 schema into typed client and server stubs",
        "Implement bidirectional streaming pipeline over HTTP/2",
        "Handle channel disconnection with jittered exponential backoff"
      ],
      points: 10
    },
    {
      id: "cs450-lab2",
      title: "Lab 2: Raft Distributed Consensus Leader Election & Heartbeats",
      description: "Implement randomized election timers, RequestVote RPCs, quorum counting, and AppendEntries heartbeat synchronization in Raft.",
      objectives: [
        "Implement state transitions (Follower -> Candidate -> Leader)",
        "Verify majority quorum vote calculation (N/2 + 1)",
        "Enforce leader term monotonicity and split-brain resolution"
      ],
      points: 10
    },
    {
      id: "cs450-lab3",
      title: "Lab 3: Consistent Hashing Ring with Virtual Nodes for Sharding",
      description: "Build a consistent hash ring with virtual nodes to achieve uniform distribution and minimal key relocation during cluster scaling.",
      objectives: [
        "Implement consistent hash ring using 64-bit cryptographic hashing",
        "Assign 150 virtual nodes per physical storage instance",
        "Prove key remapping is strictly bounded to K/N during node joins"
      ],
      points: 10
    }
  ]
};

export const defaultQuizzesData: Record<string, CourseQuiz> = {
  CS401: {
    courseCode: "CS401",
    title: "CS401 Final Academic Assessment: Machine Learning & Statistical Learning",
    totalMarks: 20,
    passingMarks: 12,
    questions: [
      {
        id: "cs401-q1",
        question: "1. In supervised machine learning, what fundamentally distinguishes classification from regression tasks?",
        options: [
          "Classification predicts discrete categorical class labels, whereas regression predicts continuous numeric values.",
          "Classification does not require labeled training data, whereas regression requires extensive ground truth annotations.",
          "Classification models can only be trained with gradient descent, while regression models use analytical matrix equations.",
          "Classification always achieves zero training error, while regression models allow nonzero residuals."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Classification predicts discrete class assignments (e.g. spam/not spam), while regression estimates continuous target values (e.g. housing prices)."
      },
      {
        id: "cs401-q2",
        question: "2. What is the primary mathematical cost function minimized in standard Ordinary Least Squares (OLS) linear regression?",
        options: [
          "Mean Absolute Error (MAE)",
          "Mean Squared Error (MSE) / Sum of Squared Residuals",
          "Binary Cross-Entropy Loss",
          "Kullback-Leibler Divergence"
        ],
        correctAnswerIndex: 1,
        points: 1,
        explanation: "OLS minimizes the sum of squared differences between observed values and values predicted by the linear approximation (Mean Squared Error)."
      },
      {
        id: "cs401-q3",
        question: "3. What is the mathematical range of the standard Logistic (Sigmoid) activation function σ(z) = 1 / (1 + e^-z)?",
        options: [
          "[-1, 1]",
          "(0, 1)",
          "(-∞, +∞)",
          "[0, +∞)"
        ],
        correctAnswerIndex: 1,
        points: 1,
        explanation: "The sigmoid function maps any real-valued number into the open interval (0, 1), making it ideal for interpreting outputs as posterior probabilities."
      },
      {
        id: "cs401-q4",
        question: "4. What is the primary characteristic and effect of L1 Regularization (Lasso) compared to L2 Regularization (Ridge)?",
        options: [
          "L1 regularization drives irrelevant feature weights strictly to zero, producing sparse models that perform feature selection.",
          "L1 regularization squares the weight values in the penalty term, keeping all weights small but non-zero.",
          "L1 regularization can only be applied to unsupervised clustering algorithms like K-Means.",
          "L1 regularization always causes models to underfit significantly compared to unregularized models."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Due to the diamond geometry of the L1 norm ball, optimization contours frequently intersect at axes, shrinking uninformative coefficients to exactly zero."
      },
      {
        id: "cs401-q5",
        question: "5. In the Bias-Variance Tradeoff, what typically happens when model complexity is increased excessively?",
        options: [
          "Both bias and variance increase simultaneously.",
          "Bias decreases but variance increases, leading to potential overfitting on training data.",
          "Variance decreases but bias increases, leading to severe underfitting.",
          "The model becomes completely invariant to training set fluctuations."
        ],
        correctAnswerIndex: 1,
        points: 1,
        explanation: "High model complexity fits training data tightly (reducing bias), but makes predictions highly sensitive to small training variations (increasing variance/overfitting)."
      },
      {
        id: "cs401-q6",
        question: "6. What is the role of the learning rate (α / lr) in Gradient Descent optimization?",
        options: [
          "It determines the number of hidden layers in a neural network.",
          "It scales the step size taken in the direction opposite to the cost function gradient at each iteration.",
          "It defines the total number of samples included in a mini-batch.",
          "It controls the threshold probability for binary classification decisions."
        ],
        correctAnswerIndex: 1,
        points: 1,
        explanation: "The learning rate dictates how aggressively parameters move along the negative gradient vector. Too high can cause divergence; too low causes slow convergence."
      },
      {
        id: "cs401-q7",
        question: "7. How does a Support Vector Machine (SVM) determine the optimal decision boundary?",
        options: [
          "By minimizing the distance between all data points and their centroid cluster.",
          "By maximizing the margin (distance) between the separating hyperplane and the closest training samples (support vectors).",
          "By calculating conditional probability distributions using Bayes' theorem.",
          "By constructing an ensemble of randomized decision trees."
        ],
        correctAnswerIndex: 1,
        points: 1,
        explanation: "SVM is a max-margin classifier: it finds the hyperplane that maximizes the geometric distance to the nearest data points of any class (the support vectors)."
      },
      {
        id: "cs401-q8",
        question: "8. What objective function does the K-Means clustering algorithm iteratively minimize?",
        options: [
          "Cross-Entropy Loss between predicted and ground truth class distributions.",
          "Within-Cluster Sum of Squares (WCSS) / Inertia across all clusters.",
          "The maximum distance between any two clusters (complete linkage).",
          "The likelihood ratio between positive and negative classes."
        ],
        correctAnswerIndex: 1,
        points: 1,
        explanation: "K-Means alternates between cluster assignment and centroid updating to minimize the sum of squared Euclidean distances between points and their assigned centroids."
      },
      {
        id: "cs401-q9",
        question: "9. When evaluating an imbalanced classification model (e.g. rare fraud detection), why is Accuracy an insufficient metric?",
        options: [
          "Accuracy cannot be calculated when class labels are binary.",
          "A naive model predicting only the majority class can yield high accuracy while completely failing to detect any positive instances.",
          "Accuracy is computationally intractable for datasets larger than 1,000 samples.",
          "Accuracy only measures false positives and ignores true positives completely."
        ],
        correctAnswerIndex: 1,
        points: 1,
        explanation: "If 99% of transactions are legitimate, a model predicting 'no fraud' achieves 99% accuracy but 0% recall on fraud. Precision, Recall, and F1-score are necessary."
      },
      {
        id: "cs401-q10",
        question: "10. What is the mathematical formulation of the F1-Score in machine learning evaluation?",
        options: [
          "F1 = (Precision + Recall) / 2 (Arithmetic Mean)",
          "F1 = 2 * (Precision * Recall) / (Precision + Recall) (Harmonic Mean)",
          "F1 = sqrt(Precision * Recall) (Geometric Mean)",
          "F1 = (True Positives + True Negatives) / Total Samples"
        ],
        correctAnswerIndex: 1,
        points: 1,
        explanation: "The F1-Score is the harmonic mean of Precision and Recall, penalizing extreme imbalances between the two metrics much more heavily than an arithmetic average."
      },
      {
        id: "cs401-q11",
        question: "11. What is the primary purpose of Dropout during the training phase of Deep Neural Networks?",
        options: [
                "Preventing co-adaptation of neurons to regularize the network and mitigate overfitting",
                "Speeding up matrix multiplication on GPUs by deleting weights permanently",
                "Converting non-convex loss surfaces into convex quadratic forms",
                "Normalizing batch inputs to have zero mean and unit variance"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Dropout randomly deactivates neurons during training with probability p, forcing the network to learn robust, distributed representations."
      },
      {
        id: "cs401-q12",
        question: "12. What problem in deep neural networks does Batch Normalization primarily alleviate?",
        options: [
                "Internal Covariate Shift by normalizing layer inputs across mini-batches",
                "The need for labeled training target values",
                "Overfitting on small tabular datasets",
                "Having to select learning rates"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Batch Normalization stabilizes layer input distributions across mini-batches, accelerating training and enabling higher learning rates."
      },
      {
        id: "cs401-q13",
        question: "13. What is the fundamental difference between Bagging (e.g. Random Forest) and Boosting (e.g. XGBoost)?",
        options: [
                "Bagging trains independent base learners in parallel to reduce variance; Boosting trains learners sequentially to correct predecessors' errors and reduce bias.",
                "Bagging only works on neural networks, while Boosting only works on linear regression.",
                "Bagging increases model complexity, while Boosting simplifies trees to single nodes.",
                "Bagging requires gradient computation, while Boosting uses simple averaging."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Bagging aggregates independent parallel models to reduce variance. Boosting trains sequential models where each corrects previous errors, reducing bias."
      },
      {
        id: "cs401-q14",
        question: "14. What activation function is defined as f(x) = max(0, x), and what major issue does it solve over Sigmoid?",
        options: [
                "Rectified Linear Unit (ReLU); it mitigates vanishing gradients for positive inputs during backpropagation.",
                "Hyperbolic Tangent (Tanh); it guarantees zero-centered outputs.",
                "Leaky ReLU; it prevents dying neurons for large positive values.",
                "Softplus; it provides continuous differentiability at zero."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "ReLU has constant gradient of 1 for x > 0, preventing exponential gradient decay (vanishing gradient) in deep networks."
      },
      {
        id: "cs401-q15",
        question: "15. In an ROC curve, what quantities are plotted on the X-axis and Y-axis respectively?",
        options: [
                "X-axis: False Positive Rate (1 - Specificity); Y-axis: True Positive Rate (Sensitivity / Recall)",
                "X-axis: Precision; Y-axis: Accuracy",
                "X-axis: Training Loss; Y-axis: Validation Loss",
                "X-axis: F1-Score; Y-axis: Specificity"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "ROC plots False Positive Rate (FPR) on X against True Positive Rate (TPR) on Y across various classification thresholds."
      },
      {
        id: "cs401-q16",
        question: "16. In reinforcement learning, what does the Bellman Optimality Equation compute?",
        options: [
                "The recursive relationship between the optimal value of a state and the expected values of subsequent successor states",
                "The gradient of policy weights with respect to the loss function",
                "The covariance matrix of environmental observations",
                "The maximum depth of the Markov Decision Process tree"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "The Bellman equation decomposes value functions recursively into immediate reward plus discounted value of following optimal actions from successor states."
      },
      {
        id: "cs401-q17",
        question: "17. What distinguishes Stochastic Gradient Descent (SGD) from Batch Gradient Descent?",
        options: [
                "SGD computes parameter updates using a single training example (or mini-batch) at a time, introducing noisy but rapid progress.",
                "SGD computes updates across the entire dataset before making a single parameter change.",
                "SGD does not require computing analytical derivatives.",
                "SGD always achieves monotonic loss reduction at every iteration."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "SGD calculates gradients on small subsets (or single samples), offering much faster iteration speed and escaping saddle points."
      },
      {
        id: "cs401-q18",
        question: "18. What is the curse of dimensionality and how does it impact nearest-neighbor (KNN) algorithms?",
        options: [
                "As feature dimension grows, volume grows exponentially, making all data points equidistant and rendering distance metrics ineffective.",
                "Higher dimensions cause training matrices to become non-invertible.",
                "KNN runs out of memory because labels require quadratic storage.",
                "Dimension growth causes all weights to converge to zero."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "In high dimensional space, data points become sparse and distances between arbitrary pairs converge, degrading distance-based methods like KNN."
      },
      {
        id: "cs401-q19",
        question: "19. In Natural Language Processing and generative models, what is the purpose of Cross-Entropy Loss?",
        options: [
                "Measuring the divergence between the true one-hot token distribution and the predicted softmax probability distribution",
                "Minimizing Euclidean distance between continuous word embeddings",
                "Eliminating punctuation from input sequences",
                "Calculating token count frequency across documents"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Cross-entropy loss quantifies difference between true discrete probability distributions and predicted softmax distributions."
      },
      {
        id: "cs401-q20",
        question: "20. What is the fundamental property of the Adam optimizer that distinguishes it from classical SGD?",
        options: [
                "It maintains adaptive learning rates for each parameter based on first (mean) and second (uncentered variance) moments of gradients.",
                "It computes the Hessian matrix explicitly at each step.",
                "It is strictly non-differentiable and uses genetic search.",
                "It requires zero hyperparameter configuration."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Adam combines AdaGrad and RMSProp advantages by tracking exponentially decaying averages of past gradients (first moment) and squared gradients (second moment)."
      }
    ]
  },
  CS305: {
    courseCode: "CS305",
    title: "CS305 Final Academic Assessment: Database Systems & Architecture",
    totalMarks: 20,
    passingMarks: 12,
    questions: [
      {
        id: "cs305-q1",
        question: "1. What does the 'I' in the ACID properties of database transactions represent?",
        options: [
          "Immutability: Database records can never be modified or deleted once committed.",
          "Isolation: Concurrent transaction executions do not interfere with each other and produce serializable results.",
          "Integrity: All foreign key constraints are enforced instantaneously.",
          "Idempotence: Executing a query multiple times produces the identical state."
        ],
        correctAnswerIndex: 1,
        points: 1,
        explanation: "Isolation ensures that uncommitted transactions are isolated from each other, preventing concurrency anomalies such as dirty reads and non-repeatable reads."
      },
      {
        id: "cs305-q2",
        question: "2. Why are B+ Trees predominantly preferred over standard binary search trees for disk-based relational database indexes?",
        options: [
          "B+ Trees have a high branching factor, allowing shallow tree depth that dramatically minimizes expensive disk I/O operations.",
          "B+ Trees consume zero RAM memory and operate entirely inside CPU cache registers.",
          "B+ Trees can only index numerical columns, avoiding character comparison overhead.",
          "B+ Trees do not require rebalancing operations during record insertions."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "With fanout in the hundreds, B+ trees keep millions of records within 3–4 levels, meaning only 3–4 block reads from disk are required to locate any record."
      },
      {
        id: "cs305-q3",
        question: "3. What condition defines a relational database table in Third Normal Form (3NF)?",
        options: [
          "It contains no composite primary keys.",
          "It is in 2NF and contains no transitive dependencies for non-prime attributes.",
          "Every determinant attribute is an explicit candidate superkey.",
          "All table columns are strictly constrained to integer data types."
        ],
        correctAnswerIndex: 1,
        points: 1,
        explanation: "3NF requires that a relation is in 2NF and no non-prime attribute is transitively dependent on the primary key (every non-key attribute must depend directly on the key)."
      },
      {
        id: "cs305-q4",
        question: "4. What is a 'Dirty Read' anomaly in concurrent database transactions?",
        options: [
          "A transaction reads data that has been modified by another uncommitted transaction which is subsequently rolled back.",
          "A transaction re-reads a row and finds that values have changed because another transaction committed in between.",
          "A transaction executes a range query and discovers newly inserted rows that satisfied the search condition.",
          "A transaction fails to acquire a write lock due to deadlocks."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "A dirty read occurs when transaction T1 reads data modified by uncommitted transaction T2. If T2 rolls back, T1 processed phantom data that never officially existed."
      },
      {
        id: "cs305-q5",
        question: "5. What is the fundamental difference between a Clustered Index and a Non-Clustered Index?",
        options: [
          "A clustered index physically dictates the on-disk storage ordering of table rows (only one per table); non-clustered indexes store pointers to rows.",
          "A clustered index is stored in memory, while non-clustered indexes are stored on flash disk.",
          "A clustered index cannot contain unique values, whereas non-clustered indexes enforce uniqueness.",
          "A clustered index is only available in NoSQL document stores."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Because physical table rows can only be ordered in one sequence on disk, a table can possess only one clustered index. Non-clustered indexes maintain auxiliary pointer structures."
      },
      {
        id: "cs305-q6",
        question: "6. What is the function of the Write-Ahead Logging (WAL) protocol in database engines?",
        options: [
          "It encrypts all network requests before sending them over the database connection pool.",
          "It ensures log records describing data mutations are flushed to persistent disk before the corresponding dirty data pages are written to the database files.",
          "It caches read queries in memory to bypass disk execution.",
          "It automatically archives deleted rows to cold backup storage."
        ],
        correctAnswerIndex: 1,
        points: 1,
        explanation: "WAL guarantees the Atomicity and Durability (A and D of ACID) by ensuring that in the event of a system crash, changes can be cleanly REDO-ed or UNDO-ed from the disk log."
      },
      {
        id: "cs305-q7",
        question: "7. Which SQL JOIN type returns all records from the left table, and the matched records from the right table, filling with NULLs if no match exists?",
        options: [
          "INNER JOIN",
          "LEFT OUTER JOIN",
          "CROSS JOIN",
          "FULL OUTER JOIN"
        ],
        correctAnswerIndex: 1,
        points: 1,
        explanation: "A LEFT OUTER JOIN returns all rows from the left table, regardless of whether a matching row exists in the right table; unmatched right attributes are populated with NULL."
      },
      {
        id: "cs305-q8",
        question: "8. What query optimization strategy does EXPLAIN ANALYZE perform in relational databases?",
        options: [
          "It executes the query and prints the actual execution tree along with CPU time, row counts, and I/O buffer reads per node.",
          "It automatically creates missing indexes without user intervention.",
          "It rewrites all subqueries into recursive stored procedures.",
          "It permanently stores query result sets in disk cache."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "EXPLAIN ANALYZE runs the query and outputs the actual plan tree with accurate timings, buffer hits, and row statistics to help engineers identify bottlenecks."
      },
      {
        id: "cs305-q9",
        question: "9. In database sharding architectures, what is the primary purpose of Consistent Hashing?",
        options: [
          "To ensure that adding or removing a shard node requires remapping only a small fraction (K/N) of the keys rather than all keys.",
          "To encrypt sensitive data rows using asymmetric RSA keys.",
          "To eliminate the need for primary keys in sharded database tables.",
          "To synchronize clocks across all shard servers without using NTP."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Standard modulo hashing requires remapping nearly all keys when node count changes. Consistent hashing distributes keys along a ring, relocating only K/N keys upon node changes."
      },
      {
        id: "cs305-q10",
        question: "10. What does the CAP Theorem state regarding distributed database systems in the presence of network partitions?",
        options: [
          "A distributed data store can simultaneously provide all three guarantees: Consistency, Availability, and Partition Tolerance.",
          "When a network partition occurs, the system must choose between Consistency (returning errors or waiting) or Availability (serving potentially stale data).",
          "Partition tolerance is optional and can be avoided by using fiber optic cables.",
          "Relational databases are inherently immune to network partitions."
        ],
        correctAnswerIndex: 1,
        points: 1,
        explanation: "Because physical network partitions (P) are unavoidable in distributed environments, a system can either prioritize Consistency (CP) or Availability (AP) during partitions."
      },
      {
        id: "cs305-q11",
        question: "11. What concurrency deadlock prevention scheme aborts the older transaction if a younger transaction holds a requested resource?",
        options: [
                "Wound-Wait Scheme",
                "Wait-Die Scheme",
                "Two-Phase Commit Protocol",
                "Optimistic Timestamp Ordering"
      ],
        correctAnswerIndex: 1,
        points: 1,
        explanation: "In Wait-Die, an older transaction can wait for a younger one, but a younger transaction dies (aborts) if it requests a lock held by an older one."
      },
      {
        id: "cs305-q12",
        question: "12. In SQL window functions, what distinguishes ROW_NUMBER() from RANK()?",
        options: [
                "ROW_NUMBER() assigns strictly consecutive distinct integers even on ties, whereas RANK() assigns identical rank to ties and skips subsequent numbers.",
                "ROW_NUMBER() can only be computed in ascending order.",
                "RANK() cannot be used with PARTITION BY.",
                "ROW_NUMBER() requires an external sorting engine."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "ROW_NUMBER produces monotonic integers (1, 2, 3), whereas RANK produces tied ranks with gaps (1, 2, 2, 4)."
      },
      {
        id: "cs305-q13",
        question: "13. What is the fundamental purpose of the Two-Phase Commit (2PC) protocol in distributed database transactions?",
        options: [
                "Ensuring atomic commit or abort across multiple distributed database nodes",
                "Dividing queries into two separate HTTP requests",
                "Compressing relational tables into two stages",
                "Creating read-only database replicas"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "2PC coordinates all participants across Prepare and Commit phases to ensure all nodes either commit or abort together."
      },
      {
        id: "cs305-q14",
        question: "14. In database indexing, what is a Hash Index best suited for?",
        options: [
                "O(1) exact-match point lookups (=), but ineffective for range queries (<, >, BETWEEN)",
                "Range queries across dates and timestamps",
                "Full-text search ranking and fuzzy matching",
                "Spatial coordinate boundary containment"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Hash indexes compute buckets using hash functions, giving O(1) equality lookups but zero ordering for range queries."
      },
      {
        id: "cs305-q15",
        question: "15. What does the Two-Phase Locking (2PL) protocol guarantee when all transactions follow Growing and Shrinking phases?",
        options: [
                "Conflict Serializability",
                "Freedom from deadlocks",
                "Zero lock contention",
                "Instantaneous transaction commits"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "2PL guarantees conflict serializability, though it does not eliminate the possibility of deadlocks."
      },
      {
        id: "cs305-q16",
        question: "16. What is the difference between a CLUSTERED index and a NONCLUSTERED index in relational engines?",
        options: [
                "A clustered index physically sorts and stores the actual table rows in leaf order, while a nonclustered index stores index pointers pointing to the row locations.",
                "A clustered index cannot contain numeric keys.",
                "A nonclustered index can only exist once per database table.",
                "Clustered indexes are stored exclusively in RAM."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "There can be only one clustered index per table because data rows can only be physically sorted in one order."
      },
      {
        id: "cs305-q17",
        question: "17. What SQL clause is used to filter aggregated grouped rows resulting from a GROUP BY query?",
        options: [
                "HAVING",
                "WHERE",
                "FILTER BY",
                "PARTITION"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY computation."
      },
      {
        id: "cs305-q18",
        question: "18. What is the consequence of cascading deletes on a FOREIGN KEY constraint?",
        options: [
                "Deleting a parent record automatically deletes all referencing child records in child tables.",
                "Deleting a parent record is permanently rejected.",
                "Foreign keys are set to string 'DELETED'.",
                "The parent table schema is dropped."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "ON DELETE CASCADE propagates parent deletions to all child rows with matching foreign key references."
      },
      {
        id: "cs305-q19",
        question: "19. In relational query execution, which join algorithm is generally most efficient when both inputs are pre-sorted on join keys?",
        options: [
                "Sort-Merge Join",
                "Nested Loop Join",
                "Grace Hash Join",
                "Cartesian Broadcast Join"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "When inputs are already sorted (e.g. from B+ tree indexes), Sort-Merge Join linearly scans both inputs in O(M + N) time."
      },
      {
        id: "cs305-q20",
        question: "20. What is the primary characteristic of an idempotent database update operation?",
        options: [
                "Applying the operation multiple times produces the identical database state as applying it exactly once.",
                "The operation can only be executed during scheduled maintenance windows.",
                "The operation requires distributed consensus from all replicas.",
                "The operation cannot be recorded in the write-ahead log."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "An operation is idempotent if f(f(x)) = f(x); executing it repeatedly has no additional effect beyond the initial run."
      }
    ]
  },
  CS320: {
    courseCode: "CS320",
    title: "CS320 Final Academic Assessment: Cloud Computing & Infrastructure Architecture",
    totalMarks: 20,
    passingMarks: 12,
    questions: [
      {
        id: "cs320-q1",
        question: "1. In cloud computing service models, what responsibility boundary separates Platform as a Service (PaaS) from Infrastructure as a Service (IaaS)?",
        options: [
          "In PaaS, the cloud provider manages operating systems, runtimes, and middleware, while the customer manages applications and data.",
          "In IaaS, the customer only manages application code, while the provider manages physical racks and databases.",
          "PaaS requires dedicated bare-metal servers, whereas IaaS uses shared containers.",
          "There is no operational distinction between PaaS and IaaS."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "In IaaS, the customer provisions and configures OS and runtime environments. In PaaS, the provider abstracts and maintains the OS/runtime, leaving application code to the user."
      },
      {
        id: "cs320-q2",
        question: "2. What is the role of Kubernetes Pods in container orchestration?",
        options: [
          "A Pod is the smallest deployable computing unit in Kubernetes, encapsulating one or more co-located containers sharing network namespaces and storage volumes.",
          "A Pod is a physical server located in a public cloud data center.",
          "A Pod is a DNS load balancing server that routes internet traffic into clusters.",
          "A Pod is a persistent relational database engine native to Linux kernels."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "In Kubernetes, containers are encapsulated inside Pods, which share an IP address, localhost loopback network, and mounted storage volumes."
      },
      {
        id: "cs320-q3",
        question: "3. What is a key operational benefit of multi-stage Docker builds?",
        options: [
          "They compile and package code in an intermediate image, copying only production artifacts into a minimal base image (e.g. Alpine/Distroless), reducing image size and attack surface.",
          "They automatically deploy containers across multi-region cloud providers simultaneously.",
          "They eliminate the need for CPU and memory resource quotas.",
          "They convert containerized code into bare-metal binary firmware."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Multi-stage builds leave heavy compilers, SDKs, and build tooling behind in temporary stages, producing final production images that are lightweight and highly secure."
      },
      {
        id: "cs320-q4",
        question: "4. What is the difference between Horizontal Scaling and Vertical Scaling in cloud infrastructure?",
        options: [
          "Horizontal scaling adds more machine instances/nodes to a cluster; vertical scaling upgrades CPU, RAM, or I/O capacity on an existing instance.",
          "Horizontal scaling increases CPU clock speed; vertical scaling adds additional storage disks.",
          "Horizontal scaling requires server shutdowns, whereas vertical scaling never causes downtime.",
          "Vertical scaling is only applicable to serverless architectures."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Horizontal scaling (scaling out) adds more node replicas to distribute workload, providing linear elasticity and fault tolerance compared to vertical scaling (scaling up)."
      },
      {
        id: "cs320-q5",
        question: "5. What is the operational purpose of a Kubernetes Ingress Controller?",
        options: [
          "It manages external HTTP/HTTPS routing, SSL/TLS termination, and path-based request distribution to internal ClusterIP services.",
          "It monitors worker node hardware temperatures and triggers fan cooling.",
          "It replaces the container runtime engine (Docker/containerd).",
          "It archives deleted container logs to cold object storage."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "An Ingress Controller acts as an edge reverse proxy and layer-7 load balancer that maps external URL paths and hostnames to internal services with unified TLS certificates."
      },
      {
        id: "cs320-q6",
        question: "6. How do Serverless functions (e.g. AWS Lambda / Cloud Functions) scale under sudden bursts of incoming traffic?",
        options: [
          "By automatically instantiating isolated micro-VM execution environments concurrently in response to incoming request events.",
          "By waiting for a system administrator to manually increase VM core allocation.",
          "By queuing all incoming requests until a single execution thread finishes.",
          "By transferring incoming requests to an on-premise fallback server."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Serverless platforms scale horizontally on demand by launching concurrent container/micro-VM sandboxes per incoming event, with zero servers running during idle periods."
      },
      {
        id: "cs320-q7",
        question: "7. What does the term 'Infrastructure as Code' (IaC) represent in DevOps methodologies?",
        options: [
          "Managing and provisioning computing infrastructure through version-controlled configuration files (e.g. Terraform, CloudFormation) rather than manual GUI clicks.",
          "Writing low-level assembly code to configure CPU motherboards directly.",
          "Hosting website HTML code inside database stored procedures.",
          "Replacing software development engineers with hardware network technicians."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "IaC treats infrastructure provisioning with software engineering best practices: declarative configuration files, automated linting, code reviews, and reproducible deployments."
      },
      {
        id: "cs320-q8",
        question: "8. What is the primary function of a Content Delivery Network (CDN) like Cloudflare or CloudFront?",
        options: [
          "Caching static and dynamic assets at globally distributed Edge locations close to end users to reduce latency and origin server load.",
          "Compiling backend Java and C++ microservices into container images.",
          "Managing primary relational database transactions across master nodes.",
          "Generating SSL private encryption keys on client mobile devices."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "CDNs maintain points-of-presence (PoPs) worldwide that serve cached assets with single-digit millisecond latency, shielding origin datacenters from traffic surges."
      },
      {
        id: "cs320-q9",
        question: "9. In cloud disaster recovery planning, what is the definition of Recovery Time Objective (RTO)?",
        options: [
          "The maximum acceptable duration of time that an application can remain offline after a disaster before service is restored.",
          "The maximum acceptable amount of data loss measured in time units.",
          "The time required to purchase physical server racks from hardware vendors.",
          "The annual uptime percentage SLA guaranteed by the cloud vendor."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "RTO defines how quickly systems must be restored following an outage. In contrast, RPO (Recovery Point Objective) defines the maximum acceptable data loss in time."
      },
      {
        id: "cs320-q10",
        question: "10. What security principle dictates granting cloud IAM roles only the exact permissions needed to execute their specific task?",
        options: [
          "Principle of Least Privilege (PoLP)",
          "Zero-Day Vulnerability Rule",
          "Full Root Delegation Principle",
          "Public Availability Maxim"
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "PoLP ensures that identities, services, and workloads have only the minimal necessary permissions required to fulfill their function, drastically limiting blast radius upon compromise."
      },
      {
        id: "cs320-q11",
        question: "11. In Cloud Computing & DevOps, how does horizontal scaling differ fundamentally from vertical scaling?",
        options: [
                "Horizontal scaling adds more machine nodes to a distributed cluster, whereas vertical scaling upgrades CPU/RAM on a single machine.",
                "Horizontal scaling requires taking the system completely offline.",
                "Vertical scaling distributes data across partitioned shards.",
                "Horizontal scaling can only run in a single availability zone."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Horizontal scaling scales out by adding commodity nodes; vertical scaling scales up by augmenting compute resources of an individual machine."
      },
      {
        id: "cs320-q12",
        question: "12. What primary advantage does asynchronous non-blocking I/O provide in high-throughput network architectures?",
        options: [
                "Enables a single process or event loop to handle thousands of concurrent connections without thread-per-connection context switching overhead",
                "Guarantees zero-latency packet transmission over physical fiber",
                "Encrypts payload buffers without CPU cycle consumption",
                "Prevents TCP connection drops during network partitions"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Non-blocking I/O uses OS event notification (e.g. epoll, kqueue) to multiplex massive concurrent sockets efficiently."
      },
      {
        id: "cs320-q13",
        question: "13. What is the purpose of rate limiting algorithms like Token Bucket or Leaky Bucket in API gateway design?",
        options: [
                "Controlling request traffic rates to prevent resource exhaustion, mitigate DoS attacks, and protect downstream services",
                "Compressing outgoing JSON payloads into binary streams",
                "Routing incoming traffic to the nearest geographic edge node",
                "Translating REST API requests into GraphQL queries"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Token Bucket allows controlled burstiness while enforcing a sustainable average rate, guarding backend services."
      },
      {
        id: "cs320-q14",
        question: "14. In distributed systems, what does the CAP theorem state regarding network partitions?",
        options: [
                "During a network partition, a distributed system must choose between Consistency (all nodes see the same data) and Availability (every request receives a non-error response).",
                "A system can achieve Consistency, Availability, and Partition Tolerance simultaneously at all times.",
                "Network partitions can be permanently eliminated with fiber optics.",
                "Partition tolerance only applies to relational SQL databases."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "When network communication fails (P), the system must trade off between returning stale/failed responses (A) or waiting for sync (C)."
      },
      {
        id: "cs320-q15",
        question: "15. What security vulnerability does a Cross-Site Request Forgery (CSRF) attack exploit?",
        options: [
                "The browser's automatic inclusion of stored session authentication credentials (cookies) with unauthorized third-party requests",
                "Injecting malicious executable JavaScript into HTML responses (XSS)",
                "Overrunning a fixed memory buffer on the operating system kernel",
                "Modifying SQL query tokens via untrusted input parameters"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "CSRF tricks a user's browser into sending authenticated HTTP requests using existing session cookies without the user's intent."
      },
      {
        id: "cs320-q16",
        question: "16. What is the primary role of a reverse proxy (such as NGINX or Envoy) in modern web infrastructure?",
        options: [
                "Terminating SSL/TLS, load balancing incoming requests across internal services, and caching static assets",
                "Compiling frontend React JSX into machine assembly code",
                "Providing persistent non-volatile disk storage for database tables",
                "Translating domain names into IP addresses via DNS resolution"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Reverse proxies shield origin servers, perform TLS offloading, distribute traffic, and handle edge response caching."
      },
      {
        id: "cs320-q17",
        question: "17. In cryptographic communication protocols (e.g. TLS 1.3), what does Perfect Forward Secrecy (PFS) guarantee?",
        options: [
                "Compromise of the server's long-term private key does not compromise past session keys or decrypt recorded historical traffic.",
                "The client and server can communicate without exchanging public keys.",
                "Messages are immune to quantum computing decryption forever.",
                "The session requires zero encryption overhead."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "PFS uses ephemeral Diffie-Hellman exchanges so each session key is unique and temporary, protecting past traffic."
      },
      {
        id: "cs320-q18",
        question: "18. What is the fundamental operational principle of the Circuit Breaker pattern in microservice architectures?",
        options: [
                "Failing fast when downstream services exhibit consecutive errors, preventing cascading failures and allowing the dependency to recover",
                "Encrypting all inter-service communications using mTLS",
                "Routing all database writes to a single master instance",
                "Automatically restarting container pods upon memory exhaustion"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Circuit breakers transition from Closed to Open upon repeated failures, cutting traffic to prevent system-wide resource starvation."
      },
      {
        id: "cs320-q19",
        question: "19. What is the primary operational trade-off of database sharding (horizontal database partitioning)?",
        options: [
                "Enables massive write scalability, but introduces significant complexity for cross-shard joins, transactions, and rebalancing",
                "Reduces query latency for all possible multi-table join patterns",
                "Eliminates the need for indexing tables",
                "Guarantees immediate global ACID transactions across all partitions"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Sharding partitions data across independent database nodes, scaling storage and writes at the expense of cross-shard transactional complexity."
      },
      {
        id: "cs320-q20",
        question: "20. What is a Zero-Trust architecture in enterprise and cloud security?",
        options: [
                "A security model that requires strict continuous identity verification and least-privilege access for every request, regardless of whether it originates inside or outside the network perimeter.",
                "A network where all firewalls are disabled for maximum speed",
                "A protocol that trusts all requests originating from local subnet IP addresses",
                "An architecture where no cryptographic keys are ever stored on servers"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Zero Trust operates on 'never trust, always verify', enforcing contextual authentication and authorization on every transaction."
      }
    ]
  },
  CS380: {
    courseCode: "CS380",
    title: "CS380 Final Academic Assessment: Cybersecurity, Cryptography & Defensive Architecture",
    totalMarks: 20,
    passingMarks: 12,
    questions: [
      {
        id: "cs380-q1",
        question: "1. What are the three foundational pillars of the Information Security 'CIA Triad'?",
        options: [
          "Confidentiality, Integrity, and Availability",
          "Cryptography, Inspection, and Authentication",
          "Compliance, Isolation, and Auditing",
          "Certificates, Identity, and Access"
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "The CIA triad defines the core security objectives: Confidentiality (privacy of data), Integrity (accuracy and untampered state), and Availability (authorized accessibility)."
      },
      {
        id: "cs380-q2",
        question: "2. How does Symmetric Encryption differ fundamentally from Asymmetric Encryption?",
        options: [
          "Symmetric encryption uses the same shared secret key for both encryption and decryption; asymmetric uses a public/private key pair.",
          "Symmetric encryption can only encrypt text, while asymmetric encryption only encrypts images.",
          "Symmetric encryption does not require mathematical keys.",
          "Symmetric encryption is only used for SSL/TLS handshakes, never for data at rest."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Symmetric algorithms (e.g. AES-256) use one secret key for both operations. Asymmetric algorithms (e.g. RSA, ECC) use public keys to encrypt and private keys to decrypt."
      },
      {
        id: "cs380-q3",
        question: "3. What property makes cryptographic hash functions like SHA-256 'one-way'?",
        options: [
          "Preimage resistance: It is computationally infeasible to determine the original input given its hash output.",
          "The hash output size increases proportionally with the input file length.",
          "The hash algorithm requires an active internet connection to evaluate.",
          "Hashes can only be computed in forward sequential order."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Preimage resistance ensures that given a hash value h, finding any message m such that hash(m) = h is computationally impossible under modern computing limits."
      },
      {
        id: "cs380-q4",
        question: "4. What is the purpose of adding a cryptographic 'Salt' prior to hashing passwords?",
        options: [
          "To ensure that identical passwords generate completely different hashes, neutralizing precomputed Rainbow Table attacks.",
          "To compress long passwords into shorter strings before database insertion.",
          "To allow administrators to recover lost plaintext passwords.",
          "To speed up password verification calculations by 10x."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "A unique random salt appended to each password guarantees distinct hash values even for identical passwords, rendering precomputed lookup tables (rainbow tables) useless."
      },
      {
        id: "cs380-q5",
        question: "5. What core vulnerability enables SQL Injection (SQLi) attacks in web applications?",
        options: [
          "Concatenating untrusted user input directly into dynamic SQL query strings instead of using parameterized prepared statements.",
          "Using open-source relational databases like PostgreSQL instead of proprietary software.",
          "Enabling foreign key constraints on relational tables.",
          "Running database servers on port 5432."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "SQL injection occurs when user input is treated as executable code by the SQL interpreter. Parameterized queries enforce strict separation between code and user data."
      },
      {
        id: "cs380-q6",
        question: "6. How does a Digital Signature provide Non-Repudiation in secure communications?",
        options: [
          "It signs the document hash using the sender's private key, which can only be verified using their public key, proving the sender's identity beyond doubt.",
          "It encrypts the entire email with a temporary symmetric password.",
          "It records the sender's physical IP address in a public blockchain.",
          "It requires two witnesses to countersign the network transaction."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Because only the owner holds the private key, successfully verifying a signature with the corresponding public key proves authenticity and prevents denying authorship (non-repudiation)."
      },
      {
        id: "cs380-q7",
        question: "7. What security posture defines the 'Zero Trust' architecture model?",
        options: [
          "'Never trust, always verify': Every user, device, and network transaction must be authenticated and authorized continuously, regardless of location.",
          "Trusting all traffic that originates inside the internal corporate firewall perimeter.",
          "Disabling all user accounts that do not have biometric hardware dongles.",
          "Blocking all incoming traffic from public internet domains unconditionally."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Zero Trust abandons the obsolete castle-and-moat security model, treating all network traffic—internal or external—as potentially hostile until explicitly verified."
      },
      {
        id: "cs380-q8",
        question: "8. What is the function of Public Key Infrastructure (PKI) and Certificate Authorities (CAs)?",
        options: [
          "To bind public cryptographic keys to verified entity identities using digitally signed X.509 digital certificates.",
          "To store backup copies of all private encryption keys on government servers.",
          "To regulate internet domain registration fees globally.",
          "To replace symmetric AES encryption in web browsers."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "PKI and trusted CAs establish an unbroken chain of trust that validates whether a given public key legitimately belongs to the specific domain or organization claiming it."
      },
      {
        id: "cs380-q9",
        question: "9. In Cross-Site Scripting (XSS) attacks, what unauthorized action does the attacker achieve?",
        options: [
          "Injecting malicious clientside scripts (JavaScript) into web applications that execute in the browser context of other unsuspecting users.",
          "Overloading server bandwidth with millions of spoofed UDP packets.",
          "Modifying database rows directly through open SSH ports.",
          "Decrypting TLS packets using quantum computer simulations."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "XSS allows attackers to execute rogue scripts inside victim browsers, enabling session cookie theft, keylogging, and unauthorized API actions in the victim's authenticated session."
      },
      {
        id: "cs380-q10",
        question: "10. What is Perfect Forward Secrecy (PFS) in TLS/SSL secure communications?",
        options: [
          "A property of key-exchange protocols where compromise of a server's long-term private key does not compromise past session keys or historical ciphertext.",
          "A protocol that guarantees encryption keys will never expire.",
          "An algorithm that completely prevents Man-in-the-Middle network sniffing.",
          "A backup system that re-encrypts stored databases every 24 hours."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Using ephemeral Diffie-Hellman (ECDHE), each TLS session derives unique disposable keys. Even if the server's master key is compromised years later, past sessions cannot be decrypted."
      },
      {
        id: "cs380-q11",
        question: "11. In Cybersecurity & Cryptography, how does horizontal scaling differ fundamentally from vertical scaling?",
        options: [
                "Horizontal scaling adds more machine nodes to a distributed cluster, whereas vertical scaling upgrades CPU/RAM on a single machine.",
                "Horizontal scaling requires taking the system completely offline.",
                "Vertical scaling distributes data across partitioned shards.",
                "Horizontal scaling can only run in a single availability zone."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Horizontal scaling scales out by adding commodity nodes; vertical scaling scales up by augmenting compute resources of an individual machine."
      },
      {
        id: "cs380-q12",
        question: "12. What primary advantage does asynchronous non-blocking I/O provide in high-throughput network architectures?",
        options: [
                "Enables a single process or event loop to handle thousands of concurrent connections without thread-per-connection context switching overhead",
                "Guarantees zero-latency packet transmission over physical fiber",
                "Encrypts payload buffers without CPU cycle consumption",
                "Prevents TCP connection drops during network partitions"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Non-blocking I/O uses OS event notification (e.g. epoll, kqueue) to multiplex massive concurrent sockets efficiently."
      },
      {
        id: "cs380-q13",
        question: "13. What is the purpose of rate limiting algorithms like Token Bucket or Leaky Bucket in API gateway design?",
        options: [
                "Controlling request traffic rates to prevent resource exhaustion, mitigate DoS attacks, and protect downstream services",
                "Compressing outgoing JSON payloads into binary streams",
                "Routing incoming traffic to the nearest geographic edge node",
                "Translating REST API requests into GraphQL queries"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Token Bucket allows controlled burstiness while enforcing a sustainable average rate, guarding backend services."
      },
      {
        id: "cs380-q14",
        question: "14. In distributed systems, what does the CAP theorem state regarding network partitions?",
        options: [
                "During a network partition, a distributed system must choose between Consistency (all nodes see the same data) and Availability (every request receives a non-error response).",
                "A system can achieve Consistency, Availability, and Partition Tolerance simultaneously at all times.",
                "Network partitions can be permanently eliminated with fiber optics.",
                "Partition tolerance only applies to relational SQL databases."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "When network communication fails (P), the system must trade off between returning stale/failed responses (A) or waiting for sync (C)."
      },
      {
        id: "cs380-q15",
        question: "15. What security vulnerability does a Cross-Site Request Forgery (CSRF) attack exploit?",
        options: [
                "The browser's automatic inclusion of stored session authentication credentials (cookies) with unauthorized third-party requests",
                "Injecting malicious executable JavaScript into HTML responses (XSS)",
                "Overrunning a fixed memory buffer on the operating system kernel",
                "Modifying SQL query tokens via untrusted input parameters"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "CSRF tricks a user's browser into sending authenticated HTTP requests using existing session cookies without the user's intent."
      },
      {
        id: "cs380-q16",
        question: "16. What is the primary role of a reverse proxy (such as NGINX or Envoy) in modern web infrastructure?",
        options: [
                "Terminating SSL/TLS, load balancing incoming requests across internal services, and caching static assets",
                "Compiling frontend React JSX into machine assembly code",
                "Providing persistent non-volatile disk storage for database tables",
                "Translating domain names into IP addresses via DNS resolution"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Reverse proxies shield origin servers, perform TLS offloading, distribute traffic, and handle edge response caching."
      },
      {
        id: "cs380-q17",
        question: "17. In cryptographic communication protocols (e.g. TLS 1.3), what does Perfect Forward Secrecy (PFS) guarantee?",
        options: [
                "Compromise of the server's long-term private key does not compromise past session keys or decrypt recorded historical traffic.",
                "The client and server can communicate without exchanging public keys.",
                "Messages are immune to quantum computing decryption forever.",
                "The session requires zero encryption overhead."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "PFS uses ephemeral Diffie-Hellman exchanges so each session key is unique and temporary, protecting past traffic."
      },
      {
        id: "cs380-q18",
        question: "18. What is the fundamental operational principle of the Circuit Breaker pattern in microservice architectures?",
        options: [
                "Failing fast when downstream services exhibit consecutive errors, preventing cascading failures and allowing the dependency to recover",
                "Encrypting all inter-service communications using mTLS",
                "Routing all database writes to a single master instance",
                "Automatically restarting container pods upon memory exhaustion"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Circuit breakers transition from Closed to Open upon repeated failures, cutting traffic to prevent system-wide resource starvation."
      },
      {
        id: "cs380-q19",
        question: "19. What is the primary operational trade-off of database sharding (horizontal database partitioning)?",
        options: [
                "Enables massive write scalability, but introduces significant complexity for cross-shard joins, transactions, and rebalancing",
                "Reduces query latency for all possible multi-table join patterns",
                "Eliminates the need for indexing tables",
                "Guarantees immediate global ACID transactions across all partitions"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Sharding partitions data across independent database nodes, scaling storage and writes at the expense of cross-shard transactional complexity."
      },
      {
        id: "cs380-q20",
        question: "20. What is a Zero-Trust architecture in enterprise and cloud security?",
        options: [
                "A security model that requires strict continuous identity verification and least-privilege access for every request, regardless of whether it originates inside or outside the network perimeter.",
                "A network where all firewalls are disabled for maximum speed",
                "A protocol that trusts all requests originating from local subnet IP addresses",
                "An architecture where no cryptographic keys are ever stored on servers"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Zero Trust operates on 'never trust, always verify', enforcing contextual authentication and authorization on every transaction."
      }
    ]
  },
  CS350: {
    courseCode: "CS350",
    title: "CS350 Final Academic Assessment: Computer Vision & Convolutional Architectures",
    totalMarks: 20,
    passingMarks: 12,
    questions: [
      {
        id: "cs350-q1",
        question: "1. What operation forms the mathematical foundation of 2D image filtering in Computer Vision?",
        options: [
          "2D Spatial Convolution / Cross-Correlation with a localized kernel matrix",
          "Matrix determinant inversion",
          "Fast Fourier Transform phase unwrapping only",
          "Singular value decomposition of color channels"
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "2D spatial convolution slides a small weight kernel across an image, computing dot products to detect local features such as edges, corners, and texture gradients."
      },
      {
        id: "cs350-q2",
        question: "2. In Convolutional Neural Networks (CNNs), what is the primary benefit of Weight Sharing across receptive fields?",
        options: [
          "It drastically reduces the number of learnable parameters and introduces translation equivariance across the image.",
          "It guarantees that models will never overfit regardless of depth.",
          "It converts RGB color pixels into audio frequency spectrograms.",
          "It replaces the backpropagation gradient descent algorithm."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Because the same convolution kernel is applied across the entire image, the model uses far fewer parameters than dense layers and detects patterns anywhere they appear."
      },
      {
        id: "cs350-q3",
        question: "3. What is the role of Pooling layers (e.g. MaxPooling) in CNN architectures?",
        options: [
          "To downsample spatial dimensions, reduce computational load, and provide local translation invariance.",
          "To increase the spatial resolution of input images before classification.",
          "To compute the loss function gradients for backpropagation.",
          "To normalize pixel brightness values between -1 and +1."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Pooling condenses spatial feature maps by selecting maximum or average values in subregions, shrinking tensor dimensions while retaining dominant features."
      },
      {
        id: "cs350-q4",
        question: "4. What metric is used to evaluate the overlap between a predicted bounding box and a ground truth bounding box?",
        options: [
          "Intersection over Union (IoU) / Jaccard Index",
          "Mean Squared Error of image pixel values",
          "Cosine Similarity between RGB histograms",
          "Peak Signal-to-Noise Ratio (PSNR)"
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "IoU measures the area of overlap between the predicted and ground truth boxes divided by the total area of their union: Area(A ∩ B) / Area(A ∪ B)."
      },
      {
        id: "cs350-q5",
        question: "5. In the YOLO (You Only Look Once) object detection framework, why is it described as a 'single-stage' detector?",
        options: [
          "It frames object detection as a single regression problem, predicting bounding boxes and class probabilities directly in one forward pass.",
          "It can only detect one object per photograph.",
          "It requires only one training epoch to achieve optimal accuracy.",
          "It uses a single convolutional layer without activation functions."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Unlike two-stage detectors (e.g. Faster R-CNN) that generate region proposals first, YOLO evaluates the entire image grid simultaneously in a single forward inference pass."
      },
      {
        id: "cs350-q6",
        question: "6. What is the purpose of Non-Maximum Suppression (NMS) in object detection pipelines?",
        options: [
          "To eliminate redundant, overlapping bounding boxes that detect the same object, retaining only the highest-confidence detection.",
          "To compress high-resolution images into thumbnail sizes.",
          "To prevent gradient explosion during backpropagation.",
          "To classify pixels that do not belong to any object category."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Object detectors output hundreds of candidate boxes per object. NMS iteratively suppresses boxes that have high IoU overlap with the highest-scoring candidate."
      },
      {
        id: "cs350-q7",
        question: "7. How do Residual Connections (Skip Connections in ResNet) resolve the degradation problem in very deep neural networks?",
        options: [
          "By passing the identity mapping F(x) + x directly across layers, allowing gradients to flow backward unimpeded without vanishing.",
          "By discarding half of all neural connections at every training step.",
          "By replacing 3x3 convolutions with 1x1 convolutions exclusively.",
          "By converting floating point weights to 8-bit integers."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Skip connections provide an uninterrupted gradient highway, allowing gradients to propagate directly to early layers without degrading or vanishing as depth reaches 100+ layers."
      },
      {
        id: "cs350-q8",
        question: "8. What is the fundamental difference between Semantic Segmentation and Instance Segmentation?",
        options: [
          "Semantic segmentation classifies every pixel into a category without distinguishing individual object instances; instance segmentation segments and differentiates each individual object.",
          "Semantic segmentation is only used on video files, whereas instance segmentation applies only to static photos.",
          "Semantic segmentation outputs rectangular bounding boxes, while instance segmentation outputs scalar loss values.",
          "Instance segmentation cannot be trained using deep learning algorithms."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "In semantic segmentation, all sheep pixels share the same label. In instance segmentation, the model differentiates Sheep #1 from Sheep #2 with separate pixel masks."
      },
      {
        id: "cs350-q9",
        question: "9. How do Vision Transformers (ViT) process 2D images compared to standard CNNs?",
        options: [
          "They divide images into non-overlapping patches, flatten them into linear vector projections, and process them as token sequences using self-attention mechanisms.",
          "They convert images into grayscale audio waveforms before running recurrent neural networks.",
          "They apply 3D convolution kernels across temporal video dimensions.",
          "They use decision tree ensembles to classify pixel intensity histograms."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "ViTs treat an image as a sentence of patches (e.g. 16x16 pixels each), using standard multi-head self-attention encoders without inductive convolutional bias."
      },
      {
        id: "cs350-q10",
        question: "10. What is the function of Batch Normalization in convolutional neural network training?",
        options: [
          "It normalizes layer activations across the mini-batch to zero mean and unit variance, stabilizing internal covariate shift and speeding up training.",
          "It shuffles training images randomly before every epoch.",
          "It resizes all training photos to 224x224 pixels on disk.",
          "It encrypts model weights to prevent unauthorized copying."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Batch Normalization stabilizes intermediate activation distributions throughout training, permitting significantly higher learning rates and acting as a mild regularizer."
      },
      {
        id: "cs350-q11",
        question: "11. In Computer Vision, how does horizontal scaling differ fundamentally from vertical scaling?",
        options: [
                "Horizontal scaling adds more machine nodes to a distributed cluster, whereas vertical scaling upgrades CPU/RAM on a single machine.",
                "Horizontal scaling requires taking the system completely offline.",
                "Vertical scaling distributes data across partitioned shards.",
                "Horizontal scaling can only run in a single availability zone."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Horizontal scaling scales out by adding commodity nodes; vertical scaling scales up by augmenting compute resources of an individual machine."
      },
      {
        id: "cs350-q12",
        question: "12. What primary advantage does asynchronous non-blocking I/O provide in high-throughput network architectures?",
        options: [
                "Enables a single process or event loop to handle thousands of concurrent connections without thread-per-connection context switching overhead",
                "Guarantees zero-latency packet transmission over physical fiber",
                "Encrypts payload buffers without CPU cycle consumption",
                "Prevents TCP connection drops during network partitions"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Non-blocking I/O uses OS event notification (e.g. epoll, kqueue) to multiplex massive concurrent sockets efficiently."
      },
      {
        id: "cs350-q13",
        question: "13. What is the purpose of rate limiting algorithms like Token Bucket or Leaky Bucket in API gateway design?",
        options: [
                "Controlling request traffic rates to prevent resource exhaustion, mitigate DoS attacks, and protect downstream services",
                "Compressing outgoing JSON payloads into binary streams",
                "Routing incoming traffic to the nearest geographic edge node",
                "Translating REST API requests into GraphQL queries"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Token Bucket allows controlled burstiness while enforcing a sustainable average rate, guarding backend services."
      },
      {
        id: "cs350-q14",
        question: "14. In distributed systems, what does the CAP theorem state regarding network partitions?",
        options: [
                "During a network partition, a distributed system must choose between Consistency (all nodes see the same data) and Availability (every request receives a non-error response).",
                "A system can achieve Consistency, Availability, and Partition Tolerance simultaneously at all times.",
                "Network partitions can be permanently eliminated with fiber optics.",
                "Partition tolerance only applies to relational SQL databases."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "When network communication fails (P), the system must trade off between returning stale/failed responses (A) or waiting for sync (C)."
      },
      {
        id: "cs350-q15",
        question: "15. What security vulnerability does a Cross-Site Request Forgery (CSRF) attack exploit?",
        options: [
                "The browser's automatic inclusion of stored session authentication credentials (cookies) with unauthorized third-party requests",
                "Injecting malicious executable JavaScript into HTML responses (XSS)",
                "Overrunning a fixed memory buffer on the operating system kernel",
                "Modifying SQL query tokens via untrusted input parameters"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "CSRF tricks a user's browser into sending authenticated HTTP requests using existing session cookies without the user's intent."
      },
      {
        id: "cs350-q16",
        question: "16. What is the primary role of a reverse proxy (such as NGINX or Envoy) in modern web infrastructure?",
        options: [
                "Terminating SSL/TLS, load balancing incoming requests across internal services, and caching static assets",
                "Compiling frontend React JSX into machine assembly code",
                "Providing persistent non-volatile disk storage for database tables",
                "Translating domain names into IP addresses via DNS resolution"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Reverse proxies shield origin servers, perform TLS offloading, distribute traffic, and handle edge response caching."
      },
      {
        id: "cs350-q17",
        question: "17. In cryptographic communication protocols (e.g. TLS 1.3), what does Perfect Forward Secrecy (PFS) guarantee?",
        options: [
                "Compromise of the server's long-term private key does not compromise past session keys or decrypt recorded historical traffic.",
                "The client and server can communicate without exchanging public keys.",
                "Messages are immune to quantum computing decryption forever.",
                "The session requires zero encryption overhead."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "PFS uses ephemeral Diffie-Hellman exchanges so each session key is unique and temporary, protecting past traffic."
      },
      {
        id: "cs350-q18",
        question: "18. What is the fundamental operational principle of the Circuit Breaker pattern in microservice architectures?",
        options: [
                "Failing fast when downstream services exhibit consecutive errors, preventing cascading failures and allowing the dependency to recover",
                "Encrypting all inter-service communications using mTLS",
                "Routing all database writes to a single master instance",
                "Automatically restarting container pods upon memory exhaustion"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Circuit breakers transition from Closed to Open upon repeated failures, cutting traffic to prevent system-wide resource starvation."
      },
      {
        id: "cs350-q19",
        question: "19. What is the primary operational trade-off of database sharding (horizontal database partitioning)?",
        options: [
                "Enables massive write scalability, but introduces significant complexity for cross-shard joins, transactions, and rebalancing",
                "Reduces query latency for all possible multi-table join patterns",
                "Eliminates the need for indexing tables",
                "Guarantees immediate global ACID transactions across all partitions"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Sharding partitions data across independent database nodes, scaling storage and writes at the expense of cross-shard transactional complexity."
      },
      {
        id: "cs350-q20",
        question: "20. What is a Zero-Trust architecture in enterprise and cloud security?",
        options: [
                "A security model that requires strict continuous identity verification and least-privilege access for every request, regardless of whether it originates inside or outside the network perimeter.",
                "A network where all firewalls are disabled for maximum speed",
                "A protocol that trusts all requests originating from local subnet IP addresses",
                "An architecture where no cryptographic keys are ever stored on servers"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Zero Trust operates on 'never trust, always verify', enforcing contextual authentication and authorization on every transaction."
      }
    ]
  },
  CS420: {
    courseCode: "CS420",
    title: "CS420 Final Academic Assessment: Natural Language Processing & Large Language Models",
    totalMarks: 20,
    passingMarks: 12,
    questions: [
      {
        id: "cs420-q1",
        question: "1. What is the primary benefit of subword tokenization algorithms like Byte-Pair Encoding (BPE) over word-level tokenization?",
        options: [
          "They gracefully handle out-of-vocabulary (OOV) rare words by breaking them down into known subword morphemes with bounded vocabulary size.",
          "They eliminate the need for training neural networks on text data.",
          "They translate foreign languages directly without language model training.",
          "They represent every word as an individual Unicode byte without semantic vectors."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "BPE balances token sequence length with vocabulary size, representing common words as single tokens and decomposing unseen words into constituent subword pieces."
      },
      {
        id: "cs420-q2",
        question: "2. What is the fundamental equation for Scaled Dot-Product Attention in Transformer architectures?",
        options: [
          "Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V",
          "Attention(Q, K, V) = Q * K * V / d_k",
          "Attention(Q, K, V) = sigmoid(Q + K + V)",
          "Attention(Q, K, V) = argmax(Q * K^T) * V"
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Scaled dot-product attention computes compatibility between queries (Q) and keys (K), scales by sqrt(d_k) to prevent vanishing softmax gradients, and weights the values (V)."
      },
      {
        id: "cs420-q3",
        question: "3. Why do Transformers require Positional Encodings added to token embeddings?",
        options: [
          "Because self-attention operations are inherently permutation-invariant and possess no native awareness of token order without positional indicators.",
          "To increase the vector dimension of small vocabulary words.",
          "To prevent duplicate tokens from causing divide-by-zero errors in softmax.",
          "To translate tokens into grammatical parts-of-speech tags."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Unlike recurrent networks that process words sequentially, self-attention processes all tokens in parallel. Positional encodings inject necessary word order information."
      },
      {
        id: "cs420-q4",
        question: "4. What training objective differentiates BERT from autoregressive models like GPT?",
        options: [
          "BERT uses bidirectional Masked Language Modeling (MLM) to attend to both left and right context, whereas GPT uses causal unidirectional next-token prediction.",
          "BERT is trained on images, while GPT is trained on text.",
          "BERT has no attention mechanisms, while GPT uses self-attention.",
          "BERT can only generate text, while GPT can only classify sentences."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "BERT masks tokens and predicts them using both preceding and succeeding context (encoder-only). GPT predicts the next token given only preceding tokens (decoder-only)."
      },
      {
        id: "cs420-q5",
        question: "5. What is the purpose of Causal Masking in generative decoder Transformers?",
        options: [
          "To set attention scores of future tokens to -infinity before softmax, preventing the model from 'cheating' by looking ahead at subsequent tokens.",
          "To remove profanity and harmful content from output generations.",
          "To mask out padding tokens in unequal batch sequences.",
          "To reduce the dimension of attention key-value projection matrices."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "A causal triangular mask ensures token at position t can only attend to positions <= t, maintaining the strict autoregressive condition necessary for language generation."
      },
      {
        id: "cs420-q6",
        question: "6. In parameter-efficient fine-tuning (PEFT), how does LoRA (Low-Rank Adaptation) work?",
        options: [
          "It freezes the pre-trained model weights and injects trainable rank-decomposition matrices (A and B) into the attention layers, drastically reducing trainable parameters.",
          "It prunes 90% of model weights randomly before fine-tuning.",
          "It quantizes all model weights from 16-bit to 1-bit integers.",
          "It trains a separate external decision tree model on user prompts."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "LoRA decomposes weight updates ΔW into low-rank matrices B * A where rank r << d, reducing trainable parameter count by over 99% while matching full fine-tuning quality."
      },
      {
        id: "cs420-q7",
        question: "7. What is Perplexity in language model evaluation?",
        options: [
          "The exponentiated cross-entropy loss, representing the average branching factor of possible next tokens the model is choosing between.",
          "The percentage of generated tokens that contain grammatical errors.",
          "The latency in milliseconds required to generate a single token.",
          "The ratio of training tokens to validation tokens in the dataset."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Perplexity = exp(cross_entropy_loss). A lower perplexity indicates the model assigns higher probability to actual test sentences (it is less 'perplexed' by the text)."
      },
      {
        id: "cs420-q8",
        question: "8. What does Temperature control during language model decoding and text sampling?",
        options: [
          "It scales logits before softmax: lower values (<1.0) make outputs more deterministic and focused, while higher values (>1.0) increase diversity and randomness.",
          "It regulates the physical operating temperature of GPU compute nodes.",
          "It limits the maximum number of tokens a model can output in a turn.",
          "It controls the learning rate during backward propagation."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Dividing logits by temperature T sharpens probability distributions as T approaches 0 (greedy selection), or flattens distributions as T increases, producing creative variety."
      },
      {
        id: "cs420-q9",
        question: "9. In Retrieval-Augmented Generation (RAG) systems, what is the role of Vector Embeddings?",
        options: [
          "Converting unstructured documents and user queries into high-dimensional semantic vectors to enable fast cosine similarity retrieval of relevant context chunks.",
          "Compressing audio voice notes into text files.",
          "Checking user passwords for cryptographic hash matching.",
          "Formatting LLM outputs into Markdown tables."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Embedding models map semantic meaning to geometric vector space. Searching dense vectors allows RAG systems to retrieve relevant facts even when exact keywords differ."
      },
      {
        id: "cs420-q10",
        question: "10. What is RLHF (Reinforcement Learning from Human Feedback) primarily used for in modern LLMs?",
        options: [
          "Aligning model behavior and outputs with human values of helpfulness, honesty, and harmlessness through reward model optimization (PPO/DPO).",
          "Teaching the model how to spell words correctly from scratch.",
          "Translating source code into binary machine bytecode.",
          "Accelerating matrix multiplication operations on tensor cores."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "RLHF fine-tunes raw next-token predictors into cooperative conversational agents by training a reward model on human preference rankings and optimizing policy with reinforcement learning."
      },
      {
        id: "cs420-q11",
        question: "11. In Natural Language Processing, how does horizontal scaling differ fundamentally from vertical scaling?",
        options: [
                "Horizontal scaling adds more machine nodes to a distributed cluster, whereas vertical scaling upgrades CPU/RAM on a single machine.",
                "Horizontal scaling requires taking the system completely offline.",
                "Vertical scaling distributes data across partitioned shards.",
                "Horizontal scaling can only run in a single availability zone."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Horizontal scaling scales out by adding commodity nodes; vertical scaling scales up by augmenting compute resources of an individual machine."
      },
      {
        id: "cs420-q12",
        question: "12. What primary advantage does asynchronous non-blocking I/O provide in high-throughput network architectures?",
        options: [
                "Enables a single process or event loop to handle thousands of concurrent connections without thread-per-connection context switching overhead",
                "Guarantees zero-latency packet transmission over physical fiber",
                "Encrypts payload buffers without CPU cycle consumption",
                "Prevents TCP connection drops during network partitions"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Non-blocking I/O uses OS event notification (e.g. epoll, kqueue) to multiplex massive concurrent sockets efficiently."
      },
      {
        id: "cs420-q13",
        question: "13. What is the purpose of rate limiting algorithms like Token Bucket or Leaky Bucket in API gateway design?",
        options: [
                "Controlling request traffic rates to prevent resource exhaustion, mitigate DoS attacks, and protect downstream services",
                "Compressing outgoing JSON payloads into binary streams",
                "Routing incoming traffic to the nearest geographic edge node",
                "Translating REST API requests into GraphQL queries"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Token Bucket allows controlled burstiness while enforcing a sustainable average rate, guarding backend services."
      },
      {
        id: "cs420-q14",
        question: "14. In distributed systems, what does the CAP theorem state regarding network partitions?",
        options: [
                "During a network partition, a distributed system must choose between Consistency (all nodes see the same data) and Availability (every request receives a non-error response).",
                "A system can achieve Consistency, Availability, and Partition Tolerance simultaneously at all times.",
                "Network partitions can be permanently eliminated with fiber optics.",
                "Partition tolerance only applies to relational SQL databases."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "When network communication fails (P), the system must trade off between returning stale/failed responses (A) or waiting for sync (C)."
      },
      {
        id: "cs420-q15",
        question: "15. What security vulnerability does a Cross-Site Request Forgery (CSRF) attack exploit?",
        options: [
                "The browser's automatic inclusion of stored session authentication credentials (cookies) with unauthorized third-party requests",
                "Injecting malicious executable JavaScript into HTML responses (XSS)",
                "Overrunning a fixed memory buffer on the operating system kernel",
                "Modifying SQL query tokens via untrusted input parameters"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "CSRF tricks a user's browser into sending authenticated HTTP requests using existing session cookies without the user's intent."
      },
      {
        id: "cs420-q16",
        question: "16. What is the primary role of a reverse proxy (such as NGINX or Envoy) in modern web infrastructure?",
        options: [
                "Terminating SSL/TLS, load balancing incoming requests across internal services, and caching static assets",
                "Compiling frontend React JSX into machine assembly code",
                "Providing persistent non-volatile disk storage for database tables",
                "Translating domain names into IP addresses via DNS resolution"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Reverse proxies shield origin servers, perform TLS offloading, distribute traffic, and handle edge response caching."
      },
      {
        id: "cs420-q17",
        question: "17. In cryptographic communication protocols (e.g. TLS 1.3), what does Perfect Forward Secrecy (PFS) guarantee?",
        options: [
                "Compromise of the server's long-term private key does not compromise past session keys or decrypt recorded historical traffic.",
                "The client and server can communicate without exchanging public keys.",
                "Messages are immune to quantum computing decryption forever.",
                "The session requires zero encryption overhead."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "PFS uses ephemeral Diffie-Hellman exchanges so each session key is unique and temporary, protecting past traffic."
      },
      {
        id: "cs420-q18",
        question: "18. What is the fundamental operational principle of the Circuit Breaker pattern in microservice architectures?",
        options: [
                "Failing fast when downstream services exhibit consecutive errors, preventing cascading failures and allowing the dependency to recover",
                "Encrypting all inter-service communications using mTLS",
                "Routing all database writes to a single master instance",
                "Automatically restarting container pods upon memory exhaustion"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Circuit breakers transition from Closed to Open upon repeated failures, cutting traffic to prevent system-wide resource starvation."
      },
      {
        id: "cs420-q19",
        question: "19. What is the primary operational trade-off of database sharding (horizontal database partitioning)?",
        options: [
                "Enables massive write scalability, but introduces significant complexity for cross-shard joins, transactions, and rebalancing",
                "Reduces query latency for all possible multi-table join patterns",
                "Eliminates the need for indexing tables",
                "Guarantees immediate global ACID transactions across all partitions"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Sharding partitions data across independent database nodes, scaling storage and writes at the expense of cross-shard transactional complexity."
      },
      {
        id: "cs420-q20",
        question: "20. What is a Zero-Trust architecture in enterprise and cloud security?",
        options: [
                "A security model that requires strict continuous identity verification and least-privilege access for every request, regardless of whether it originates inside or outside the network perimeter.",
                "A network where all firewalls are disabled for maximum speed",
                "A protocol that trusts all requests originating from local subnet IP addresses",
                "An architecture where no cryptographic keys are ever stored on servers"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Zero Trust operates on 'never trust, always verify', enforcing contextual authentication and authorization on every transaction."
      }
    ]
  },
  CS310: {
    courseCode: "CS310",
    title: "CS310 Final Academic Assessment: Modern Full-Stack Web & Mobile Engineering",
    totalMarks: 20,
    passingMarks: 12,
    questions: [
      {
        id: "cs310-q1",
        question: "1. What is the fundamental architecture difference between React Server Components (RSC) and standard Client Components?",
        options: [
          "Server Components execute solely on the server, streaming pre-rendered HTML/JSON without bundling their dependencies to client JavaScript bundles.",
          "Server Components can only be written in PHP, whereas Client Components use JavaScript.",
          "Server Components do not have access to database connections or environment variables.",
          "Client Components cannot receive props from parent components."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "RSCs run only on the server, meaning zero bundle weight impact on the client, direct database access, and seamless server-side data fetching."
      },
      {
        id: "cs310-q2",
        question: "2. What core performance metric is measured by Largest Contentful Paint (LCP)?",
        options: [
          "The render time of the largest image or text block visible within the initial viewport from when the user initiates page load.",
          "The time taken to run all unit tests in a CI/CD build pipeline.",
          "The maximum bandwidth capacity of the client's network interface.",
          "The total file size of all combined CSS stylesheets."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "LCP is a Core Web Vital that marks when the main hero content has likely loaded. Google guidelines recommend an LCP under 2.5 seconds for good user experience."
      },
      {
        id: "cs310-q3",
        question: "3. What is the purpose of Optimistic UI updates in frontend application state management?",
        options: [
          "Updating the UI immediately under the assumption that a server request will succeed, and rolling back if an error occurs, providing zero-latency responsiveness.",
          "Displaying positive motivational quotes to users while data loads.",
          "Caching all database records in localStorage indefinitely.",
          "Disabling error boundaries in production builds."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Optimistic UI immediately renders the expected state (e.g. marking a task complete or incrementing likes) before server roundtrip finishes, reverting if the API fails."
      },
      {
        id: "cs310-q4",
        question: "4. In RESTful API design, what semantic difference exists between HTTP PUT and HTTP PATCH requests?",
        options: [
          "PUT replaces the entire resource representation with the provided payload, whereas PATCH applies partial modifications to existing attributes.",
          "PUT creates a new database table, while PATCH deletes individual records.",
          "PUT can only be sent over HTTP, while PATCH requires HTTPS.",
          "PUT is an asynchronous operation, while PATCH is always synchronous."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "According to HTTP specifications, PUT is an idempotent complete replacement of a resource, while PATCH modifies specific target fields without overwriting the entire resource."
      },
      {
        id: "cs310-q5",
        question: "5. What problem does DataLoader solve in GraphQL API resolvers?",
        options: [
          "The N+1 query problem by batching individual key requests into a single database query and caching results per-request.",
          "Encrypting GraphQL responses using TLS session keys.",
          "Converting GraphQL schemas into SQL table definitions automatically.",
          "Translating English natural language into GraphQL query strings."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "DataLoader collapses N individual database queries into a single batched IN (?, ?, ...) query within an execution tick, eliminating catastrophic N+1 latency."
      },
      {
        id: "cs310-q6",
        question: "6. How does React Native achieve cross-platform native rendering on iOS and Android?",
        options: [
          "By invoking platform-native UI widgets (UIKit / Android Views) via a JavaScript bridge / JSI (JavaScript Interface), rather than rendering inside a WebView.",
          "By converting JavaScript directly into assembly firmware for phone modems.",
          "By running a mini Chrome browser instance inside every mobile app screen.",
          "By streaming video frames of desktop web apps to mobile devices."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "React Native maps component declarations (<View>, <Text>) to actual platform-native OS views, delivering native 60+ FPS touch interactions and system fidelity."
      },
      {
        id: "cs310-q7",
        question: "7. What is the security advantage of storing authentication tokens in `HttpOnly; Secure; SameSite=Strict` cookies instead of `localStorage`?",
        options: [
          "They cannot be accessed or stolen by clientside JavaScript, protecting users against token extraction via Cross-Site Scripting (XSS) attacks.",
          "They consume zero bytes of browser storage.",
          "They never expire and remain valid for the user's lifetime.",
          "They automatically translate foreign currencies in checkout forms."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Tokens in localStorage are vulnerable to any malicious XSS script running on the page. HttpOnly cookies are strictly hidden from JavaScript, preventing theft."
      },
      {
        id: "cs310-q8",
        question: "8. What is the function of Web Workers in clientside JavaScript performance?",
        options: [
          "Running CPU-intensive background tasks on separate background threads without blocking the browser's main UI rendering thread.",
          "Managing background database backups on remote server clusters.",
          "Minifying CSS and HTML source code during webpack compilation.",
          "Replacing service workers in Progressive Web Apps."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "JavaScript is single-threaded on the main thread. Web Workers offload heavy computations (e.g. data parsing, cryptographic hashing) to keep animations smooth."
      },
      {
        id: "cs310-q9",
        question: "9. What is the primary purpose of Incremental Static Regeneration (ISR) in Next.js?",
        options: [
          "Updating static pages in the background as traffic arrives without needing to rebuild the entire website from scratch.",
          "Regenerating user passwords automatically every 30 days.",
          "Converting serverless functions into dedicated bare-metal servers.",
          "Compressing images into base64 strings during runtime."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "ISR allows static caching benefits (sub-millisecond CDN delivery) while revalidating individual stale pages in the background on demand without full rebuilds."
      },
      {
        id: "cs310-q10",
        question: "10. What does Interaction to Next Paint (INP) measure in Google Core Web Vitals?",
        options: [
          "The overall responsiveness of a page to all user clicks, taps, and keypresses throughout its lifecycle, reporting the worst latency observed.",
          "The time taken to paint the browser window border.",
          "The duration required to load Google Fonts asynchronously.",
          "The speed of server-side database insertions."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "INP replaced First Input Delay (FID) as a Core Web Vital, measuring the responsiveness of all interactions during a user's entire visit to ensure the UI feels snappy."
      },
      {
        id: "cs310-q11",
        question: "11. In Web & Mobile Systems, how does horizontal scaling differ fundamentally from vertical scaling?",
        options: [
                "Horizontal scaling adds more machine nodes to a distributed cluster, whereas vertical scaling upgrades CPU/RAM on a single machine.",
                "Horizontal scaling requires taking the system completely offline.",
                "Vertical scaling distributes data across partitioned shards.",
                "Horizontal scaling can only run in a single availability zone."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Horizontal scaling scales out by adding commodity nodes; vertical scaling scales up by augmenting compute resources of an individual machine."
      },
      {
        id: "cs310-q12",
        question: "12. What primary advantage does asynchronous non-blocking I/O provide in high-throughput network architectures?",
        options: [
                "Enables a single process or event loop to handle thousands of concurrent connections without thread-per-connection context switching overhead",
                "Guarantees zero-latency packet transmission over physical fiber",
                "Encrypts payload buffers without CPU cycle consumption",
                "Prevents TCP connection drops during network partitions"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Non-blocking I/O uses OS event notification (e.g. epoll, kqueue) to multiplex massive concurrent sockets efficiently."
      },
      {
        id: "cs310-q13",
        question: "13. What is the purpose of rate limiting algorithms like Token Bucket or Leaky Bucket in API gateway design?",
        options: [
                "Controlling request traffic rates to prevent resource exhaustion, mitigate DoS attacks, and protect downstream services",
                "Compressing outgoing JSON payloads into binary streams",
                "Routing incoming traffic to the nearest geographic edge node",
                "Translating REST API requests into GraphQL queries"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Token Bucket allows controlled burstiness while enforcing a sustainable average rate, guarding backend services."
      },
      {
        id: "cs310-q14",
        question: "14. In distributed systems, what does the CAP theorem state regarding network partitions?",
        options: [
                "During a network partition, a distributed system must choose between Consistency (all nodes see the same data) and Availability (every request receives a non-error response).",
                "A system can achieve Consistency, Availability, and Partition Tolerance simultaneously at all times.",
                "Network partitions can be permanently eliminated with fiber optics.",
                "Partition tolerance only applies to relational SQL databases."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "When network communication fails (P), the system must trade off between returning stale/failed responses (A) or waiting for sync (C)."
      },
      {
        id: "cs310-q15",
        question: "15. What security vulnerability does a Cross-Site Request Forgery (CSRF) attack exploit?",
        options: [
                "The browser's automatic inclusion of stored session authentication credentials (cookies) with unauthorized third-party requests",
                "Injecting malicious executable JavaScript into HTML responses (XSS)",
                "Overrunning a fixed memory buffer on the operating system kernel",
                "Modifying SQL query tokens via untrusted input parameters"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "CSRF tricks a user's browser into sending authenticated HTTP requests using existing session cookies without the user's intent."
      },
      {
        id: "cs310-q16",
        question: "16. What is the primary role of a reverse proxy (such as NGINX or Envoy) in modern web infrastructure?",
        options: [
                "Terminating SSL/TLS, load balancing incoming requests across internal services, and caching static assets",
                "Compiling frontend React JSX into machine assembly code",
                "Providing persistent non-volatile disk storage for database tables",
                "Translating domain names into IP addresses via DNS resolution"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Reverse proxies shield origin servers, perform TLS offloading, distribute traffic, and handle edge response caching."
      },
      {
        id: "cs310-q17",
        question: "17. In cryptographic communication protocols (e.g. TLS 1.3), what does Perfect Forward Secrecy (PFS) guarantee?",
        options: [
                "Compromise of the server's long-term private key does not compromise past session keys or decrypt recorded historical traffic.",
                "The client and server can communicate without exchanging public keys.",
                "Messages are immune to quantum computing decryption forever.",
                "The session requires zero encryption overhead."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "PFS uses ephemeral Diffie-Hellman exchanges so each session key is unique and temporary, protecting past traffic."
      },
      {
        id: "cs310-q18",
        question: "18. What is the fundamental operational principle of the Circuit Breaker pattern in microservice architectures?",
        options: [
                "Failing fast when downstream services exhibit consecutive errors, preventing cascading failures and allowing the dependency to recover",
                "Encrypting all inter-service communications using mTLS",
                "Routing all database writes to a single master instance",
                "Automatically restarting container pods upon memory exhaustion"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Circuit breakers transition from Closed to Open upon repeated failures, cutting traffic to prevent system-wide resource starvation."
      },
      {
        id: "cs310-q19",
        question: "19. What is the primary operational trade-off of database sharding (horizontal database partitioning)?",
        options: [
                "Enables massive write scalability, but introduces significant complexity for cross-shard joins, transactions, and rebalancing",
                "Reduces query latency for all possible multi-table join patterns",
                "Eliminates the need for indexing tables",
                "Guarantees immediate global ACID transactions across all partitions"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Sharding partitions data across independent database nodes, scaling storage and writes at the expense of cross-shard transactional complexity."
      },
      {
        id: "cs310-q20",
        question: "20. What is a Zero-Trust architecture in enterprise and cloud security?",
        options: [
                "A security model that requires strict continuous identity verification and least-privilege access for every request, regardless of whether it originates inside or outside the network perimeter.",
                "A network where all firewalls are disabled for maximum speed",
                "A protocol that trusts all requests originating from local subnet IP addresses",
                "An architecture where no cryptographic keys are ever stored on servers"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Zero Trust operates on 'never trust, always verify', enforcing contextual authentication and authorization on every transaction."
      }
    ]
  },
  CS450: {
    courseCode: "CS450",
    title: "CS450 Final Academic Assessment: Distributed Systems, Consensus & Fault Tolerance",
    totalMarks: 20,
    passingMarks: 12,
    questions: [
      {
        id: "cs450-q1",
        question: "1. What is the fundamental distinction between Synchronous and Asynchronous distributed network models?",
        options: [
          "Synchronous networks assume bounded message delivery delays and bounded clock drift; asynchronous networks make zero assumptions about delivery times.",
          "Synchronous networks use fiber optic cables, while asynchronous networks use radio frequency signals.",
          "Synchronous networks cannot experience node crashes.",
          "Asynchronous networks guarantee zero packet loss under all conditions."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "In an asynchronous model, message delays are unbounded: a node cannot distinguish between an infinitely delayed message and a crashed peer node."
      },
      {
        id: "cs450-q2",
        question: "2. In the Raft Distributed Consensus algorithm, how is a split-vote scenario resolved during leader elections?",
        options: [
          "By using randomized election timeouts on each candidate node so one candidate will typically time out first and request votes before others.",
          "By electing the node with the highest IP address unconditionally.",
          "By restarting the entire cluster from initial boot state.",
          "By delegating the leader election to a centralized external database."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Raft randomizes election timeouts (e.g. between 150ms and 300ms). This breaks symmetry, ensuring one candidate usually initiates an election and collects majority votes first."
      },
      {
        id: "cs450-q3",
        question: "3. What defines the safety property of Log Matching in Raft consensus?",
        options: [
          "If two logs contain an entry with the same index and term, they store the same command and their logs are identical in all preceding entries.",
          "All nodes must have identical hard disk capacities.",
          "Logs must be formatted as JSON arrays on disk.",
          "Uncommitted log entries are immediately executed by client state machines."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Raft guarantees that if two separate server logs share an entry with identical index and term, the logs are identical up to that point without exception."
      },
      {
        id: "cs450-q4",
        question: "4. What is the significance of Lamport Timestamps in distributed systems?",
        options: [
          "They establish a partial logical ordering of events based on the 'happened-before' relation (a -> b) without relying on synchronized physical clocks.",
          "They synchronize server CPU clocks to within 1 microsecond using atomic clocks.",
          "They measure network roundtrip ping times between client and server.",
          "They provide absolute UTC timestamps for legal contracts."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Physical clocks drift uncontrollably. Lamport timestamps use monotonically increasing logical counters updated on local events and message passing to define causality."
      },
      {
        id: "cs450-q5",
        question: "5. What is the Byzantine Generals Problem in distributed computing?",
        options: [
          "Reaching consensus in a distributed network where participating nodes and network channels may act maliciously, lie, or send conflicting messages.",
          "Optimizing routing tables across transatlantic submarine cables.",
          "Managing CPU cache coherence in multi-socket server motherboards.",
          "Preventing deadlocks in single-instance relational database tables."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Byzantine faults model worst-case arbitrary failures where components may deliberately send contradictory information to different peers (requiring 3f + 1 nodes to tolerate f faults)."
      },
      {
        id: "cs450-q6",
        question: "6. How does Vector Clocks improve upon Lamport Timestamps in causal tracking?",
        options: [
          "Vector Clocks can detect whether two events are causally related or concurrent (neither happened before the other).",
          "Vector Clocks eliminate the need for network transmission headers.",
          "Vector Clocks compress message payloads by 50%.",
          "Vector Clocks operate only on GPU tensor cores."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "While Lamport timestamps define a partial order where a -> b implies L(a) < L(b), Vector Clocks provide an exact equivalence: V(a) < V(b) if and only if a causally preceded b."
      },
      {
        id: "cs450-q7",
        question: "7. In distributed storage systems (e.g. Amazon Dynamo), what does a Quorum configuration of R + W > N guarantee?",
        options: [
          "Strong read-your-writes consistency because the read set (R) and write set (W) must overlap on at least one replica containing the latest write.",
          "Zero network bandwidth consumption during replication.",
          "That nodes will never experience disk drive failures.",
          "Immediate deletion of older document versions."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "If total replicas is N, choosing Read quorum R and Write quorum W such that R + W > N ensures any read set contains at least one node from the most recent write set."
      },
      {
        id: "cs450-q8",
        question: "8. What is the role of Two-Phase Commit (2PC) in distributed transactions?",
        options: [
          "An atomic commitment protocol where a coordinator polls all participants (Prepare Phase) and executes commit only if all vote affirmatively (Commit Phase).",
          "A protocol that encrypts database passwords in two separate stages.",
          "A method to double the throughput of Apache Kafka brokers.",
          "A technique to divide relational databases into two separate shards."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "2PC guarantees atomicity across multiple nodes: either all distributed databases commit the change, or all abort, ensuring no node commits while another fails."
      },
      {
        id: "cs450-q9",
        question: "9. What is the primary operational weakness of the standard Two-Phase Commit (2PC) protocol?",
        options: [
          "It is a blocking protocol: if the coordinator crashes during the commit phase, participants remain locked holding resource locks indefinitely.",
          "It cannot process transactions containing string data.",
          "It requires specialized quantum computing hardware.",
          "It only supports transactions with a single database table."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "If the coordinator dies after participants vote 'Prepared', participants cannot safely decide to abort or commit on their own, leading to blocked locks and potential paralysis."
      },
      {
        id: "cs450-q10",
        question: "10. In event-driven streaming architectures like Apache Kafka, what is an 'Idempotent Producer'?",
        options: [
          "A producer configuration that guarantees exactly-once delivery within a partition by assigning sequence numbers and producer IDs, discarding duplicate retries.",
          "A producer that never sends data over the network.",
          "A producer that only writes to temporary memory buffers.",
          "A producer that deletes topic partitions after every publish."
        ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Network glitches often cause producer retries. Idempotent producers tag messages with monotonically increasing sequence IDs so the broker detects and ignores retransmitted duplicates."
      },
      {
        id: "cs450-q11",
        question: "11. In Distributed Systems, how does horizontal scaling differ fundamentally from vertical scaling?",
        options: [
                "Horizontal scaling adds more machine nodes to a distributed cluster, whereas vertical scaling upgrades CPU/RAM on a single machine.",
                "Horizontal scaling requires taking the system completely offline.",
                "Vertical scaling distributes data across partitioned shards.",
                "Horizontal scaling can only run in a single availability zone."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Horizontal scaling scales out by adding commodity nodes; vertical scaling scales up by augmenting compute resources of an individual machine."
      },
      {
        id: "cs450-q12",
        question: "12. What primary advantage does asynchronous non-blocking I/O provide in high-throughput network architectures?",
        options: [
                "Enables a single process or event loop to handle thousands of concurrent connections without thread-per-connection context switching overhead",
                "Guarantees zero-latency packet transmission over physical fiber",
                "Encrypts payload buffers without CPU cycle consumption",
                "Prevents TCP connection drops during network partitions"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Non-blocking I/O uses OS event notification (e.g. epoll, kqueue) to multiplex massive concurrent sockets efficiently."
      },
      {
        id: "cs450-q13",
        question: "13. What is the purpose of rate limiting algorithms like Token Bucket or Leaky Bucket in API gateway design?",
        options: [
                "Controlling request traffic rates to prevent resource exhaustion, mitigate DoS attacks, and protect downstream services",
                "Compressing outgoing JSON payloads into binary streams",
                "Routing incoming traffic to the nearest geographic edge node",
                "Translating REST API requests into GraphQL queries"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Token Bucket allows controlled burstiness while enforcing a sustainable average rate, guarding backend services."
      },
      {
        id: "cs450-q14",
        question: "14. In distributed systems, what does the CAP theorem state regarding network partitions?",
        options: [
                "During a network partition, a distributed system must choose between Consistency (all nodes see the same data) and Availability (every request receives a non-error response).",
                "A system can achieve Consistency, Availability, and Partition Tolerance simultaneously at all times.",
                "Network partitions can be permanently eliminated with fiber optics.",
                "Partition tolerance only applies to relational SQL databases."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "When network communication fails (P), the system must trade off between returning stale/failed responses (A) or waiting for sync (C)."
      },
      {
        id: "cs450-q15",
        question: "15. What security vulnerability does a Cross-Site Request Forgery (CSRF) attack exploit?",
        options: [
                "The browser's automatic inclusion of stored session authentication credentials (cookies) with unauthorized third-party requests",
                "Injecting malicious executable JavaScript into HTML responses (XSS)",
                "Overrunning a fixed memory buffer on the operating system kernel",
                "Modifying SQL query tokens via untrusted input parameters"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "CSRF tricks a user's browser into sending authenticated HTTP requests using existing session cookies without the user's intent."
      },
      {
        id: "cs450-q16",
        question: "16. What is the primary role of a reverse proxy (such as NGINX or Envoy) in modern web infrastructure?",
        options: [
                "Terminating SSL/TLS, load balancing incoming requests across internal services, and caching static assets",
                "Compiling frontend React JSX into machine assembly code",
                "Providing persistent non-volatile disk storage for database tables",
                "Translating domain names into IP addresses via DNS resolution"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Reverse proxies shield origin servers, perform TLS offloading, distribute traffic, and handle edge response caching."
      },
      {
        id: "cs450-q17",
        question: "17. In cryptographic communication protocols (e.g. TLS 1.3), what does Perfect Forward Secrecy (PFS) guarantee?",
        options: [
                "Compromise of the server's long-term private key does not compromise past session keys or decrypt recorded historical traffic.",
                "The client and server can communicate without exchanging public keys.",
                "Messages are immune to quantum computing decryption forever.",
                "The session requires zero encryption overhead."
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "PFS uses ephemeral Diffie-Hellman exchanges so each session key is unique and temporary, protecting past traffic."
      },
      {
        id: "cs450-q18",
        question: "18. What is the fundamental operational principle of the Circuit Breaker pattern in microservice architectures?",
        options: [
                "Failing fast when downstream services exhibit consecutive errors, preventing cascading failures and allowing the dependency to recover",
                "Encrypting all inter-service communications using mTLS",
                "Routing all database writes to a single master instance",
                "Automatically restarting container pods upon memory exhaustion"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Circuit breakers transition from Closed to Open upon repeated failures, cutting traffic to prevent system-wide resource starvation."
      },
      {
        id: "cs450-q19",
        question: "19. What is the primary operational trade-off of database sharding (horizontal database partitioning)?",
        options: [
                "Enables massive write scalability, but introduces significant complexity for cross-shard joins, transactions, and rebalancing",
                "Reduces query latency for all possible multi-table join patterns",
                "Eliminates the need for indexing tables",
                "Guarantees immediate global ACID transactions across all partitions"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Sharding partitions data across independent database nodes, scaling storage and writes at the expense of cross-shard transactional complexity."
      },
      {
        id: "cs450-q20",
        question: "20. What is a Zero-Trust architecture in enterprise and cloud security?",
        options: [
                "A security model that requires strict continuous identity verification and least-privilege access for every request, regardless of whether it originates inside or outside the network perimeter.",
                "A network where all firewalls are disabled for maximum speed",
                "A protocol that trusts all requests originating from local subnet IP addresses",
                "An architecture where no cryptographic keys are ever stored on servers"
      ],
        correctAnswerIndex: 0,
        points: 1,
        explanation: "Zero Trust operates on 'never trust, always verify', enforcing contextual authentication and authorization on every transaction."
      }
    ]
  }
};

