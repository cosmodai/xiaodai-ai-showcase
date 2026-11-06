---
name: campaign-incrementality
description: "Adjust for comparison-group movement, account for campaign cost, and check pre-period changes."
---

# Campaign Incrementality Review / 活动净增量复盘

## Workflow / 流程

1. Anchor treatment to the campaign start, use aligned windows, and select a comparison group with stable coverage and comparable pre-period trends.
2. Report the treated and comparison changes separately. Subtract the comparison change from the treated change on a common per-day basis and scale by campaign days.
3. Screen for baseline drift, spillovers and simultaneous changes. Withhold the estimate when baseline changes diverge. Use appropriate uncertainty estimates when the design and underlying observations support them.
4. Calculate illustrative incremental contribution from an explicitly defined per-order contribution and subtract campaign cost once.

## Known answer / 可核对样例

Three seven-day windows contain 90, 100 and 130 daily orders in the campaign group and 90, 100 and 110 in the comparison group. The adjusted estimate is (130 − 100) − (110 − 100) = 20 orders/day, or 140 in seven days. At CA$4 per incremental order and CA$350 campaign cost, illustrative net contribution is CA$210. Replacing the earlier campaign baseline with 75 makes the pre-period screen fail.

先检查窗口、对照与前期走势。样例是描述性估算。没有逐日波动数据时保留置信区间。
