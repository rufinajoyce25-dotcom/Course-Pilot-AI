const fs = require('fs');

// 10 additional questions for CS401 (11 to 20)
const extraCS401 = [
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
];

// 10 additional questions for CS305 (11 to 20)
const extraCS305 = [
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
];

// Helper to generate 10 extra generic advanced CS questions for other courses
function generateExtraQuestions(courseCode, subjectName) {
  const topics = [
    {
      q: `11. In ${subjectName}, how does horizontal scaling differ fundamentally from vertical scaling?`,
      opts: [
        "Horizontal scaling adds more machine nodes to a distributed cluster, whereas vertical scaling upgrades CPU/RAM on a single machine.",
        "Horizontal scaling requires taking the system completely offline.",
        "Vertical scaling distributes data across partitioned shards.",
        "Horizontal scaling can only run in a single availability zone."
      ],
      ans: 0,
      exp: "Horizontal scaling scales out by adding commodity nodes; vertical scaling scales up by augmenting compute resources of an individual machine."
    },
    {
      q: `12. What primary advantage does asynchronous non-blocking I/O provide in high-throughput network architectures?`,
      opts: [
        "Enables a single process or event loop to handle thousands of concurrent connections without thread-per-connection context switching overhead",
        "Guarantees zero-latency packet transmission over physical fiber",
        "Encrypts payload buffers without CPU cycle consumption",
        "Prevents TCP connection drops during network partitions"
      ],
      ans: 0,
      exp: "Non-blocking I/O uses OS event notification (e.g. epoll, kqueue) to multiplex massive concurrent sockets efficiently."
    },
    {
      q: `13. What is the purpose of rate limiting algorithms like Token Bucket or Leaky Bucket in API gateway design?`,
      opts: [
        "Controlling request traffic rates to prevent resource exhaustion, mitigate DoS attacks, and protect downstream services",
        "Compressing outgoing JSON payloads into binary streams",
        "Routing incoming traffic to the nearest geographic edge node",
        "Translating REST API requests into GraphQL queries"
      ],
      ans: 0,
      exp: "Token Bucket allows controlled burstiness while enforcing a sustainable average rate, guarding backend services."
    },
    {
      q: `14. In distributed systems, what does the CAP theorem state regarding network partitions?`,
      opts: [
        "During a network partition, a distributed system must choose between Consistency (all nodes see the same data) and Availability (every request receives a non-error response).",
        "A system can achieve Consistency, Availability, and Partition Tolerance simultaneously at all times.",
        "Network partitions can be permanently eliminated with fiber optics.",
        "Partition tolerance only applies to relational SQL databases."
      ],
      ans: 0,
      exp: "When network communication fails (P), the system must trade off between returning stale/failed responses (A) or waiting for sync (C)."
    },
    {
      q: `15. What security vulnerability does a Cross-Site Request Forgery (CSRF) attack exploit?`,
      opts: [
        "The browser's automatic inclusion of stored session authentication credentials (cookies) with unauthorized third-party requests",
        "Injecting malicious executable JavaScript into HTML responses (XSS)",
        "Overrunning a fixed memory buffer on the operating system kernel",
        "Modifying SQL query tokens via untrusted input parameters"
      ],
      ans: 0,
      exp: "CSRF tricks a user's browser into sending authenticated HTTP requests using existing session cookies without the user's intent."
    },
    {
      q: `16. What is the primary role of a reverse proxy (such as NGINX or Envoy) in modern web infrastructure?`,
      opts: [
        "Terminating SSL/TLS, load balancing incoming requests across internal services, and caching static assets",
        "Compiling frontend React JSX into machine assembly code",
        "Providing persistent non-volatile disk storage for database tables",
        "Translating domain names into IP addresses via DNS resolution"
      ],
      ans: 0,
      exp: "Reverse proxies shield origin servers, perform TLS offloading, distribute traffic, and handle edge response caching."
    },
    {
      q: `17. In cryptographic communication protocols (e.g. TLS 1.3), what does Perfect Forward Secrecy (PFS) guarantee?`,
      opts: [
        "Compromise of the server's long-term private key does not compromise past session keys or decrypt recorded historical traffic.",
        "The client and server can communicate without exchanging public keys.",
        "Messages are immune to quantum computing decryption forever.",
        "The session requires zero encryption overhead."
      ],
      ans: 0,
      exp: "PFS uses ephemeral Diffie-Hellman exchanges so each session key is unique and temporary, protecting past traffic."
    },
    {
      q: `18. What is the fundamental operational principle of the Circuit Breaker pattern in microservice architectures?`,
      opts: [
        "Failing fast when downstream services exhibit consecutive errors, preventing cascading failures and allowing the dependency to recover",
        "Encrypting all inter-service communications using mTLS",
        "Routing all database writes to a single master instance",
        "Automatically restarting container pods upon memory exhaustion"
      ],
      ans: 0,
      exp: "Circuit breakers transition from Closed to Open upon repeated failures, cutting traffic to prevent system-wide resource starvation."
    },
    {
      q: `19. What is the primary operational trade-off of database sharding (horizontal database partitioning)?`,
      opts: [
        "Enables massive write scalability, but introduces significant complexity for cross-shard joins, transactions, and rebalancing",
        "Reduces query latency for all possible multi-table join patterns",
        "Eliminates the need for indexing tables",
        "Guarantees immediate global ACID transactions across all partitions"
      ],
      ans: 0,
      exp: "Sharding partitions data across independent database nodes, scaling storage and writes at the expense of cross-shard transactional complexity."
    },
    {
      q: `20. What is a Zero-Trust architecture in enterprise and cloud security?`,
      opts: [
        "A security model that requires strict continuous identity verification and least-privilege access for every request, regardless of whether it originates inside or outside the network perimeter.",
        "A network where all firewalls are disabled for maximum speed",
        "A protocol that trusts all requests originating from local subnet IP addresses",
        "An architecture where no cryptographic keys are ever stored on servers"
      ],
      ans: 0,
      exp: "Zero Trust operates on 'never trust, always verify', enforcing contextual authentication and authorization on every transaction."
    }
  ];

  return topics.map((t, idx) => ({
    id: `${courseCode.toLowerCase()}-q${idx + 11}`,
    question: t.q,
    options: t.opts,
    correctAnswerIndex: t.ans,
    points: 1,
    explanation: t.exp
  }));
}

module.exports = { extraCS401, extraCS305, generateExtraQuestions };
console.log("Constructed extra questions.");
