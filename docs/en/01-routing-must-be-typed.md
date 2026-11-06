# Note 01: Routing must be a typed argument

*[中文版](../01-routing-must-be-typed.md)*

## What happened

The coordinator has to hand each task to a subagent. Early on, it wrote a routing marker into its reply and code parsed it out. Over time two problems appeared:

1. The coordinator sometimes *said* it was handing off without actually calling a tool. This got worse as conversations grew longer.
2. We wanted a PreToolUse hook to block invalid routes, but some routes never passed through the hook at all.

## Root cause

Both problems come from one fact: **text and tool calls leave the model through different channels.**

- A PreToolUse hook only sees tool calls. Plain assistant text exits through a separate path, so a hook cannot intercept it by design.
- Routing rules were injected into context every turn. As they piled up in long conversations, the model drifted toward narrating what it would do instead of doing it.

## Fix

Move routing out of text and into a tool argument:

- A dispatch tool whose route is a `Literal` enum with a fixed set of values.
- A PreToolUse hook validates that argument and rejects anything outside the enum.
- Routing rules are stated once in the system prompt instead of injected every turn.
- A check treats a turn that expresses a hand-off without a dispatch call as "not dispatched" and asks the coordinator to route again.

The dispatch tool is a FastMCP server with a full test suite.

## Takeaway

**If you want a hook to enforce something, it has to appear in a tool argument.** Rules in a prompt are suggestions. Constraints on parameters are guarantees.

---

Interactive demo: [execution trace replay](https://cosmodai.github.io/xiaodai-ai-showcase/trace.html?lang=en), steps 2 and 3.
