---
name: order-change-drilldown
description: Diagnose a change in order volume across comparable periods and break it down by market, merchant, traffic, and conversion using auditable calculations.
---

# Order Change Drilldown / 订单异动下钻

## Inputs / 输入

Two matched periods, segment keys, visits and orders, plus the date, timezone, exclusion rules and coverage for each export. Use synthetic examples in public work.

## Workflow / 流程

1. Align comparable days, market scope and exclusions. Show orders per day when period lengths differ. Report missing segments explicitly and keep unmatched merchants in a separate bucket.
2. Reconcile totals before ranking segment changes. Report the signed change for each segment and use its share of total decline only when the denominator is meaningful.
3. For segments with usable traffic, split the order change exactly into traffic and conversion components. With visits V and conversion r, use (V1 − V0) × r0 and V1 × (r1 − r0). State the baseline convention. Treat zero-visit rates as unavailable.
4. If segment mix shifts, compare within-segment rates and overall mix before interpreting the aggregate. Check funnel stages and annotate which evidence is missing.
5. Separate observed facts, plausible explanations and evidence needed to test them.

## Known answer / 可复算示例

5,000 visits and 500 orders became 5,000 visits and 350 orders. Orders fell by 150. The traffic component is 0 and the conversion component is −150. This localizes the change to visit-to-order conversion. Product availability, checkout friction and customer mix remain hypotheses until tested.

交付时写清对比窗口、日均、覆盖范围、贡献量与分母，并把下一步查证和已观察事实分开。
