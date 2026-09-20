import {
  InterviewQuestion,
  InterviewConfig,
  InterviewReportData,
} from "@/types/interview";

export const INTERVIEW_QUESTIONS_BANK: InterviewQuestion[] = [
  // ===================== TECHNICAL: PYTHON =====================
  {
    id: "q-py-1",
    topic: "python",
    category: "technical",
    difficulty: "medium",
    question:
      "How does Python's Global Interpreter Lock (GIL) affect multi-threaded CPU-bound programs versus I/O-bound programs, and how do you achieve true parallelism in Python?",
    contextHint: "Mention thread switching, bytecode execution, multiprocessing vs threading, and C-extensions.",
    keyCriteria: [
      "Explains that GIL allows only one native thread to execute Python bytecode at a time.",
      "Distinguishes that I/O-bound tasks release the GIL during disk/network waits, making threading effective.",
      "Identifies that CPU-bound tasks suffer contention under multithreading due to lock overhead.",
      "Recommends multiprocessing (separate processes with independent memory/GIL) or C-extensions / NumPy vectorization for true parallelism.",
    ],
    modelAnswer:
      "Python's Global Interpreter Lock (GIL) is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once. For I/O-bound programs (e.g., web scraping, API calls, database queries), multithreading is effective because threads release the GIL while awaiting I/O operations. However, for CPU-bound tasks (e.g., matrix operations, image rendering), multithreading causes performance degradation due to thread contention and GIL acquisition overhead. To achieve true multi-core parallelism for CPU-bound tasks, we use the `multiprocessing` module—which spawns separate OS processes with individual GIL instances and memory spaces—or leverage vectorized C-extensions like NumPy and PyTorch which release the GIL during heavy computation.",
  },
  {
    id: "q-py-2",
    topic: "python",
    category: "technical",
    difficulty: "medium",
    question:
      "What are Python decorators and generator expressions? How do generators optimize memory usage when processing massive datasets?",
    contextHint: "Mention first-class functions, @wrapper, yield keyword, lazy evaluation, and iterators.",
    keyCriteria: [
      "Defines decorators as higher-order functions that take a function, add functionality, and return it without modifying original source code.",
      "Explains that generators use the `yield` keyword and produce items lazily on-demand.",
      "Contrasts generator lazy streaming (O(1) memory) against list comprehensions that load entire datasets into RAM (O(N) memory).",
    ],
    modelAnswer:
      "A decorator in Python is a higher-order function that takes another function as an argument, extends its behavior using a wrapper function, and returns it without permanently modifying the original function's source code (commonly used for logging, timing, authentication, and caching via @wraps). Generator expressions and functions use the `yield` keyword to return an iterator that produces values lazily, one at a time on demand. When processing massive datasets (such as 10GB log files or millions of database records), standard list comprehensions attempt to load the entire dataset into memory at once, causing Out-Of-Memory (OOM) errors. Generators maintain O(1) memory overhead because only a single item is held in RAM at any given moment, enabling efficient streaming pipelines.",
  },
  {
    id: "q-py-3",
    topic: "python",
    category: "technical",
    difficulty: "easy",
    question:
      "Explain the difference between deep copy and shallow copy in Python, and describe the danger of using mutable default arguments in function definitions.",
    contextHint: "Mention object references, copy module, default argument evaluation at def time.",
    keyCriteria: [
      "Defines shallow copy as copying the outer object while referencing inner nested objects.",
      "Defines deep copy as recursively copying all nested objects into fresh memory.",
      "Explains that default arguments in Python are evaluated once at function definition time, so mutable defaults (e.g. lists/dicts) persist state across calls.",
    ],
    modelAnswer:
      "In Python, an assignment (`a = b`) creates a new reference to the same underlying object. A shallow copy (`copy.copy()`) creates a new container object, but populates it with references to the child objects found in the original; modifying a nested mutable element in the shallow copy affects the original. A deep copy (`copy.deepcopy()`) recursively duplicates both the container and all objects contained within it, ensuring complete memory isolation. The danger of using a mutable default argument (like `def add_item(item, items=[])`) is that default argument expressions are evaluated once when the function is defined, not upon invocation. Subsequent calls share the exact same list instance, causing unintended persistent state. The best practice is using `None` as default (`items=None`) and initializing `items = []` inside the function body.",
  },

  // ===================== TECHNICAL: DSA =====================
  {
    id: "q-dsa-1",
    topic: "dsa",
    category: "technical",
    difficulty: "medium",
    question:
      "Given an array of integers, how would you design an algorithm to find the maximum length of a contiguous subarray with sum equal to K in O(N) time?",
    contextHint: "Think about prefix sums and hash maps storing first seen indices.",
    keyCriteria: [
      "Mentions Prefix Sum technique combined with a Hash Map.",
      "Explains that if current_prefix_sum - K exists in the map, the subarray between that index and current index sums to K.",
      "Stores only the first occurrence of each prefix sum to maximize length.",
      "States O(N) time complexity and O(N) space complexity.",
    ],
    modelAnswer:
      "We can solve this problem in O(N) time and O(N) space using a Prefix Sum with a Hash Map. As we iterate through the array, we maintain a running `prefix_sum`. If `prefix_sum == K`, the subarray from index 0 to current index `i` has sum K (length `i + 1`). Otherwise, we check if `(prefix_sum - K)` already exists in our hash map. If it exists at index `j`, then the elements between `j + 1` and `i` must sum to K, giving a candidate length of `i - j`. To maximize the length, we only insert a prefix sum into the map if it hasn't been seen before, preserving the earliest possible starting index. This avoids the naive O(N^2) brute-force approach.",
  },
  {
    id: "q-dsa-2",
    topic: "dsa",
    category: "technical",
    difficulty: "medium",
    question:
      "Compare the time and space complexity of BFS versus DFS for cycle detection in a directed graph. When would you prefer Kahn's algorithm?",
    contextHint: "Mention recursion stack, visited vs pathVisited (in-stack) states, in-degrees, and topological sorting.",
    keyCriteria: [
      "Explains DFS cycle detection using 3 states: unvisited, currently visiting (recursion stack / pathVisited), and visited.",
      "Explains Kahn's algorithm using in-degree calculation and queue.",
      "Notes both run in O(V + E) time.",
      "Points out that Kahn's algorithm is preferred when a valid topological order is required alongside cycle detection.",
    ],
    modelAnswer:
      "Both DFS and Kahn's algorithm detect cycles in directed graphs with O(V + E) time and O(V) space complexity. In DFS, a cycle exists if we encounter an edge leading to a vertex currently in the active recursion call stack (using a 3-color state or separate `visited` and `path_visited` sets). Kahn's algorithm is a BFS-based approach that computes the in-degree of all vertices, enqueues vertices with in-degree 0, and decrements neighbors' in-degrees as nodes are processed. If the total number of processed nodes is less than V, a cycle exists. We prefer Kahn's algorithm when we not only need to detect cycles but also need to produce a valid topological ordering (such as task scheduling or build dependency resolution), and to avoid recursion call-stack overflow on deep graphs.",
  },
  {
    id: "q-dsa-3",
    topic: "dsa",
    category: "technical",
    difficulty: "hard",
    question:
      "How does a Least Recently Used (LRU) Cache work internally, and how do you achieve strictly O(1) time complexity for both get and put operations?",
    contextHint: "Mention Doubly Linked List, Hash Map, dummy head/tail nodes, and eviction policy.",
    keyCriteria: [
      "Combines a Doubly Linked List (DLL) with a Hash Map.",
      "Hash map maps keys to DLL nodes for O(1) lookup.",
      "DLL maintains usage recency (most recent at head, least recent at tail) for O(1) removal and insertion.",
      "Explains eviction: remove tail node and delete from hash map when capacity is exceeded.",
    ],
    modelAnswer:
      "An LRU Cache operates with strictly O(1) time complexity for both `get` and `put` by coupling a Hash Map with a Doubly Linked List (DLL). The Hash Map maps each key directly to its corresponding Node in the DLL, enabling O(1) lookup. The DLL maintains the access recency order: newly accessed or created nodes are moved immediately behind the dummy head (most recently used), while the node before the dummy tail represents the least recently used element. When `get(key)` is called, we look up the node in the hash map, detach it from its current position in the DLL, and attach it to the head in O(1). When `put(key, value)` is called, if the key exists we update its value and move it to head; if it's new and capacity is exceeded, we evict the tail node in O(1), delete its key from the hash map, and insert the new node at the head.",
  },

  // ===================== TECHNICAL: DBMS =====================
  {
    id: "q-db-1",
    topic: "dbms",
    category: "technical",
    difficulty: "medium",
    question:
      "Explain the difference between Clustered and Non-Clustered Indexes in relational databases. How does a B+ Tree index improve range query efficiency?",
    contextHint: "Mention primary key, physical table ordering, leaf nodes, and sequential disk I/O.",
    keyCriteria: [
      "Explains that a Clustered Index dictates the physical sorting order of table rows on disk (only one clustered index per table).",
      "Explains that a Non-Clustered Index is a separate structure containing index keys and pointers back to data rows.",
      "Explains B+ Tree: all data pointers reside in leaf nodes, linked sequentially via a linked list for fast range scans (O(log N + K)).",
    ],
    modelAnswer:
      "A Clustered Index dictates the physical storage order of the actual table data rows on disk; because data rows can only be sorted in one physical sequence, a table can have only one clustered index (typically on the Primary Key). A Non-Clustered Index is a separate secondary structure stored away from table rows; its leaf nodes contain the indexed column values along with pointers (row IDs or clustered keys) back to the actual data. Relational databases use B+ Trees because all data pointers/rows reside exclusively in the leaf nodes, while internal nodes store only routing keys. Most importantly, leaf nodes are linked sequentially via a doubly linked list. For range queries (e.g., `WHERE created_at BETWEEN X AND Y`), the engine traverses the tree in O(log N) to locate the first value, and then performs sequential linear disk I/O across linked leaves without repeatedly traversing the tree.",
  },
  {
    id: "q-db-2",
    topic: "dbms",
    category: "technical",
    difficulty: "medium",
    question:
      "What are the ACID properties in database transactions? Explain how transaction isolation levels prevent Dirty Reads and Phantom Reads.",
    contextHint: "Atomicity, Consistency, Isolation, Durability. Read Committed, Repeatable Read, Serializable.",
    keyCriteria: [
      "Defines Atomicity (all-or-nothing), Consistency (integrity constraints), Isolation (concurrent safety), and Durability (persistence on disk).",
      "Defines Dirty Read (reading uncommitted data) and how Read Committed prevents it.",
      "Defines Phantom Read (new rows appearing in range query) and how Serializable / Repeatable Read (with Next-Key locks in InnoDB) prevents it.",
    ],
    modelAnswer:
      "ACID guarantees reliable transactions: Atomicity ensures all operations succeed or none do (all-or-nothing rollback); Consistency maintains schema constraints and invariants before and after commit; Isolation ensures concurrently executing transactions do not interfere; and Durability ensures committed changes survive server crashes via Write-Ahead Logging (WAL). To control concurrency trade-offs, SQL defines 4 isolation levels: Read Uncommitted allows 'Dirty Reads' (reading changes made by uncommitted transactions that might roll back). 'Read Committed' prevents dirty reads by reading only committed data. 'Repeatable Read' prevents Non-Repeatable Reads by ensuring re-reading the same row returns identical data. 'Serializable' prevents 'Phantom Reads' (where a concurrent transaction inserts new matching rows into a range query) using range locks or Multi-Version Concurrency Control (MVCC) with Next-Key locking in engines like MySQL InnoDB.",
  },
  {
    id: "q-db-3",
    topic: "dbms",
    category: "technical",
    difficulty: "hard",
    question:
      "When would you choose database normalization up to 3NF versus intentional denormalization in high-throughput read-heavy applications?",
    contextHint: "Think about write consistency vs read latency, table joins, caching, and data redundancy.",
    keyCriteria: [
      "Normalization up to 3NF eliminates data redundancy and prevents update/insert anomalies (ideal for write-heavy OLTP).",
      "Normalization requires multi-table JOINs which degrade performance at high read scale.",
      "Denormalization deliberately stores redundant calculated fields (e.g., user_order_count) to enable fast single-table lookups.",
      "Acknowledges trade-off: denormalization requires handling application-level consistency or async sync mechanisms.",
    ],
    modelAnswer:
      "Database Normalization up to Third Normal Form (3NF) is chosen when data integrity, consistency, and efficient writes are paramount (such as financial ledgers or transactional banking). 3NF eliminates redundant data and guarantees that non-key attributes depend solely on primary keys, preventing update and delete anomalies. However, at large scale, 3NF requires expensive multi-table JOIN operations that severely degrade read latency. In high-throughput, read-heavy applications (e.g., e-commerce product catalogs or social feeds with 99:1 read-to-write ratios), we introduce intentional Denormalization. By pre-aggregating metrics (like storing `total_review_count` directly on the `products` table) or embedding relational entities, we allow single-table primary-key lookups in sub-10ms without JOINs. The trade-off is that the application must carefully manage write-time consistency, often using database triggers or asynchronous message queues.",
  },

  // ===================== TECHNICAL: ML =====================
  {
    id: "q-ml-1",
    topic: "ml",
    category: "technical",
    difficulty: "medium",
    question:
      "Explain the Bias-Variance tradeoff in machine learning. How do L1/L2 regularization, dropout, and cross-validation help mitigate overfitting?",
    contextHint: "High bias = underfitting, high variance = overfitting. Shrinkage penalties, co-adaptation, k-fold generalization.",
    keyCriteria: [
      "Defines Bias as error from erroneous model assumptions (underfitting) and Variance as sensitivity to training fluctuations (overfitting).",
      "Explains L1 (Lasso) drives weights to absolute zero (feature selection) while L2 (Ridge) penalizes squared weights (shrinks magnitudes).",
      "Explains Dropout randomly zeroes neuron activations during training to prevent feature co-adaptation.",
      "Explains K-Fold Cross-Validation ensures models generalize well across out-of-sample test splits.",
    ],
    modelAnswer:
      "The Bias-Variance tradeoff describes the balance between two sources of error in predictive modeling. High Bias occurs when an oversimplified model fails to capture true data relationships (underfitting), causing high error on both training and test data. High Variance occurs when a model is overly complex and memorizes noise in the training set (overfitting), achieving low training error but generalizing poorly to unseen data. To mitigate high variance and overfitting: L1 regularization (Lasso) adds an absolute weight penalty ($|w|$), driving less important parameters to zero for sparse feature selection; L2 regularization (Ridge) adds a squared weight penalty ($w^2$), penalizing large coefficients and distributing weight smoothly; Dropout randomly deactivates a fraction of neurons during each training forward pass, forcing the network to learn robust, redundant representations without co-adapting; and K-Fold Cross-Validation splits data into K subsets to validate performance across multiple out-of-sample partitions, ensuring reliable generalization.",
  },
  {
    id: "q-ml-2",
    topic: "ml",
    category: "technical",
    difficulty: "medium",
    question:
      "How does backpropagation work in deep neural networks, and how do activation functions like ReLU address the vanishing gradient problem compared to Sigmoid?",
    contextHint: "Chain rule of calculus, loss gradients, derivative saturation, dying ReLU.",
    keyCriteria: [
      "Explains Backpropagation uses the chain rule to propagate loss gradients backwards from output to input layers.",
      "Explains Sigmoid/Tanh derivative saturates near 0 and 1 (max derivative 0.25), causing repeated multiplication of small numbers that vanishes gradients in deep layers.",
      "Explains ReLU ($f(x) = \\max(0, x)$) has constant derivative of 1 for all positive inputs, allowing uninterrupted gradient flow.",
    ],
    modelAnswer:
      "Backpropagation is an algorithm for training neural networks that computes the partial derivative of the loss function with respect to every weight parameter using the chain rule of calculus. Gradients flow backwards from the output layer through hidden layers to update weights via gradient descent. Traditional activation functions like Sigmoid ($\sigma(x) = \\frac{1}{1+e^{-x}}$) have derivatives that saturate to near-zero for large positive or negative inputs (with maximum derivative of only 0.25). In deep architectures with dozens of layers, multiplying these fractions repeatedly during backpropagation causes gradients to exponentially decay toward zero (the Vanishing Gradient problem), halting learning in early layers. The Rectified Linear Unit (ReLU), defined as $f(x) = \\max(0, x)$, solves this because its derivative is exactly 1 for all positive inputs. Gradients pass through active neurons without decay, enabling efficient training of very deep networks.",
  },
  {
    id: "q-ml-3",
    topic: "ml",
    category: "technical",
    difficulty: "hard",
    question:
      "Explain the Multi-Head Self-Attention mechanism in Transformer architectures. How does it overcome the sequential bottleneck of RNNs and LSTMs?",
    contextHint: "Query, Key, Value matrices, scaled dot-product attention, parallelization, O(1) path length.",
    keyCriteria: [
      "Explains Query (Q), Key (K), and Value (V) projections.",
      "Formulates Scaled Dot-Product: $\\text{Softmax}(\\frac{QK^T}{\\sqrt{d_k}})V$.",
      "Explains Multi-Head allows the model to jointly attend to information from different representation subspaces (e.g. grammar vs semantics).",
      "Contrasts with RNNs: RNNs process tokens sequentially (O(N) sequential steps, memory vanishing), whereas Transformers process all tokens concurrently with GPU parallelism.",
    ],
    modelAnswer:
      "Multi-Head Self-Attention allows every token in an input sequence to dynamically compute relevance weights against every other token in the sequence. Each input token is projected into three vectors: Query ($Q$), Key ($K$), and Value ($V$). In Scaled Dot-Product Attention, we compute similarity scores by taking the matrix product of Queries and transposed Keys, divide by $\\sqrt{d_k}$ to prevent gradient vanishing during softmax saturation, and apply Softmax to get an attention distribution over Values: $\\text{Attention}(Q, K, V) = \\text{softmax}(\\frac{QK^T}{\\sqrt{d_k}})V$. In Multi-Head attention, we project $Q, K, V$ into multiple lower-dimensional subspaces, allowing the model to simultaneously attend to diverse relational signals (such as syntax, co-reference, and semantic context). This overcomes the core bottleneck of RNNs/LSTMs: recurrent networks require sequential token-by-token processing ($O(N)$ sequential execution time) and struggle with long-range dependencies. Transformers compute self-attention for all tokens in parallel using matrix multiplication on GPUs, reducing the maximum path length between any two tokens to $O(1)$.",
  },

  // ===================== BEHAVIORAL: TELL ME ABOUT YOURSELF =====================
  {
    id: "q-beh-intro",
    topic: "intro",
    category: "behavioral",
    difficulty: "easy",
    question:
      "Tell me about yourself, your technical journey in computer science, and why you are excited about this software engineering role.",
    contextHint: "Structure using Present-Past-Future framework: current status, technical achievements, and alignment with target role.",
    keyCriteria: [
      "Concise 2-minute elevator pitch using Present-Past-Future structure.",
      "Highlights academic profile (B.Tech CS, CGPA) and core technical focus (Python, AI/ML or Full-Stack).",
      "Mentions specific hands-on project accomplishments with metrics.",
      "Concludes with genuine passion and alignment for the company's engineering mission.",
    ],
    modelAnswer:
      "I'm currently in my final year of Computer Science Engineering with an 8.7 CGPA, focusing on scalable backend systems and machine learning. Over the past three years, my technical passion has centered on building reliable software that bridges frontier AI models with low-latency APIs. Most recently, I built an end-to-end AI career copilot that parses resumes using custom NLP models and evaluates job match suitability against 1,000+ job descriptions in under 200ms. Prior to that, I interned on a web platform where I designed normalized PostgreSQL schemas and Next.js interfaces that improved page load speed by 35%. I am really excited about this role because your engineering team tackles massive real-time distributed data problems with high reliability standards, and I am eager to bring my strong Python foundations, algorithmic rigor, and product velocity to your team.",
  },

  // ===================== BEHAVIORAL: STRENGTHS / WEAKNESSES =====================
  {
    id: "q-beh-sw",
    topic: "strengths_weaknesses",
    category: "behavioral",
    difficulty: "medium",
    question:
      "What do you consider your greatest technical strength, and what is one real weakness you've identified and are actively working to improve?",
    contextHint: "Give a concrete technical strength with evidence; pick an authentic weakness and demonstrate proactive remediation.",
    keyCriteria: [
      "Selects a genuine strength supported by concrete project examples (e.g. debugging, deep Python fundamentals, algorithmic reasoning).",
      "Chooses a real, authentic weakness (e.g. initial hesitation to delegate, container orchestration depth) rather than a fake weakness ('I work too hard').",
      "Explains active steps taken to improve (e.g., courses, building sample Docker clusters, contributing to team retrospectives).",
    ],
    modelAnswer:
      "My greatest technical strength is my depth in problem decomposition and algorithmic debugging in Python. When faced with complex system issues—such as memory bottlenecks or unexpected latency spikes—I systematically isolate components, profile execution times, and inspect underlying data structures rather than relying on guesswork. For example, during a project with slow database joins, I profiled query plans and identified missing composite indexes, reducing query time by 42%. One real weakness I identified earlier this year was my limited practical experience with production containerization and cloud orchestration (Docker and Kubernetes). Rather than accepting this gap, I enrolled in a hands-on microservices track, containerized my recent FastAPI recommendation service, and set up automated GitHub Actions CI/CD pipelines to build and test Docker images on every pull request.",
  },

  // ===================== BEHAVIORAL: LEADERSHIP =====================
  {
    id: "q-beh-lead",
    topic: "leadership",
    category: "behavioral",
    difficulty: "medium",
    question:
      "Describe a situation where you took leadership or technical initiative on a project. How did you guide your team through tight deadlines or technical uncertainty?",
    contextHint: "Use the STAR method: Situation, Task, Action, Result. Highlight ownership and collaborative decision making.",
    keyCriteria: [
      "Follows clear STAR method (Situation, Task, Action, Result).",
      "Demonstrates proactive technical leadership and task delegation.",
      "Explains how technical ambiguity or conflicting viewpoints were navigated objectively.",
      "Quantifies the final outcome and team achievement.",
    ],
    modelAnswer:
      "During our college hackathon last semester, our 4-person team had 36 hours to build a functional multi-modal document analysis platform for academic research (Situation). Midway through day one, our team was divided: two members wanted to build a complex custom transformer model from scratch, while others wanted to focus on UI polish, risking not having a working backend before the submission deadline (Task). I stepped up as technical lead and facilitated a quick 15-minute alignment sync. I proposed using pre-trained Hugging Face transformer embeddings combined with a lightweight FAISS vector store—this allowed us to achieve high semantic retrieval accuracy without spending 12 hours on model training. I then mapped out clean API contracts between frontend and backend so teammates could work in parallel without blocking each other (Action). As a result, our team completed our end-to-end working prototype 4 hours ahead of schedule and won 2nd place out of 45 teams (Result).",
  },

  // ===================== BEHAVIORAL: CONFLICT =====================
  {
    id: "q-beh-conf",
    topic: "conflict",
    category: "behavioral",
    difficulty: "hard",
    question:
      "Tell me about a time you had a technical disagreement with a peer or teammate over an architectural choice or deadline. How did you resolve it?",
    contextHint: "Focus on constructive empathy, evaluating tradeoffs with benchmarks/data, and maintaining strong team camaraderie.",
    keyCriteria: [
      "Identifies a concrete technical disagreement (e.g. database choice, framework, API design).",
      "Emphasizes professional, respectful communication without personal ego.",
      "Uses data, benchmarking, or proof-of-concept testing to drive the objective resolution.",
      "Highlights successful team consensus and positive project outcome.",
    ],
    modelAnswer:
      "During our capstone engineering project, my teammate and I disagreed on the database architecture for our real-time order matching service. My peer advocated for MongoDB for its flexible schema and rapid prototyping, while I argued for PostgreSQL because our domain involved financial balance deductions that strictly required ACID transactions and relational constraints to avoid double-spending bugs. Instead of debating theoretically, I suggested we build a small proof-of-concept benchmark: we simulated 50 concurrent transactions with simulated network delays on both databases. The benchmark clearly demonstrated that without distributed transaction locks, our MongoDB prototype encountered duplicate balance deduction anomalies under race conditions, whereas PostgreSQL's serializable isolation level handled it cleanly. Seeing the empirical test results, my teammate agreed with PostgreSQL, and in turn, I adopted his suggestion to use JSONB columns for flexible product metadata. We delivered the project with zero data integrity bugs and maintained great mutual trust.",
  },
];

export const INITIAL_INTERVIEW_REPORT: InterviewReportData = {
  sessionId: "session-tech-py-88",
  completedAt: "Completed Today • 11:58 PM",
  targetRole: "AI/ML Engineer",
  companyType: "Tier-1 Tech (Stripe / Swiggy)",
  category: "technical",
  topic: "Python & Machine Learning Foundations",
  difficulty: "medium",
  overallScore: 84,
  dimensionAverages: {
    accuracy: 86,
    relevance: 88,
    clarity: 82,
    structure: 80,
    confidence: 78,
    technicalDepth: 90,
  },
  strongAreas: [
    "Deep conceptual mastery of Python Global Interpreter Lock (GIL) and process-level parallelism",
    "Precise formulation of Scaled Dot-Product Attention in Transformer architectures",
    "Effective application of Big-O time and space complexity reasoning",
  ],
  weakAreas: [
    "Hesitation when quantifying spatial complexity for recursive tree traversals",
    "Slightly passive phrasing when articulating architectural leadership decisions",
  ],
  questionsAnswered: [
    {
      ...INTERVIEW_QUESTIONS_BANK[0],
      studentAnswer:
        "The GIL in Python prevents threads from executing bytecode at the same time. For I/O tasks it is fine because threads sleep while waiting for network data. For CPU tasks it slows things down, so we use multiprocessing to spawn separate processes.",
      evaluation: {
        dimensions: {
          accuracy: 88,
          relevance: 90,
          clarity: 85,
          structure: 82,
          confidence: 80,
          technicalDepth: 92,
        },
        overallScore: 86,
        feedback: "Strong core understanding! Great explanation of I/O release vs CPU contention.",
        strongPoints: ["Accurate explanation of GIL behavior", "Correctly recommended multiprocessing for CPU tasks"],
        improvementPoints: ["Mention C-extensions like NumPy that release the GIL during matrix computations."],
      },
    },
    {
      ...INTERVIEW_QUESTIONS_BANK[3],
      studentAnswer:
        "We can use a hash map with prefix sums. As we loop, we check if prefix_sum - K is in our map. If so, that subarray sums to K.",
      evaluation: {
        dimensions: {
          accuracy: 84,
          relevance: 86,
          clarity: 78,
          structure: 76,
          confidence: 75,
          technicalDepth: 88,
        },
        overallScore: 81,
        feedback: "Good algorithmic logic! Remember to explicitly state why we store only the earliest index to maximize length.",
        strongPoints: ["O(N) prefix sum hash map approach"],
        improvementPoints: ["Explicitly state Big-O space complexity and handle edge case where prefix_sum == K directly."],
      },
    },
  ],
  weakestQuestion: {
    ...INTERVIEW_QUESTIONS_BANK[3],
    studentAnswer:
      "We can use a hash map with prefix sums. As we loop, we check if prefix_sum - K is in our map. If so, that subarray sums to K.",
    evaluation: {
      dimensions: {
        accuracy: 84,
        relevance: 86,
        clarity: 78,
        structure: 76,
        confidence: 75,
        technicalDepth: 88,
      },
      overallScore: 81,
      feedback: "Good algorithmic logic! Remember to explicitly state why we store only the earliest index to maximize length.",
      strongPoints: ["O(N) prefix sum hash map approach"],
      improvementPoints: ["Explicitly state Big-O space complexity and handle edge case where prefix_sum == K directly."],
    },
  },
  improvementSuggestions: [
    "Always state both Time (O(N)) and Auxiliary Space (O(N)) complexity explicitly before starting code walkthroughs.",
    "Structure behavioral answers using the STAR method: explicitly signpost 'The Situation was...', 'My Task was...', 'The Action I took was...', and 'The Result was...'.",
    "Replace passive phrases ('I think it might work') with decisive technical ownership ('The optimal approach is...').",
  ],
  progressBoost: 4,
};
