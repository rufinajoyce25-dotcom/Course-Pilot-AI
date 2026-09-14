const fs = require('fs');

// We will construct the 8 courses: CS401, CS305, CS320, CS380, CS350, CS420, CS310, CS450.
// 1. Labs: starterCode is a clean template without the pre-filled answer!
// 2. Quizzes: 20 questions each, totalMarks: 20, passingMarks: 12, points: 1 per question.

const coursesData = {
  CS401: {
    name: "Machine Learning & Statistical Modeling",
    labs: [
      {
        id: "cs401-lab1",
        title: "Lab 1: Data Preprocessing, Normalization & Feature Scaling",
        description: "Clean missing values, apply min-max normalization, Z-Score standard scaling, and one-hot encoding on high-dimensional tabular datasets in Python.",
        objectives: [
          "Perform iterative imputation for missing features",
          "Implement Z-Score standardizer: (x - μ) / σ",
          "Verify zero mean (μ=0) and unit variance (σ=1) on training splits"
        ],
        starterCode: `# Lab 1: Data Preprocessing & Feature Scaling
# Python 3.11 Runtime Environment
# Objective: Implement the preprocess_pipeline function below.
# Do not leave this function empty.

import numpy as np

def preprocess_pipeline(X):
    """
    Takes a 2D numpy array X with potential NaN values.
    1. Impute any missing (NaN) values with column means.
    2. Standardize features to zero mean and unit variance: (X - mean) / std.
    3. Return the normalized numpy array.
    """
    # WRITE YOUR IMPLEMENTATION BELOW:
    pass
`,
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
        starterCode: `# Lab 2: Mini-Batch Gradient Descent for Logistic Regression
# Python 3.11 Runtime Environment
# Objective: Implement logistic regression training from scratch.

import numpy as np

def train_logistic_regression(X, y, lr=0.05, epochs=200):
    """
    Trains binary logistic regression using gradient descent.
    X: 2D feature matrix (N, D)
    y: 1D label vector (N,) with binary targets (0 or 1)
    Returns: 1D learned weights vector (D,)
    """
    # WRITE YOUR IMPLEMENTATION BELOW:
    pass
`,
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
        starterCode: `# Lab 3: Deep Multilayer Perceptron & Neural Networks
# Python 3.11 Runtime Environment
# Objective: Complete the DeepNeuralNetwork class.

import numpy as np

class DeepNeuralNetwork:
    def __init__(self, input_dim, hidden_dim, output_dim):
        """
        Initialize weight matrices W1 and W2 with random initialization.
        """
        # WRITE YOUR INITIALIZATION HERE:
        pass
    
    def forward(self, X):
        """
        Forward pass:
        Layer 1: ReLU activation
        Layer 2: Softmax output probabilities
        """
        # WRITE YOUR FORWARD PASS HERE:
        pass
`,
        testCases: [
          { name: "Macro F1-score", expected: "F1-Score >= 0.89" },
          { name: "Convergence rate", expected: "Training loss < 0.15" }
        ],
        points: 10
      }
    ],
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
        explanation: "Classification predicts discrete class labels, while regression estimates continuous real-valued targets."
      },
      {
        id: "cs401-q2",
        question: "2. What is the primary mathematical objective minimized in standard Ordinary Least Squares (OLS) linear regression?",
        options: [
          "Mean Absolute Error (MAE)",
          "Mean Squared Error (MSE) / Residual Sum of Squares (RSS)",
          "Cross-Entropy Loss",
          "Kullback-Leibler Divergence"
        ],
        correctAnswerIndex: 1,
        explanation: "OLS minimizes the sum of squared differences between observed targets and predicted values."
      },
      {
        id: "cs401-q3",
        question: "3. What is the range of output values produced by the standard Logistic Sigmoid activation function σ(z) = 1 / (1 + e^-z)?",
        options: [
          "[-1, 1]",
          "(0, 1)",
          "(-∞, +∞)",
          "[0, +∞)"
        ],
        correctAnswerIndex: 1,
        explanation: "The sigmoid activation function squashes inputs into the open interval (0, 1), representing probability estimates."
      },
      {
        id: "cs401-q4",
        question: "4. What is the signature characteristic of L1 Regularization (Lasso) compared to L2 Regularization (Ridge)?",
        options: [
          "L1 drives irrelevant feature coefficients exactly to zero, performing intrinsic feature selection.",
          "L1 squares weight coefficients, keeping all features non-zero.",
          "L1 regularization cannot be computed via gradient descent.",
          "L1 guarantees zero generalization error on validation data."
        ],
        correctAnswerIndex: 0,
        explanation: "The diamond geometry of L1 penalty forces non-informative weights to strictly zero, creating sparse models."
      },
      {
        id: "cs401-q5",
        question: "5. In the Bias-Variance tradeoff, what symptom characterizes a model with high variance?",
        options: [
          "The model underfits and has high training error and high validation error.",
          "The model overfits the training data, achieving very low training error but high test error.",
          "The model has too few parameters to capture linear trends.",
          "The model's predictions never change across different bootstrap samples."
        ],
        correctAnswerIndex: 1,
        explanation: "High variance occurs when a complex model overfits training noise, failing to generalize to unseen test distributions."
      },
      {
        id: "cs401-q6",
        question: "6. Which metric is most mathematically suitable for evaluating a binary classifier trained on an extreme 99:1 class imbalance dataset?",
        options: [
          "Standard Accuracy",
          "Area Under the Precision-Recall Curve (PR-AUC) / F1-Score",
          "Mean Squared Error",
          "Mean Absolute Percentage Error"
        ],
        correctAnswerIndex: 1,
        explanation: "Accuracy is misleading under heavy class imbalance (a naive model predicting majority gets 99% accuracy). PR-AUC and F1 focus on true positive precision and recall."
      },
      {
        id: "cs401-q7",
        question: "7. In Decision Tree construction, how is Information Gain mathematically defined during greedy feature splitting?",
        options: [
          "Entropy of parent node minus the weighted sum of child node entropies",
          "Sum of child variances divided by parent depth",
          "Gini impurity multiplied by tree maximum depth",
          "Inverse of the number of leaves in the pruned subtree"
        ],
        correctAnswerIndex: 0,
        explanation: "Information Gain equals Parent Entropy minus the weighted average entropy of the split child partitions."
      },
      {
        id: "cs401-q8",
        question: "8. In Support Vector Machines (SVMs), what mathematical purpose does the 'Kernel Trick' serve?",
        options: [
          "Implicitly maps input vectors into higher-dimensional feature spaces without computing coordinates explicitly",
          "Eliminates the need to find support vectors along margins",
          "Replaces quadratic programming with linear sorting",
          "Converts classification models into unsupervised clustering"
        ],
        correctAnswerIndex: 0,
        explanation: "The kernel trick evaluates inner products in high-dimensional Hilbert spaces using pairwise kernel functions (e.g. RBF), bypassing explicit coordinate transformations."
      },
      {
        id: "cs401-q9",
        question: "9. Why is K-Means clustering sensitive to initial centroid placement, and what strategy does K-Means++ use?",
        options: [
          "K-Means++ samples initial centroids probabilistically proportional to squared distance from existing centroids.",
          "K-Means++ places all initial centroids at the origin (0, 0).",
          "K-Means++ uses supervised labels to guide centroid clustering.",
          "K-Means++ runs an infinite loop until global optimality is mathematically guaranteed."
        ],
        correctAnswerIndex: 0,
        explanation: "K-Means++ chooses initial centroids far apart with probability proportional to D(x)^2, avoiding poor local minima."
      },
      {
        id: "cs401-q10",
        question: "10. In Principal Component Analysis (PCA), what do the eigenvectors of the data covariance matrix represent?",
        options: [
          "The directions of maximal variance in the dataset",
          "The centroid cluster centers in K-Means",
          "The decision boundaries of logistic regression",
          "The gradient update steps for backpropagation"
        ],
        correctAnswerIndex: 0,
        explanation: "Eigenvectors of the covariance matrix define orthogonal axes of maximum variance, while eigenvalues indicate the magnitude of variance captured."
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
        explanation: "Adam combines AdaGrad and RMSProp advantages by tracking exponentially decaying averages of past gradients (first moment) and squared gradients (second moment)."
      }
    ]
  },
  CS305: {
    name: "Database Systems: Relational Models & Transactions",
    labs: [
      {
        id: "cs305-lab1",
        title: "Lab 1: Advanced Relational Queries & Window Functions",
        description: "Author complex SQL queries utilizing partitioned window functions (ROW_NUMBER, DENSE_RANK), recursive CTEs, and multi-table inner/outer joins.",
        objectives: [
          "Construct 3NF compliant entity relationship schemas",
          "Write partitioned cumulative sum window queries",
          "Implement recursive hierarchical category tree lookups"
        ],
        starterCode: `-- Lab 1: Advanced Relational Queries & Window Functions
-- SQLite / PostgreSQL Query Runtime
-- Objective: Write the SQL query to rank student scores partitioned by department.

-- WRITE YOUR SQL QUERY BELOW:
-- Example schema: students(id, name, department_id, score)
-- Requirements: Return student name, department, score, and dense_rank()
`,
        testCases: [
          { name: "Window query", expected: "DENSE_RANK() computed per department" },
          { name: "Join integrity", expected: "Zero NULL department mappings" }
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
        starterCode: `-- Lab 2: B-Tree Indexing & Performance Optimization
-- SQLite / PostgreSQL Query Runtime
-- Objective: Define index creation DDL statements to optimize lookup queries.

-- WRITE YOUR DDL STATEMENTS BELOW:
-- Create optimal composite index for: WHERE tenant_id = ? AND status = ? ORDER BY created_at DESC
`,
        testCases: [
          { name: "Index scan", expected: "Index Scan replacing Sequential Scan" },
          { name: "Query cost", expected: "Execution cost < 15.0 units" }
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
        starterCode: `# Lab 3: ACID Transactions & Concurrency Control
# Python 3.11 Database Transaction Driver
# Objective: Implement safe bank account transfer with ACID isolation.

def execute_atomic_transfer(db_conn, from_account, to_account, amount):
    """
    Executes an atomic transfer between two accounts using transaction boundaries.
    Must ensure atomicity, rollback on failure, and handle concurrent isolation.
    """
    # WRITE YOUR TRANSACTION IMPLEMENTATION HERE:
    pass
`,
        testCases: [
          { name: "Atomicity check", expected: "Total balance conserved across rollback" },
          { name: "Deadlock resolution", expected: "Retry loop succeeds under lock contention" }
        ],
        points: 10
      }
    ],
    questions: [
      {
        id: "cs305-q1",
        question: "1. What does the 'I' in the ACID transaction guarantees formally denote?",
        options: [
          "Isolation: Concurrent transaction executions yield state equivalent to serial execution.",
          "Indexing: Every table must possess a clustered primary key.",
          "Immutability: Stored records cannot be modified after commit.",
          "Interoperability: Database drivers support cross-vendor SQL standards."
        ],
        correctAnswerIndex: 0,
        explanation: "Isolation ensures intermediate uncommitted transactions are invisible to concurrently executing operations."
      },
      {
        id: "cs305-q2",
        question: "2. Which normal form mandates that all non-key attributes are fully functionally dependent on the entire primary key, eliminating partial dependencies?",
        options: [
          "First Normal Form (1NF)",
          "Second Normal Form (2NF)",
          "Third Normal Form (3NF)",
          "Boyce-Codd Normal Form (BCNF)"
        ],
        correctAnswerIndex: 1,
        explanation: "2NF requires 1NF and guarantees that non-prime attributes depend on the entire candidate key rather than any proper subset."
      },
      {
        id: "cs305-q3",
        question: "3. What concurrency anomaly is defined as a transaction reading data modified by another uncommitted concurrent transaction that subsequently rolls back?",
        options: [
          "Dirty Read",
          "Non-Repeatable Read (Fuzzy Read)",
          "Phantom Read",
          "Lost Update"
        ],
        correctAnswerIndex: 0,
        explanation: "A dirty read occurs when Transaction A reads modifications made by Transaction B before B has committed; if B rolls back, A holds phantom data."
      },
      {
        id: "cs305-q4",
        question: "4. What is the worst-case and average-case time complexity of point search queries in a balanced B+ Tree of order m with N entries?",
        options: [
          "O(log_m N)",
          "O(N)",
          "O(N log N)",
          "O(1)"
        ],
        correctAnswerIndex: 0,
        explanation: "B+ trees maintain balanced shallow search trees where depth scales logarithmically with base m: O(log_m N)."
      },
      {
        id: "cs305-q5",
        question: "5. In Multi-Version Concurrency Control (MVCC), how do database engines permit non-blocking concurrent reads during active writes?",
        options: [
          "By creating immutable row version snapshots, allowing readers to view consistent snapshots without acquiring shared read locks",
          "By caching all tables in non-volatile random access memory",
          "By rejecting write operations until all readers disconnect",
          "By forcing all operations into single-threaded serial execution"
        ],
        correctAnswerIndex: 0,
        explanation: "MVCC maintains multiple row revisions tagged with transaction IDs, so readers inspect snapshots without taking locks."
      },
      {
        id: "cs305-q6",
        question: "6. What is the fundamental structural distinction between B-Trees and B+ Trees?",
        options: [
          "In B+ Trees, actual record pointers/data are stored exclusively in leaf nodes linked sequentially, while interior nodes hold only index routing keys.",
          "B-Trees store data only in root nodes.",
          "B+ Trees cannot be balanced dynamically.",
          "B-Trees support doubly linked leaf range scans whereas B+ Trees do not."
        ],
        correctAnswerIndex: 0,
        explanation: "B+ trees keep records and values solely in leaf pages linked for rapid range queries, leaving internal nodes purely for routing."
      },
      {
        id: "cs305-q7",
        question: "7. Under the ANSI SQL standard, which isolation level provides the strongest concurrency protection against all anomalies (dirty reads, non-repeatable reads, phantom reads)?",
        options: [
          "SERIALIZABLE",
          "REPEATABLE READ",
          "READ COMMITTED",
          "READ UNCOMMITTED"
        ],
        correctAnswerIndex: 0,
        explanation: "SERIALIZABLE guarantees that execution order produces outcomes identical to completely serial, sequential execution."
      },
      {
        id: "cs305-q8",
        question: "8. What does a database Write-Ahead Logging (WAL) protocol guarantee in the event of unexpected power failure?",
        options: [
          "Durability and Atomicity: Log records describing changes must be flushed to non-volatile disk before dirty data pages are written to the database files.",
          "Zero-latency read queries on distributed clusters",
          "Automatic encryption of relational database schemas",
          "Prevention of SQL injection vulnerabilities"
        ],
        correctAnswerIndex: 0,
        explanation: "WAL guarantees durability (ARIES recovery): log entries must reach non-volatile media prior to page flushing so crashes can be replayed or undone."
      },
      {
        id: "cs305-q9",
        question: "9. In relational algebra, what operation is equivalent to the SQL INNER JOIN with equality condition?",
        options: [
          "Theta Join (Equi-Join)",
          "Cartesian Product without selection",
          "Set Intersection on schemas",
          "Natural Projection"
        ],
        correctAnswerIndex: 0,
        explanation: "An inner join with an equality predicate is an Equi-Join (a special case of Theta Join)."
      },
      {
        id: "cs305-q10",
        question: "10. What is a 'Covering Index' in relational query optimization?",
        options: [
          "An index that includes all columns referenced in the query (SELECT, WHERE, JOIN, ORDER BY), allowing the engine to satisfy the query entirely from index leaf pages without table lookups.",
          "An index that encrypts table columns on disk",
          "An index applied to foreign keys exclusively",
          "A full-table scan performed on empty relations"
        ],
        correctAnswerIndex: 0,
        explanation: "A covering index contains all needed attributes, completely avoiding secondary table heap lookups."
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
        explanation: "An operation is idempotent if f(f(x)) = f(x); executing it repeatedly has no additional effect beyond the initial run."
      }
    ]
  }
};

console.log("Generating updated courseLabsAndQuizzes.ts...");
// Read original file to preserve other course data or construct the full 8 courses.
// Let's create the full 8 courses with 20 questions each!

