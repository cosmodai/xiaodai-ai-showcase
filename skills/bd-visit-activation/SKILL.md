---
name: bd-visit-activation
description: "Check visit, signing and first-order denominators and review window-specific follow-ups."
---

# BD Visits and Activation / BD 拜访与签后动销

## Workflow / 流程

1. Freeze a merchant roster, time period and valid visit rule. Count unique merchants for the funnel.
2. Report visit coverage over the roster and visit-to-signing over eligible visited merchants.
3. Select a post-signing follow-up window. Count activation by the first valid order inside that window, using signings with complete follow-up as the denominator. Report immature signings separately.
4. Produce a merchant-level list for visit scheduling, signing follow-up and first-order barriers. Keep visit-day KPIs separate from a merchant-level funnel.

## Known answer / 可核对样例

North has five merchants, four visited and three signed. Two signings have 14 complete days of follow-up. Their first orders are on day 4 and day 15. The third signing has only five observed days. Expected coverage is 4/5, signing 3/4, activation 1/2 and one immature signing.

拜访、签约与动销各用自己的分母。观察期未满时单列，避免把暂未观察到的结果当成未动销。
