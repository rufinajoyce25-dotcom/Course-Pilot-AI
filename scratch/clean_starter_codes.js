const fs = require('fs');

// Template starter codes that do NOT give away the answers
const cleanStarterCodes = {
  // CS401
  "cs401-lab1": `# Lab 1: Data Preprocessing & Feature Scaling
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
  "cs401-lab2": `# Lab 2: Mini-Batch Gradient Descent for Logistic Regression
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
  "cs401-lab3": `# Lab 3: Deep Multilayer Perceptron & Neural Networks
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

  // CS305
  "cs305-lab1": `-- Lab 1: Advanced Relational Queries & Window Functions
-- SQLite / PostgreSQL Query Runtime
-- Objective: Write the SQL query to rank student scores partitioned by department.

-- WRITE YOUR SQL QUERY BELOW:
-- Example schema: students(id, name, department_id, score)
-- Requirements: Return student name, department, score, and dense_rank()
`,
  "cs305-lab2": `-- Lab 2: B-Tree Indexing & Performance Optimization
-- SQLite / PostgreSQL Query Runtime
-- Objective: Define index creation DDL statements to optimize lookup queries.

-- WRITE YOUR DDL STATEMENTS BELOW:
-- Create optimal composite index for: WHERE tenant_id = ? AND status = ? ORDER BY created_at DESC
`,
  "cs305-lab3": `# Lab 3: ACID Transactions & Concurrency Control
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

  // CS320
  "cs320-lab1": `# Lab 1: Multi-Stage Dockerfile Containerization
# Dockerfile specification
# Objective: Write an optimized multi-stage build Dockerfile.

# Stage 1: Build environment
# WRITE YOUR BUILD STAGE HERE:

# Stage 2: Minimal runtime environment
# WRITE YOUR RUNTIME STAGE HERE:
`,
  "cs320-lab2": `# Lab 2: Kubernetes Horizontal Pod Autoscaler Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloud-service-deployment
spec:
  # WRITE YOUR REPLICA & CONTAINER POD SPEC HERE:
`,
  "cs320-lab3": `# Lab 3: Terraform Infrastructure as Code
# Objective: Define resilient AWS VPC and ECS infrastructure.

# WRITE YOUR TERRAFORM RESOURCES HERE:
`,

  // CS380
  "cs380-lab1": `# Lab 1: Cryptographic Hashes & Digital Signatures
# Python 3.11 Cryptography Environment
# Objective: Implement HMAC-SHA256 signature verification.

def verify_hmac_signature(payload: bytes, secret_key: bytes, signature_hex: str) -> bool:
    """
    Computes HMAC-SHA256 of payload with secret_key and checks against signature_hex.
    Must use constant-time comparison to prevent timing attacks.
    """
    # WRITE YOUR CRYPTOGRAPHIC IMPLEMENTATION HERE:
    pass
`,
  "cs380-lab2": `# Lab 2: Zero-Knowledge Password Proof Authentication
# Objective: Implement SRP (Secure Remote Password) protocol client handshake.

def compute_client_proof(username, password, salt, B_public, s_salt):
    # WRITE YOUR IMPLEMENTATION HERE:
    pass
`,
  "cs380-lab3": `# Lab 3: Web Security & XSS / CSRF Defense Middleware
# Objective: Implement secure HTTP security header middleware.

def apply_security_headers(response):
    # WRITE YOUR HEADERS HERE (CSP, HSTS, X-Frame-Options):
    pass
`
};

module.exports = { cleanStarterCodes };
console.log("Loaded clean starter codes for labs.");
