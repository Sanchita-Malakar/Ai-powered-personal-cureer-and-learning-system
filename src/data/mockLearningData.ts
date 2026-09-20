import {
  LearningItem,
  LearningEngineStats,
} from "@/types/learning";

export const RECOMMENDED_LEARNING_ITEMS: LearningItem[] = [
  // ===================== 1. PYTHON ADVANCED =====================
  {
    id: "learn-py-adv",
    topic: "Python Advanced",
    category: "Programming",
    careerGoalAlignment: "AI/ML Engineer & Backend Systems",
    skillGapAddressed: "Closes gap in low-level concurrency, asyncio event loops, and GIL thread isolation.",
    difficulty: "Advanced",
    estimatedTime: "2h 45m",
    progress: 75,
    isCompleted: false,
    resources: [
      {
        id: "res-py-1",
        title: "Deep Dive into the Python GIL & Bytecode",
        type: "video",
        durationOrPages: "38 min",
        provider: "Core Dev Talk",
      },
      {
        id: "res-py-2",
        title: "AsyncIO & Event Loop Architecture Masterclass",
        type: "interactive_doc",
        durationOrPages: "18 pages",
        provider: "RealPython Pro",
      },
      {
        id: "res-py-3",
        title: "Metaclasses, Descriptors & Custom Decorators Cheatsheet",
        type: "cheatsheet",
        durationOrPages: "4 pages",
        provider: "CareerOS Engineering",
      },
      {
        id: "res-py-4",
        title: "Multi-Process Distributed Worker Sandbox",
        type: "sandbox",
        durationOrPages: "Interactive Lab",
        provider: "Python 3.10 Runtime",
      },
    ],
    lessons: [
      {
        id: "les-py-1",
        title: "The Global Interpreter Lock (GIL) & Process Spawning",
        durationMinutes: 35,
        summary:
          "Understand why Python bytecode requires a mutual exclusion lock and how to bypass it using multiprocessing and C-extensions.",
        contentMarkdown: `### The Global Interpreter Lock (GIL) Internals

In CPython (the standard Python implementation), memory management is not thread-safe. To prevent race conditions in reference counts (\`PyObject_HEAD\`), the **Global Interpreter Lock** ensures that only one native OS thread executes Python bytecode at any given instant.

#### Key Takeaway for High-Performance Applications:
- **I/O-Bound Workloads** (Web requests, SQL queries, disk reads): Multithreading provides significant throughput gains because threads automatically release the GIL during syscall waits.
- **CPU-Bound Workloads** (Matrix algebra, image rendering, crypto): Multithreading results in slower execution due to lock contention overhead. You must use \`multiprocessing\` to spawn independent Python interpreter instances with separate memory heaps.`,
        codeSnippet: {
          language: "python",
          title: "Bypassing GIL via ProcessPoolExecutor",
          code: `import concurrent.futures
import time

def cpu_heavy_task(n: int) -> int:
    return sum(i * i for i in range(n))

if __name__ == "__main__":
    numbers = [5_000_000, 5_000_000, 5_000_000, 5_000_000]
    
    # Utilizing separate OS processes across all CPU cores
    start = time.perf_counter()
    with concurrent.futures.ProcessPoolExecutor() as executor:
        results = list(executor.map(cpu_heavy_task, numbers))
    print(f"Computed in {time.perf_counter() - start:.2f}s across 4 cores")`,
          explanation:
            "ProcessPoolExecutor leverages separate OS processes, sidestepping GIL lock contention across physical cores.",
        },
        keyTakeaways: [
          "GIL protects CPython reference counts from race conditions.",
          "I/O-bound tasks release the GIL during blocking operations.",
          "CPU-bound tasks require multiprocessing or C/NumPy extensions for true multi-core utilization.",
        ],
        conceptCheck: {
          question: "Why does multithreading fail to speed up pure CPU-bound mathematical loops in CPython?",
          options: [
            "Threads are not recognized by the operating system.",
            "Only one thread can execute Python bytecode at a time due to the GIL mutex.",
            "Python doesn't support 64-bit integer calculations across threads.",
            "CPU cores refuse to schedule Python worker processes.",
          ],
          correctAnswerIndex: 1,
          hint: "Think about the mutex protecting Python's reference counts.",
        },
      },
      {
        id: "les-py-2",
        title: "AsyncIO, Coroutines & Non-Blocking Event Loops",
        durationMinutes: 40,
        summary: "Master async/await syntax, task scheduling, and building high-concurrency microservices.",
        contentMarkdown: `### Cooperative Multitasking with AsyncIO

Unlike preemptive multitasking where the OS kernel arbitrarily interrupts threads, \`asyncio\` relies on **cooperative multitasking**. A coroutine voluntarily yields control back to the central event loop using the \`await\` keyword while waiting for non-blocking I/O.`,
        codeSnippet: {
          language: "python",
          title: "Asynchronous Concurrent Fetching with asyncio.gather",
          code: `import asyncio

async def fetch_telemetry(sensor_id: int) -> dict:
    # Simulating non-blocking network socket delay
    await asyncio.sleep(0.5)
    return {"sensor_id": sensor_id, "status": "active"}

async def main():
    # Schedule 5 coroutines concurrently on a single thread
    results = await asyncio.gather(*(fetch_telemetry(i) for i in range(5)))
    print("Fetched all in ~0.5 seconds:", len(results))

if __name__ == "__main__":
    asyncio.run(main())`,
          explanation:
            "asyncio.gather schedules all 5 network coroutines cooperatively on a single event loop thread.",
        },
        keyTakeaways: [
          "Coroutines yield control at await points without OS context switch overhead.",
          "A single thread can service 10,000+ simultaneous connections with low memory footprint.",
          "Never call blocking synchronous functions (like time.sleep or requests.get) inside coroutines.",
        ],
      },
    ],
    quiz: [
      {
        id: "q-py-1",
        question:
          "Which of the following operations reliably releases the Python GIL in standard CPython?",
        codeSnippet: undefined,
        options: [
          "Evaluating a list comprehension with 10 million elements",
          "Blocking OS I/O operations such as socket.recv() or disk read",
          "Calling a nested recursive function",
          "Initializing a Python dictionary with string keys",
        ],
        correctOptionIndex: 1,
        explanation:
          "Standard CPython explicitly releases the GIL when entering blocking operating system syscalls like socket read/write and file I/O, permitting other threads to run bytecode.",
      },
      {
        id: "q-py-2",
        question:
          "What happens if you execute a blocking call like `time.sleep(5)` inside an `asyncio` coroutine?",
        codeSnippet: undefined,
        options: [
          "Only that specific coroutine pauses, other tasks continue uninterrupted.",
          "The entire single-threaded event loop blocks for 5 seconds, starving all other concurrent coroutines.",
          "AsyncIO automatically delegates the sleep to an OS worker thread.",
          "A runtime SyntaxError is raised.",
        ],
        correctOptionIndex: 1,
        explanation:
          "Because asyncio event loops run on a single thread, calling synchronous blocking code stops the entire loop, preventing all scheduled coroutines from progressing.",
      },
      {
        id: "q-py-3",
        question:
          "How does Python's `@functools.wraps(fn)` improve decorator definitions?",
        codeSnippet: undefined,
        options: [
          "It forces the decorated function to compile to C bytecode.",
          "It preserves the original function's name, docstring, and annotations.",
          "It automatically memoizes the return value in Redis.",
          "It prevents recursive stack overflows.",
        ],
        correctOptionIndex: 1,
        explanation:
          "@functools.wraps copies the __name__, __doc__, and module metadata from the original function to the wrapper function.",
      },
    ],
    nextRecommendedTopicId: "learn-sql-opt",
    nextRecommendationReason:
      "Now that you understand high-throughput backend concurrency, master SQL Indexing and Relational Optimization to eliminate database bottlenecks.",
  },

  // ===================== 2. SQL =====================
  {
    id: "learn-sql-opt",
    topic: "SQL",
    category: "Database",
    careerGoalAlignment: "Enterprise Backend & Full-Stack Systems",
    skillGapAddressed: "Directly resolves SQL rating ('Needs Improvement' - 52%) on dashboard.",
    difficulty: "Intermediate",
    estimatedTime: "2h 15m",
    progress: 35,
    isCompleted: false,
    resources: [
      {
        id: "res-sql-1",
        title: "PostgreSQL B-Tree Indexing & Leftmost Prefix Rule",
        type: "interactive_doc",
        durationOrPages: "14 pages",
        provider: "Postgres internals",
      },
      {
        id: "res-sql-2",
        title: "Reading EXPLAIN (ANALYZE, BUFFERS) Execution Plans",
        type: "video",
        durationOrPages: "26 min",
        provider: "Database Masterclass",
      },
      {
        id: "res-sql-3",
        title: "ACID Isolation Levels & Anomaly Prevention Guide",
        type: "cheatsheet",
        durationOrPages: "3 pages",
        provider: "CareerOS Database Series",
      },
      {
        id: "res-sql-4",
        title: "Live SQL Sandbox: Index Scan vs Sequential Scan",
        type: "sandbox",
        durationOrPages: "SQL Playground",
        provider: "PostgreSQL 16",
      },
    ],
    lessons: [
      {
        id: "les-sql-1",
        title: "B+ Tree Index Structures & The Leftmost Prefix Rule",
        durationMinutes: 30,
        summary:
          "Discover how relational databases navigate B+ Tree pages and why multi-column index ordering dictates query plan efficiency.",
        contentMarkdown: `### B+ Tree Index Mechanics

A database index is a balanced search tree where all data rows or row pointers (TIDs) reside in leaf pages, linked sequentially for fast range scans.

#### The Leftmost Prefix Rule:
Given a composite index on \`(tenant_id, status, created_at)\`:
- ✅ \`WHERE tenant_id = 42\` uses the index.
- ✅ \`WHERE tenant_id = 42 AND status = 'active'\` uses the index.
- ❌ \`WHERE status = 'active'\` **CANNOT** use the index efficiently because the search tree is ordered primarily by the first column (\`tenant_id\`).`,
        codeSnippet: {
          language: "sql",
          title: "Benchmarking Seq Scan vs Index Scan with EXPLAIN ANALYZE",
          code: `-- Without index: Sequential scan examining 1,000,000 rows
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 94812;
-- Plan: Seq Scan on orders (cost=0.00..18450.00 rows=12 width=104) (actual time=48.2ms)

-- Create targeted B-Tree index
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- With index: Direct leaf node lookup
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 94812;
-- Plan: Index Scan using idx_orders_customer (actual time=0.08ms)`,
          explanation:
            "Adding a targeted B-Tree index reduced query execution latency from 48.2ms down to 0.08ms (600x speedup).",
        },
        keyTakeaways: [
          "B+ Tree leaves are linked sequentially, making range queries (BETWEEN, >, <) O(log N + K).",
          "Composite indexes must align with the leftmost prefix of query WHERE and ORDER BY clauses.",
          "Avoid indexing low-cardinality boolean columns alone unless combined into a composite or partial index.",
        ],
        conceptCheck: {
          question: "Given an index CREATE INDEX idx_emp ON employees(department_id, salary), which query can use it effectively?",
          options: [
            "SELECT * FROM employees WHERE salary > 80000;",
            "SELECT * FROM employees WHERE department_id = 10 AND salary > 80000;",
            "SELECT * FROM employees ORDER BY salary DESC;",
            "None of the above.",
          ],
          correctAnswerIndex: 1,
          hint: "The index is ordered first by department_id, then by salary.",
        },
      },
      {
        id: "les-sql-2",
        title: "ACID Transactions & Preventing Concurrency Anomalies",
        durationMinutes: 35,
        summary: "Evaluate Read Committed, Repeatable Read, and Serializable isolation levels against race conditions.",
        contentMarkdown: `### Transaction Isolation Levels

When thousands of users interact with a database simultaneously, race conditions can corrupt balances, inventory, and ledger state.

| Isolation Level | Dirty Reads | Non-Repeatable Reads | Phantom Reads | Serialization Anomalies |
|---|---|---|---|---|
| **Read Committed** (Default) | Prevented | Allowed | Allowed | Allowed |
| **Repeatable Read** | Prevented | Prevented | Prevented (Postgres) | Allowed |
| **Serializable** | Prevented | Prevented | Prevented | Prevented |`,
        keyTakeaways: [
          "Read Committed is the default in PostgreSQL and SQL Server.",
          "Use Serializable or explicit row-level locks (SELECT FOR UPDATE) for balance deduction and inventory reservation.",
        ],
      },
    ],
    quiz: [
      {
        id: "q-sql-1",
        question:
          "Under PostgreSQL's default `Read Committed` isolation level, which anomaly can occur if a transaction reads the same row twice?",
        options: [
          "Dirty Read (reading uncommitted data from a crashed transaction)",
          "Non-Repeatable Read (another committed transaction modifies the row between reads)",
          "Database disk corruption",
          "Deadlock timeout error",
        ],
        correctOptionIndex: 1,
        explanation:
          "In Read Committed, each individual query sees a fresh snapshot of committed data. If another transaction commits a change in between, repeating the query yields different values (Non-Repeatable Read).",
      },
      {
        id: "q-sql-2",
        question:
          "Given a composite index on `(company_id, created_at, status)`, why does `SELECT * FROM audits WHERE created_at > '2026-01-01'` perform a sequential scan?",
        options: [
          "PostgreSQL cannot index timestamp columns.",
          "The query omits the leading column `company_id`, violating the leftmost prefix rule.",
          "Sequential scans are always faster for date comparisons.",
          "B-Trees only support exact equality matches.",
        ],
        correctOptionIndex: 1,
        explanation:
          "Because the B-Tree is sorted first by company_id, the database cannot jump to a specific branch without knowing which company_id to search for.",
      },
      {
        id: "q-sql-3",
        question:
          "What is the key benefit of a `Partial Index` (e.g., `CREATE INDEX ON orders(id) WHERE status = 'pending'`)?",
        options: [
          "It indexes only the active subset of rows, minimizing disk space and write overhead.",
          "It eliminates the need for primary keys.",
          "It converts relational tables into NoSQL documents.",
          "It bypasses foreign key verification.",
        ],
        correctOptionIndex: 0,
        explanation:
          "Partial indexes drastically reduce index size and maintenance cost by indexing only rows satisfying the WHERE filter (ideal for pending queues or active users).",
      },
    ],
    nextRecommendedTopicId: "learn-ml-found",
    nextRecommendationReason:
      "Your SQL foundation is now strengthened! Next, bridge your data management skills into Machine Learning & Neural Network Foundations.",
  },

  // ===================== 3. MACHINE LEARNING =====================
  {
    id: "learn-ml-found",
    topic: "Machine Learning",
    category: "AI/ML",
    careerGoalAlignment: "AI/ML Engineer Target Career Goal",
    skillGapAddressed: "Level up from 'Beginner' (42%) to core production ML proficiency.",
    difficulty: "Intermediate",
    estimatedTime: "3h 30m",
    progress: 20,
    isCompleted: false,
    resources: [
      {
        id: "res-ml-1",
        title: "Bias-Variance Tradeoff & Model Regularization",
        type: "video",
        durationOrPages: "32 min",
        provider: "Stanford CS229",
      },
      {
        id: "res-ml-2",
        title: "Transformer Scaled Dot-Product Attention Explained",
        type: "interactive_doc",
        durationOrPages: "16 pages",
        provider: "Illustrated Transformer",
      },
      {
        id: "res-ml-3",
        title: "PyTorch Tensor Operations & Backprop Sandbox",
        type: "sandbox",
        durationOrPages: "Jupyter Notebook",
        provider: "PyTorch 2.4",
      },
      {
        id: "res-ml-4",
        title: "Evaluation Metrics: Precision, Recall, F1, ROC-AUC",
        type: "cheatsheet",
        durationOrPages: "3 pages",
        provider: "CareerOS ML Guide",
      },
    ],
    lessons: [
      {
        id: "les-ml-1",
        title: "The Bias-Variance Tradeoff & Regularization Techniques",
        durationMinutes: 45,
        summary:
          "Understand underfitting vs overfitting, L1 (Lasso) vs L2 (Ridge) weight decay, and dropout mechanisms.",
        contentMarkdown: `### The Fundamental ML Tradeoff

Every predictive model's expected generalization error decomposes into three distinct components:
$$\\text{Total Error} = \\text{Bias}^2 + \\text{Variance} + \\text{Irreducible Noise}$$

- **High Bias (Underfitting)**: The model makes overly simplistic assumptions (e.g. fitting a straight line to a quadratic curve). Fails on both training and test data.
- **High Variance (Overfitting)**: The model memorizes training noise rather than the underlying pattern. Achieves 99% training accuracy but drops to 60% on validation data.

#### Regularization Remedies:
1. **L2 Regularization (Ridge / Weight Decay)**: Adds penalty $\\lambda \\sum w_i^2$, encouraging smaller, distributed weights across features.
2. **L1 Regularization (Lasso)**: Adds penalty $\\lambda \\sum |w_i|$, driving less important feature weights strictly to zero (automatic feature selection).
3. **Dropout**: Randomly zeroes out neurons with probability $p$ during forward propagation, preventing co-adaptation of features.`,
        codeSnippet: {
          language: "python",
          title: "Implementing PyTorch Weight Decay and Dropout",
          code: `import torch
import torch.nn as nn

class RobustClassifier(nn.Module):
    def __init__(self, input_dim: int, num_classes: int):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            # Dropout prevents neural co-adaptation
            nn.Dropout(p=0.3),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)

# Training with L2 Weight Decay
model = RobustClassifier(input_dim=20, num_classes=2)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)`,
          explanation:
            "Combining Dropout (p=0.3) in the architecture with AdamW weight decay (1e-4) penalizes complex weights and prevents overfitting.",
        },
        keyTakeaways: [
          "High training error = High Bias; Large train-val gap = High Variance.",
          "L1 drives weights to zero (sparsity); L2 shrinks weights uniformly (smoothness).",
          "Cross-validation is mandatory to calibrate regularization hyperparameter lambda.",
        ],
      },
      {
        id: "les-ml-2",
        title: "Transformer Architecture & Self-Attention",
        durationMinutes: 50,
        summary:
          "Deconstruct Scaled Dot-Product Attention: Query, Key, Value matrices and multi-head attention.",
        contentMarkdown: `### Scaled Dot-Product Attention

The core engine of modern LLMs (GPT, Claude, LLaMA) is the Scaled Dot-Product Attention formula:
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

- **Query ($Q$)**: Represents what the current token is seeking.
- **Key ($K$)**: Represents what each token contains.
- **Value ($V$)**: Represents the information passed forward if a match occurs.
- **Scaling Factor $\\sqrt{d_k}$**: Prevents the dot product magnitudes from pushing the softmax function into regions with vanishingly small gradients.`,
        keyTakeaways: [
          "Self-attention allows every token to directly communicate with every other token in O(1) sequential hops.",
          "Multi-Head Attention projects Q, K, V into multiple subspaces to capture diverse syntactic and semantic relationships.",
        ],
      },
    ],
    quiz: [
      {
        id: "q-ml-1",
        question:
          "Why is the dot product $QK^T$ scaled by $\\frac{1}{\\sqrt{d_k}}$ in Transformer Self-Attention?",
        options: [
          "To force the matrix multiplication to execute in half precision (FP16).",
          "To prevent large dot product values from driving softmax into regions with vanishingly small gradients.",
          "To ensure the final sequence length remains constant.",
          "To normalize token embeddings between -1 and +1.",
        ],
        correctOptionIndex: 1,
        explanation:
          "For large dimension $d_k$, the dot products grow large in magnitude, pushing softmax into saturation where gradients are near zero. Dividing by $\\sqrt{d_k}$ keeps variance around 1.",
      },
      {
        id: "q-ml-2",
        question:
          "A model achieves 98% accuracy on training data but only 64% on validation data. What is the primary diagnosis and optimal remedy?",
        options: [
          "High Bias (Underfitting) — Increase model depth and training epochs.",
          "High Variance (Overfitting) — Apply L2 regularization, dropout, or gather more training data.",
          "Class Imbalance — Switch from cross-entropy loss to mean squared error.",
          "The learning rate is too low.",
        ],
        correctOptionIndex: 1,
        explanation:
          "A large divergence between high training accuracy and low validation accuracy is the hallmark of high variance (overfitting). Regularization and data augmentation address this directly.",
      },
      {
        id: "q-ml-3",
        question:
          "Which evaluation metric should be prioritized when training an AI diagnostic model to detect rare malignant medical conditions?",
        options: [
          "Accuracy alone",
          "Recall / Sensitivity (minimizing False Negatives)",
          "Inference Latency in milliseconds",
          "Precision alone",
        ],
        correctOptionIndex: 1,
        explanation:
          "In critical medical screening, missing a malignant condition (False Negative) is catastrophic. Recall measures the proportion of actual positive cases detected.",
      },
    ],
    nextRecommendedTopicId: "learn-dsa-trees",
    nextRecommendationReason:
      "You've mastered core machine learning foundations! Now strengthen your Algorithmic Trees & Graph traversals to pass Tier-1 technical coding rounds.",
  },

  // ===================== 4. DSA TREES =====================
  {
    id: "learn-dsa-trees",
    topic: "DSA Trees",
    category: "Algorithms",
    careerGoalAlignment: "Software Engineering & Algorithmic Rounds",
    skillGapAddressed: "Fixes the 43% Trees accuracy score identified by the diagnostic screener.",
    difficulty: "Intermediate",
    estimatedTime: "2h 00m",
    progress: 40,
    isCompleted: false,
    resources: [
      {
        id: "res-tr-1",
        title: "Visualgo Interactive Binary Search Tree Sandbox",
        type: "sandbox",
        durationOrPages: "Interactive",
        provider: "Visualgo",
      },
      {
        id: "res-tr-2",
        title: "Binary Tree Traversal Patterns (BFS vs DFS Deep Dive)",
        type: "video",
        durationOrPages: "28 min",
        provider: "Algorithms Explained",
      },
      {
        id: "res-tr-3",
        title: "Tree Recursion & Divide-and-Conquer Cheatsheet",
        type: "cheatsheet",
        durationOrPages: "4 pages",
        provider: "CareerOS Coding Series",
      },
      {
        id: "res-tr-4",
        title: "Lowest Common Ancestor & Diameter Master Guide",
        type: "interactive_doc",
        durationOrPages: "10 pages",
        provider: "LeetCode Patterns",
      },
    ],
    lessons: [
      {
        id: "les-tr-1",
        title: "Depth-First Search (Pre, In, Post-Order) & Stack Recursion",
        durationMinutes: 30,
        summary: "Understand DFS call stack mechanics and when to apply pre-order, in-order, and post-order processing.",
        contentMarkdown: `### The Three Classical DFS Orders

Tree traversals recursively visit every node exactly once:
1. **Pre-Order (\`Root → Left → Right\`)**: Used for cloning trees, serializing prefix expressions, and building directory trees.
2. **In-Order (\`Left → Root → Right\`)**: For a **Binary Search Tree (BST)**, in-order traversal yields elements in **strictly sorted ascending order**.
3. **Post-Order (\`Left → Right → Root\`)**: Bottom-up computation; essential for calculating subtree sizes, heights, and memory deletion.`,
        codeSnippet: {
          language: "python",
          title: "Validating a Binary Search Tree with In-Order Traversal",
          code: `def isValidBST(root) -> bool:
    prev = float('-inf')
    
    def inorder(node) -> bool:
        nonlocal prev
        if not node:
            return True
        if not inorder(node.left):
            return False
        if node.val <= prev:
            return False  # Invariant broken: must be strictly ascending
        prev = node.val
        return inorder(node.right)
        
    return inorder(root)`,
          explanation:
            "Because an in-order traversal of a BST must be strictly increasing, tracking the previously seen value in O(1) auxiliary space validates the entire tree.",
        },
        keyTakeaways: [
          "In-order traversal of a BST is always sorted in ascending order.",
          "Post-order traversal computes bottom-up properties (height, subtree sum, diameter).",
          "Space complexity for recursive DFS equals the maximum tree depth: O(log N) for balanced trees, O(N) for skewed trees.",
        ],
        conceptCheck: {
          question: "Which traversal order must you use to compute the total height of a binary tree from its subtrees?",
          options: [
            "Pre-order (Root, Left, Right)",
            "Post-order (Left, Right, Root)",
            "In-order (Left, Root, Right)",
            "Reverse In-order",
          ],
          correctAnswerIndex: 1,
          hint: "You need the heights of both subtrees before you can compute the current node's height (1 + max(left, right)).",
        },
      },
      {
        id: "les-tr-2",
        title: "Breadth-First Search (BFS) & Level-by-Level Processing",
        durationMinutes: 30,
        summary: "Master queue snapshots to isolate each tree level for level-order printing, zigzag scans, and right-side views.",
        contentMarkdown: `### BFS Queue Sizing Pattern

To process nodes level by level without mixing depths, measure the queue length at the start of each while iteration:
\`\`\`python
while queue:
    level_size = len(queue)
    for _ in range(level_size):
        node = queue.popleft()
        # All nodes in this loop belong strictly to the current level!
\`\`\``,
        keyTakeaways: [
          "Queue stores nodes in First-In-First-Out (FIFO) sequence.",
          "Snapshotting level_size ensures precise horizontal separation.",
        ],
      },
    ],
    quiz: [
      {
        id: "q-tr-1",
        question:
          "In-order traversal of a valid Binary Search Tree (BST) produces node values in what sequence?",
        options: [
          "Reverse alphabetical order",
          "Strictly ascending sorted order",
          "Random order depending on heap allocation",
          "Level-by-level descending order",
        ],
        correctOptionIndex: 1,
        explanation:
          "By mathematical definition of a BST, every left child is smaller than its root, and every right child is greater. In-order traversal (Left, Root, Right) therefore visits values in strictly ascending sorted order.",
      },
      {
        id: "q-tr-2",
        question:
          "What is the worst-case time and auxiliary stack space complexity for Depth-First Search on a completely skewed binary tree of $N$ nodes?",
        options: [
          "Time: O(log N), Space: O(1)",
          "Time: O(N), Space: O(N)",
          "Time: O(N^2), Space: O(log N)",
          "Time: O(N log N), Space: O(N)",
        ],
        correctOptionIndex: 1,
        explanation:
          "In a skewed tree (essentially a linked list), DFS visits all N nodes in O(N) time and creates an active call stack of depth N, consuming O(N) auxiliary space.",
      },
      {
        id: "q-tr-3",
        question:
          "Why is snapshotting `level_size = len(queue)` required at the start of each BFS level iteration?",
        options: [
          "It prevents the queue from overflowing operating system RAM.",
          "It isolates current-level nodes from child nodes pushed during the loop.",
          "It automatically sorts nodes by value.",
          "It balances the tree.",
        ],
        correctOptionIndex: 1,
        explanation:
          "Because enqueuing children expands the queue dynamically, freezing level_size ensures the inner loop pops only nodes belonging to the current depth level.",
      },
    ],
    nextRecommendedTopicId: "learn-py-adv",
    nextRecommendationReason:
      "Tree traversals mastered! Next, revisit Python Advanced Concurrency to practice multi-threaded worker pools.",
  },
];

export const INITIAL_LEARNING_STATS: LearningEngineStats = {
  careerGoal: "AI/ML Engineer",
  targetRole: "AI/ML Engineer & Full-Stack Developer",
  hoursInvested: 14.5,
  completedModulesCount: 3,
  totalModulesCount: 7,
  overallProgressPercentage: 58,
  topSkillGaps: [
    { skill: "SQL Query Optimization", currentScore: 52, targetScore: 80, urgency: "high" },
    { skill: "DSA Trees & Traversal", currentScore: 43, targetScore: 80, urgency: "high" },
    { skill: "Machine Learning Foundations", currentScore: 42, targetScore: 85, urgency: "high" },
    { skill: "Python Concurrency & GIL", currentScore: 78, targetScore: 90, urgency: "medium" },
  ],
  activeRecommendationHeadline:
    "Curriculum dynamically generated for: Career Goal (AI/ML Engineer) + Skill Gaps (SQL 52%, Trees 43%) + Performance",
  activeRecommendationReason:
    "Your target role requires strong data wrangling and algorithmic problem solving. We prioritized SQL optimization and Tree traversals to rapidly unblock your job application filters.",
};
