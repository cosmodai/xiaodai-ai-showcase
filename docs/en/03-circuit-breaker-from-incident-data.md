# Note 03: Correcting a circuit breaker with incident data

*[中文版](../03-circuit-breaker-from-incident-data.md)*

## Background

Xiaodai can modify some of its own components. To stop it from breaking itself while in a bad state, high-risk edits sit behind a circuit breaker with two original triggers:

- **Condition A: refuse high-risk edits when global load is high**
- **Condition B: refuse when several high-risk edits happen in a short window**

Load is a weighted score, and the breaker has hysteresis: it trips above an upper threshold and recovers only after dropping below a lower one, so it does not flap at the boundary.

## The incident

During one incident, the system broke its own message relay while editing it. The intuitive suspect was high load. We replayed the load curve from historical records and found:

**Global load was low at the moment of the fatal edit.**

The real signature was that the system had already made several consecutive edits to the same area just before.

## Conclusions

- Condition B (consecutive-edit detection) is the one that would have stopped this incident.
- Condition A would not have fired. A finer-grained load sub-ledger built for it added no value in hindsight, so we removed it.
- The closure state machine keeps hard abort entry points, and a companion restart protocol closes the loophole where an agent certifies its own recovery.

## Takeaway

**Validate circuit-breaker rules against real incidents, not intuition.** This was possible because every write and command by the main agent is logged, subagent hand-offs are logged, and transcripts can be replayed to rebuild an accurate timeline.

---

Back to the [portfolio](https://cosmodai.github.io/xiaodai-ai-showcase/?lang=en)
