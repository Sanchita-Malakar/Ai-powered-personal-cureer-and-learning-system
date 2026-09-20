import {
  DsaProblem,
  DsaUserStats,
  DsaCategory,
} from "@/types/dsa";

export const DSA_CATEGORIES: DsaCategory[] = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Stack",
  "Queue",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Algorithms",
];

export const DSA_PROBLEMS: DsaProblem[] = [
  // ===================== 1. ARRAYS =====================
  {
    id: "dsa-arr-two-sum",
    title: "Two Sum",
    category: "Arrays",
    difficulty: "Easy",
    acceptanceRate: "52.4%",
    companies: ["Google", "Amazon", "Apple", "Meta"],
    problemStatement:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "nums[1] + nums[2] == 6, so indices 1 and 2.",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    pass`,
      javascript: `function twoSum(nums, target) {
  // Write your solution here
}`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`,
      java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`,
    },
    solutionCode: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      javascript: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
      cpp: `// C++ Solution
// Use unordered_map for O(1) lookup`,
      java: `// Java Solution
// Use HashMap<Integer, Integer> for O(1) lookup`,
    },
    testCases: [
      { id: "tc-1", input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]" },
      { id: "tc-2", input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]" },
      { id: "tc-3", input: "nums = [3,3], target = 6", expectedOutput: "[0,1]" },
    ],
    hints: [
      "A brute force approach would search all pairs in O(N^2) time.",
      "Can we use auxiliary memory like a Hash Map to look up complements in O(1)?",
      "Store each element's value and index into the map as you iterate.",
    ],
    optimalApproach: "Single pass Hash Map caching previously seen numbers. Time: O(N), Space: O(N).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
  },
  {
    id: "dsa-arr-subarray-k",
    title: "Subarray Sum Equals K",
    category: "Arrays",
    difficulty: "Medium",
    acceptanceRate: "44.1%",
    companies: ["Meta", "Amazon", "Microsoft", "Stripe"],
    problemStatement:
      "Given an array of integers `nums` and an integer `k`, return the total number of continuous subarrays whose sum equals to `k`.",
    examples: [
      {
        input: "nums = [1,1,1], k = 2",
        output: "2",
        explanation: "Subarrays [nums[0..1]] and [nums[1..2]] each sum to 2.",
      },
      {
        input: "nums = [1,2,3], k = 3",
        output: "2",
        explanation: "[1,2] and [3] sum to 3.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 2 * 10^4",
      "-1000 <= nums[i] <= 1000",
      "-10^7 <= k <= 10^7",
    ],
    starterCode: {
      python: `def subarraySum(nums: list[int], k: int) -> int:
    # Write your solution here
    pass`,
      javascript: `function subarraySum(nums, k) {
  // Write your solution here
}`,
      cpp: `class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        return 0;
    }
};`,
      java: `class Solution {
    public int subarraySum(int[] nums, int k) {
        return 0;
    }
}`,
    },
    solutionCode: {
      python: `def subarraySum(nums: list[int], k: int) -> int:
    count = 0
    prefix_sum = 0
    prefix_counts = {0: 1}
    for num in nums:
        prefix_sum += num
        diff = prefix_sum - k
        count += prefix_counts.get(diff, 0)
        prefix_counts[prefix_sum] = prefix_counts.get(prefix_sum, 0) + 1
    return count`,
      javascript: `function subarraySum(nums, k) {
  let count = 0;
  let prefixSum = 0;
  const prefixMap = new Map();
  prefixMap.set(0, 1);
  for (const num of nums) {
    prefixSum += num;
    if (prefixMap.has(prefixSum - k)) {
      count += prefixMap.get(prefixSum - k);
    }
    prefixMap.set(prefixSum, (prefixMap.get(prefixSum) || 0) + 1);
  }
  return count;
}`,
      cpp: ``,
      java: ``,
    },
    testCases: [
      { id: "tc-1", input: "nums = [1,1,1], k = 2", expectedOutput: "2" },
      { id: "tc-2", input: "nums = [1,2,3], k = 3", expectedOutput: "2" },
      { id: "tc-3", input: "nums = [1,-1,0], k = 0", expectedOutput: "3" },
    ],
    hints: [
      "Prefix Sum allows finding any range sum in O(1).",
      "If prefix_sum[j] - prefix_sum[i] == k, the subarray between i and j sums to k.",
      "Store frequency of prefix sums in a hash table initialized with {0: 1}.",
    ],
    optimalApproach: "Prefix Sum combined with Hash Map frequencies. Time: O(N), Space: O(N).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
  },
  {
    id: "dsa-arr-max-subarray",
    title: "Maximum Subarray (Kadane's)",
    category: "Arrays",
    difficulty: "Medium",
    acceptanceRate: "50.8%",
    companies: ["Microsoft", "Amazon", "LinkedIn", "Apple"],
    problemStatement:
      "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "Single element array.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
    ],
    starterCode: {
      python: `def maxSubArray(nums: list[int]) -> int:
    # Write your solution here
    pass`,
      javascript: `function maxSubArray(nums) {
  // Write your solution here
}`,
      cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        return 0;
    }
};`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        return 0;
    }
}`,
    },
    solutionCode: {
      python: `def maxSubArray(nums: list[int]) -> int:
    max_so_far = nums[0]
    current_max = nums[0]
    for num in nums[1:]:
        current_max = max(num, current_max + num)
        max_so_far = max(max_so_far, current_max)
    return max_so_far`,
      javascript: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let currentMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currentMax);
  }
  return maxSoFar;
}`,
      cpp: ``,
      java: ``,
    },
    testCases: [
      { id: "tc-1", input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
      { id: "tc-2", input: "nums = [1]", expectedOutput: "1" },
      { id: "tc-3", input: "nums = [5,4,-1,7,8]", expectedOutput: "23" },
    ],
    hints: [
      "Consider dynamic programming: at each index, decide whether to append to current subarray or start fresh.",
      "If current running sum becomes negative, it's never optimal to carry it forward.",
    ],
    optimalApproach: "Kadane's Algorithm. Time: O(N), Space: O(1).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
  },

  // ===================== 2. STRINGS =====================
  {
    id: "dsa-str-longest-sub",
    title: "Longest Substring Without Repeating Characters",
    category: "Strings",
    difficulty: "Medium",
    acceptanceRate: "34.6%",
    companies: ["Amazon", "Google", "Bloomberg", "Adobe"],
    problemStatement:
      "Given a string `s`, find the length of the longest substring without duplicate characters.",
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.',
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    starterCode: {
      python: `def lengthOfLongestSubstring(s: str) -> int:
    # Write your solution here
    pass`,
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your solution here
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        return 0;
    }
};`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        return 0;
    }
}`,
    },
    solutionCode: {
      python: `def lengthOfLongestSubstring(s: str) -> int:
    char_map = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      javascript: `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let left = 0;
  let maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      cpp: ``,
      java: ``,
    },
    testCases: [
      { id: "tc-1", input: 's = "abcabcbb"', expectedOutput: "3" },
      { id: "tc-2", input: 's = "bbbbb"', expectedOutput: "1" },
      { id: "tc-3", input: 's = "pwwkew"', expectedOutput: "3" },
    ],
    hints: [
      "Use a sliding window [left, right].",
      "Use a hash map to store the last seen position of each character.",
      "When a duplicate is encountered, fast-forward the left pointer to last_pos + 1.",
    ],
    optimalApproach: "Sliding Window with Hash Map index caching. Time: O(N), Space: O(min(N, M)).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(min(N, M))",
  },
  {
    id: "dsa-str-group-anagrams",
    title: "Group Anagrams",
    category: "Strings",
    difficulty: "Medium",
    acceptanceRate: "67.8%",
    companies: ["Amazon", "Uber", "Affirm", "Goldman Sachs"],
    problemStatement:
      "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: "All grouped anagram strings contain exact same frequency of characters.",
      },
    ],
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters.",
    ],
    starterCode: {
      python: `def groupAnagrams(strs: list[str]) -> list[list[str]]:
    # Write your solution here
    pass`,
      javascript: `function groupAnagrams(strs) {
  // Write your solution here
}`,
      cpp: `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        return {};
    }
};`,
      java: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        return new ArrayList<>();
    }
}`,
    },
    solutionCode: {
      python: `from collections import defaultdict

def groupAnagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for word in strs:
        key = tuple(sorted(word))
        groups[key].append(word)
    return list(groups.values())`,
      javascript: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return Array.from(map.values());
}`,
      cpp: ``,
      java: ``,
    },
    testCases: [
      { id: "tc-1", input: 'strs = ["eat","tea","tan","ate","nat","bat"]', expectedOutput: "3 groups" },
      { id: "tc-2", input: 'strs = [""]', expectedOutput: '[[""]]' },
    ],
    hints: [
      "Two strings are anagrams if and only if their sorted representations are identical.",
      "You can also use a 26-character frequency count tuple as a hash map key for O(N * K) time.",
    ],
    optimalApproach: "Character frequency hashing or sorting. Time: O(N * K log K), Space: O(N * K).",
    timeComplexity: "O(N * K log K)",
    spaceComplexity: "O(N * K)",
  },

  // ===================== 3. LINKED LISTS =====================
  {
    id: "dsa-ll-reverse",
    title: "Reverse Linked List",
    category: "Linked Lists",
    difficulty: "Easy",
    acceptanceRate: "75.2%",
    companies: ["Microsoft", "Google", "Amazon", "Cisco"],
    problemStatement:
      "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "The pointers between all consecutive nodes are inverted.",
      },
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000",
    ],
    starterCode: {
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def reverseList(head):
    # Write your solution here
    pass`,
      javascript: `function reverseList(head) {
  // Write your solution here
}`,
      cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        return nullptr;
    }
};`,
      java: `class Solution {
    public ListNode reverseList(ListNode head) {
        return null;
    }
}`,
    },
    solutionCode: {
      python: `def reverseList(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
      javascript: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
      cpp: ``,
      java: ``,
    },
    testCases: [
      { id: "tc-1", input: "head = [1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]" },
      { id: "tc-2", input: "head = [1,2]", expectedOutput: "[2,1]" },
    ],
    hints: [
      "Maintain three pointers: prev, curr, and next.",
      "At each step, point curr.next to prev, then advance prev and curr forward.",
    ],
    optimalApproach: "Iterative in-place pointer reversal. Time: O(N), Space: O(1).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
  },

  // ===================== 4. STACK =====================
  {
    id: "dsa-stk-valid-parens",
    title: "Valid Parentheses",
    category: "Stack",
    difficulty: "Easy",
    acceptanceRate: "41.2%",
    companies: ["Amazon", "LinkedIn", "Salesforce", "DoorDash"],
    problemStatement:
      "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.",
    examples: [
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "Every opening bracket is matched by an immediate corresponding closing bracket.",
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation: "Mismatched bracket types.",
      },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    starterCode: {
      python: `def isValid(s: str) -> bool:
    # Write your solution here
    pass`,
      javascript: `function isValid(s) {
  // Write your solution here
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        return false;
    }
};`,
      java: `class Solution {
    public boolean isValid(String s) {
        return false;
    }
}`,
    },
    solutionCode: {
      python: `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack`,
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (map[char]) {
      const top = stack.pop() || '#';
      if (top !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      cpp: ``,
      java: ``,
    },
    testCases: [
      { id: "tc-1", input: 's = "()"', expectedOutput: "true" },
      { id: "tc-2", input: 's = "()[]{}"', expectedOutput: "true" },
      { id: "tc-3", input: 's = "(]"', expectedOutput: "false" },
    ],
    hints: [
      "A stack operates with Last-In-First-Out (LIFO), perfect for nested pairs.",
      "Push opening brackets to stack; for closing brackets, pop and verify match.",
    ],
    optimalApproach: "LIFO Stack. Time: O(N), Space: O(N).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
  },

  // ===================== 5. QUEUE =====================
  {
    id: "dsa-que-queue-stacks",
    title: "Implement Queue using Stacks",
    category: "Queue",
    difficulty: "Easy",
    acceptanceRate: "65.7%",
    companies: ["Microsoft", "Goldman Sachs", "Amazon"],
    problemStatement:
      "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support `push`, `peek`, `pop`, and `empty` operations, all in amortized O(1) time.",
    examples: [
      {
        input: '["MyQueue", "push", "push", "peek", "pop", "empty"]\n[[], [1], [2], [], [], []]',
        output: "[null, null, null, 1, 1, false]",
        explanation: "1 was pushed first, so peek() and pop() return 1.",
      },
    ],
    constraints: [
      "1 <= x <= 9",
      "At most 100 calls will be made to push, pop, peek, and empty.",
    ],
    starterCode: {
      python: `class MyQueue:
    def __init__(self):
        # Initialize your stacks here
        pass

    def push(self, x: int) -> None:
        pass

    def pop(self) -> int:
        pass

    def peek(self) -> int:
        pass

    def empty(self) -> bool:
        pass`,
      javascript: `class MyQueue {
  constructor() {
    this.inStack = [];
    this.outStack = [];
  }
  push(x) {}
  pop() {}
  peek() {}
  empty() {}
}`,
      cpp: `class MyQueue {
public:
    MyQueue() {}
    void push(int x) {}
    int pop() { return 0; }
    int peek() { return 0; }
    bool empty() { return true; }
};`,
      java: `class MyQueue {
    public MyQueue() {}
    public void push(int x) {}
    public int pop() { return 0; }
    public int peek() { return 0; }
    public boolean empty() { return true; }
}`,
    },
    solutionCode: {
      python: `class MyQueue:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []

    def push(self, x: int) -> None:
        self.in_stack.append(x)

    def pop(self) -> int:
        self.peek()
        return self.out_stack.pop()

    def peek(self) -> int:
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())
        return self.out_stack[-1]

    def empty(self) -> bool:
        return not self.in_stack and not self.out_stack`,
      javascript: `class MyQueue {
  constructor() {
    this.inStack = [];
    this.outStack = [];
  }
  push(x) {
    this.inStack.push(x);
  }
  pop() {
    this.peek();
    return this.outStack.pop();
  }
  peek() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) {
        this.outStack.push(this.inStack.pop());
      }
    }
    return this.outStack[this.outStack.length - 1];
  }
  empty() {
    return this.inStack.length === 0 && this.outStack.length === 0;
  }
}`,
      cpp: ``,
      java: ``,
    },
    testCases: [
      { id: "tc-1", input: "push(1), push(2), peek()", expectedOutput: "1" },
      { id: "tc-2", input: "pop(), empty()", expectedOutput: "false" },
    ],
    hints: [
      "Use two stacks: one for pushing (inStack) and one for popping (outStack).",
      "Transfer elements from inStack to outStack only when outStack is empty.",
      "Each element is pushed and popped at most twice, yielding amortized O(1).",
    ],
    optimalApproach: "Two Stacks with lazy amortized transfer. Time: O(1) amortized, Space: O(N).",
    timeComplexity: "O(1) amortized",
    spaceComplexity: "O(N)",
  },

  // ===================== 6. TREES (WEAK AREA 43%) =====================
  {
    id: "dsa-tree-level-order",
    title: "Binary Tree Level Order Traversal",
    category: "Trees",
    difficulty: "Medium",
    acceptanceRate: "66.4%",
    companies: ["Amazon", "Microsoft", "Meta", "LinkedIn"],
    problemStatement:
      "Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
        explanation: "Level 0 has node 3, Level 1 has 9 and 20, Level 2 has 15 and 7.",
      },
      {
        input: "root = [1]",
        output: "[[1]]",
        explanation: "Single node tree.",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000",
    ],
    starterCode: {
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def levelOrder(root) -> list[list[int]]:
    # Write your solution here
    pass`,
      javascript: `function levelOrder(root) {
  // Write your solution here
}`,
      cpp: `class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        return {};
    }
};`,
      java: `class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        return new ArrayList<>();
    }
}`,
    },
    solutionCode: {
      python: `from collections import deque

def levelOrder(root) -> list[list[int]]:
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)
        level_vals = []
        for _ in range(level_size):
            node = queue.popleft()
            level_vals.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level_vals)
    return result`,
      javascript: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}`,
      cpp: ``,
      java: ``,
    },
    testCases: [
      { id: "tc-1", input: "root = [3,9,20,null,null,15,7]", expectedOutput: "[[3],[9,20],[15,7]]" },
      { id: "tc-2", input: "root = [1]", expectedOutput: "[[1]]" },
      { id: "tc-3", input: "root = []", expectedOutput: "[]" },
    ],
    hints: [
      "Level order traversal represents Breadth-First Search (BFS).",
      "Use a queue to process nodes level by level.",
      "At the start of each while iteration, capture `len(queue)` to iterate strictly over all nodes belonging to the current depth level.",
    ],
    optimalApproach: "BFS with queue snapshotting level length. Time: O(N), Space: O(W) where W is maximum width.",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
  },
  {
    id: "dsa-tree-invert",
    title: "Invert Binary Tree",
    category: "Trees",
    difficulty: "Easy",
    acceptanceRate: "77.1%",
    companies: ["Google", "Amazon", "Twitter", "Apple"],
    problemStatement:
      "Given the `root` of a binary tree, invert the tree, and return its root. (Swap the left and right subtrees recursively).",
    examples: [
      {
        input: "root = [4,2,7,1,3,6,9]",
        output: "[4,7,2,9,6,3,1]",
        explanation: "Every node's left and right pointers are swapped.",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100",
    ],
    starterCode: {
      python: `def invertTree(root):
    # Write your solution here
    pass`,
      javascript: `function invertTree(root) {
  // Write your solution here
}`,
      cpp: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        return nullptr;
    }
};`,
      java: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        return null;
    }
}`,
    },
    solutionCode: {
      python: `def invertTree(root):
    if not root:
        return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root`,
      javascript: `function invertTree(root) {
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
      cpp: ``,
      java: ``,
    },
    testCases: [
      { id: "tc-1", input: "root = [4,2,7,1,3,6,9]", expectedOutput: "[4,7,2,9,6,3,1]" },
      { id: "tc-2", input: "root = [2,1,3]", expectedOutput: "[2,3,1]" },
    ],
    hints: [
      "Base case: if root is null, return null.",
      "Recursively invert the left and right subtrees, then swap the pointers.",
    ],
    optimalApproach: "Recursive Post-Order DFS or BFS traversal. Time: O(N), Space: O(H).",
    timeComplexity: "O(N)",
    spaceComplexity: "O(H)",
  },

  // ===================== 7. GRAPHS =====================
  {
    id: "dsa-grp-num-islands",
    title: "Number of Islands",
    category: "Graphs",
    difficulty: "Medium",
    acceptanceRate: "59.2%",
    companies: ["Amazon", "Google", "Bloomberg", "Uber"],
    problemStatement:
      "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
    examples: [
      {
        input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
        output: "1",
        explanation: "All 1s form a single contiguous island.",
      },
    ],
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'.",
    ],
    starterCode: {
      python: `def numIslands(grid: list[list[str]]) -> int:
    # Write your solution here
    pass`,
      javascript: `function numIslands(grid) {
  // Write your solution here
}`,
      cpp: `class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        return 0;
    }
};`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        return 0;
    }
}`,
    },
    solutionCode: {
      python: `def numIslands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    islands = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                islands += 1
                dfs(r, c)
    return islands`,
      javascript: `function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
      cpp: ``,
      java: ``,
    },
    testCases: [
      { id: "tc-1", input: "grid 4x5 with 1 island", expectedOutput: "1" },
      { id: "tc-2", input: "grid with separate disconnected 1s", expectedOutput: "3" },
    ],
    hints: [
      "Think of the 2D grid as an unweighted undirected graph.",
      "Whenever you find a '1', launch a DFS or BFS to sink all connected land to '0' to avoid re-visiting.",
    ],
    optimalApproach: "Connected Components using in-place DFS or BFS. Time: O(M * N), Space: O(M * N).",
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(M * N)",
  },

  // ===================== 8. DYNAMIC PROGRAMMING =====================
  {
    id: "dsa-dp-coin-change",
    title: "Coin Change",
    category: "Dynamic Programming",
    difficulty: "Medium",
    acceptanceRate: "43.9%",
    companies: ["Amazon", "Goldman Sachs", "ByteDance", "Airbnb"],
    problemStatement:
      "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3",
        explanation: "11 = 5 + 5 + 1 (3 coins total).",
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1",
        explanation: "No combination sums to 3.",
      },
    ],
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4",
    ],
    starterCode: {
      python: `def coinChange(coins: list[int], amount: int) -> int:
    # Write your solution here
    pass`,
      javascript: `function coinChange(coins, amount) {
  // Write your solution here
}`,
      cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        return 0;
    }
};`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        return 0;
    }
}`,
    },
    solutionCode: {
      python: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const coin of coins) {
    for (let x = coin; x <= amount; x++) {
      dp[x] = Math.min(dp[x], dp[x - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      cpp: ``,
      java: ``,
    },
    testCases: [
      { id: "tc-1", input: "coins = [1,2,5], amount = 11", expectedOutput: "3" },
      { id: "tc-2", input: "coins = [2], amount = 3", expectedOutput: "-1" },
      { id: "tc-3", input: "coins = [1], amount = 0", expectedOutput: "0" },
    ],
    hints: [
      "Let dp[i] be the minimum coins needed to make amount i.",
      "The recurrence relation is dp[i] = min(dp[i], dp[i - coin] + 1) for coin <= i.",
      "Initialize dp table with infinity and dp[0] = 0.",
    ],
    optimalApproach: "Bottom-Up Unbounded Knapsack DP. Time: O(Amount * Coins.length), Space: O(Amount).",
    timeComplexity: "O(A * C)",
    spaceComplexity: "O(A)",
  },

  // ===================== 9. ALGORITHMS =====================
  {
    id: "dsa-algo-binary-search",
    title: "Binary Search",
    category: "Algorithms",
    difficulty: "Easy",
    acceptanceRate: "57.8%",
    companies: ["Apple", "Microsoft", "Amazon"],
    problemStatement:
      "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.",
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4.",
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 2",
        output: "-1",
        explanation: "2 does not exist in nums so return -1.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    starterCode: {
      python: `def search(nums: list[int], target: int) -> int:
    # Write your solution here
    pass`,
      javascript: `function search(nums, target) {
  // Write your solution here
}`,
      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        return -1;
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        return -1;
    }
}`,
    },
    solutionCode: {
      python: `def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
      javascript: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      cpp: ``,
      java: ``,
    },
    testCases: [
      { id: "tc-1", input: "nums = [-1,0,3,5,9,12], target = 9", expectedOutput: "4" },
      { id: "tc-2", input: "nums = [-1,0,3,5,9,12], target = 2", expectedOutput: "-1" },
    ],
    hints: [
      "Compare target with middle element nums[mid].",
      "Halve search space each step: if target > nums[mid], move left to mid + 1.",
    ],
    optimalApproach: "Binary Search Divide & Conquer. Time: O(log N), Space: O(1).",
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
  },
];

export const INITIAL_DSA_STATS: DsaUserStats = {
  totalSolved: 48,
  totalAttempts: 62,
  overallAccuracy: 77,
  totalTimeSpentMinutes: 380,
  difficultyCounts: {
    easy: 24,
    medium: 19,
    hard: 5,
  },
  topicMastery: {
    Arrays: {
      category: "Arrays",
      solvedCount: 14,
      totalCount: 18,
      accuracy: 85,
      avgTimeMinutes: 14,
      attemptsCount: 16,
      status: "Mastered",
    },
    Strings: {
      category: "Strings",
      solvedCount: 10,
      totalCount: 14,
      accuracy: 72,
      avgTimeMinutes: 16,
      attemptsCount: 14,
      status: "Intermediate",
    },
    "Linked Lists": {
      category: "Linked Lists",
      solvedCount: 6,
      totalCount: 8,
      accuracy: 75,
      avgTimeMinutes: 18,
      attemptsCount: 8,
      status: "Intermediate",
    },
    Stack: {
      category: "Stack",
      solvedCount: 5,
      totalCount: 6,
      accuracy: 80,
      avgTimeMinutes: 12,
      attemptsCount: 6,
      status: "Mastered",
    },
    Queue: {
      category: "Queue",
      solvedCount: 3,
      totalCount: 4,
      accuracy: 70,
      avgTimeMinutes: 15,
      attemptsCount: 4,
      status: "Intermediate",
    },
    Trees: {
      category: "Trees",
      solvedCount: 4,
      totalCount: 12,
      accuracy: 43,
      avgTimeMinutes: 28,
      attemptsCount: 9,
      status: "Weak Area",
    },
    Graphs: {
      category: "Graphs",
      solvedCount: 2,
      totalCount: 10,
      accuracy: 50,
      avgTimeMinutes: 32,
      attemptsCount: 5,
      status: "Intermediate",
    },
    "Dynamic Programming": {
      category: "Dynamic Programming",
      solvedCount: 2,
      totalCount: 10,
      accuracy: 38,
      avgTimeMinutes: 35,
      attemptsCount: 6,
      status: "Weak Area",
    },
    Algorithms: {
      category: "Algorithms",
      solvedCount: 2,
      totalCount: 4,
      accuracy: 68,
      avgTimeMinutes: 15,
      attemptsCount: 3,
      status: "Intermediate",
    },
  },
  weakAreas: ["Trees", "Dynamic Programming"],
  aiRecommendation: "Practice Tree Traversal before moving to Graph algorithms.",
  prerequisiteReasoning:
    "Your Tree accuracy is currently at 43%. Tree traversals (BFS queue level-order & DFS recursion) are critical prerequisites before mastering Graph cycle detection and topological sorting.",
  recommendedProblemId: "dsa-tree-level-order",
};
