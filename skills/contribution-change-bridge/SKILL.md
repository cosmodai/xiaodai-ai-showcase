---
name: contribution-change-bridge
description: Reconcile a contribution change across periods using additive order-volume and per-order revenue and cost effects, then drill into markets and stores.
---

# Contribution Change Bridge / 经营与利润异动诊断

1. Lock comparable periods, included orders, currency and the contribution definition. Identify line items excluded from the illustrative or actual measure.
2. Calculate the baseline and current contribution for each store. Use one convention consistently. Volume effect = change in orders × baseline contribution per order. Unit revenue effect = current orders × change in revenue per order. Unit cost effects use the negative change in each cost per order.
3. Calculate effects at the store level and sum to area and market. This keeps store-mix shifts inside the selected convention. Handle new or closed stores separately if per-order values cannot be observed in both periods.
4. Compare the sum of components with the actual period difference. Report residual, period values and signed effects. Treat the bridge as an accounting explanation of change and investigate causal mechanisms separately.

## Known answer / 可复算样例

Cedar Bowl goes from 100 to 90 orders. Baseline revenue, delivery cost and subsidy per order are CA$10, CA$4 and CA$2. Current values are CA$11, CA$5 and CA$3. Contribution moves from CA$400 to CA$270. Effects are volume −CA$40, revenue +CA$90, delivery −CA$90 and subsidy −CA$90. Their sum is −CA$130 with zero residual.

先统一口径，再逐店算桥接并加总。每一层都应对回期间差额。
