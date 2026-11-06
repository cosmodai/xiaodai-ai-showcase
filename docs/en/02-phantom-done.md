# Note 02: Phantom completion, and letting the system decide "done"

*[中文版](../02-phantom-done.md)*

## What happened

Among Xiaodai's failure modes, phantom completion ranks second: an agent announces a task is finished, but the intended effect never happened. Typical cases:

- A promotion saves successfully, but the item is off the shelf and customers never see the offer price
- A dashboard refreshes locally while the shared page still shows the old version
- A message is "sent" but never arrives
- A report is generated from a stale cache

These are hard to spot because every step in the execution log reports success.

## Root cause

Completion was self-reported by the agent doing the work. The agent reports "I performed an action". The user cares whether "the state of the world changed". Self-reporting cannot close that gap.

A related pattern: when the model is confident about a task type, it may skip the skill template and generate from parametric memory. The output looks right, does not meet the requirements, and is still reported as done.

## Fix

1. **Define machine-checkable completion assertions for each task type.** A weekly report checks its data-through date. A promotion is read back from the customer side. A dashboard compares the version the recipient actually sees.
2. **An agent's "done" is only a request.** The task moves forward only when the assertions pass. On failure it goes back with the failed assertion attached.
3. **All external messages go through an outbox.** Each delivery carries the task ID, and the task closes only when a receipt with the same ID arrives. A failed delivery can be resent by ID without duplicates or gaps.

## Takeaway

**The definition of "done" belongs in the system, not in the judgment of whoever did the work.** The same idea runs through the read-back verification examples in the portfolio.

---

Interactive demo: [execution trace replay](https://cosmodai.github.io/xiaodai-ai-showcase/trace.html?lang=en). Turn completion assertions off and compare.
