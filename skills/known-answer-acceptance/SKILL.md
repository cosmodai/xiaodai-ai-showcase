---
name: known-answer-acceptance
description: Create and run deterministic known-answer cases before trusting changes to calculations, including boundary cases and a deliberate fault check.
---

# Known-Answer Acceptance / 已知答案验收

1. Choose a small deterministic fixture with inputs and expected outputs calculated independently from the implementation.
2. Include a normal case, an exact boundary and an empty or invalid case. Specify units, rounding and missing-value behavior.
3. Run the same fixtures against the candidate. Record expected, actual and pass/fail per case. Prove that a deliberate representative defect fails the suite.
4. Keep the fixed fixture with the workflow and rerun it on future changes. Passing these fixtures supports the covered behavior.

## Known answer / 可核对样例

Count durations strictly above 60 minutes. For [40, 61] expect 1, for [40, 60, 61] expect 1, and for [] expect 0. A faulty greater-than-or-equal implementation returns 2 for the boundary case. The correct implementation passes all three.

预期值独立手算，覆盖正常、边界和空输入。用故障版本验证测试确实能抓到问题。
