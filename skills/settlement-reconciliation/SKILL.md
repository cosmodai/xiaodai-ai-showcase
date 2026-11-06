---
name: settlement-reconciliation
description: Reconcile orders, posted refunds, fees and settlement lines by batch and currency, and retain unresolved differences or missing evidence for review.
---

# Settlement Reconciliation / 结算对账

1. Freeze the batch, cutoff, currency, status and sign convention. Confirm unique source identifiers, distinguish missing data from zero, and retain the original records for review.
2. Link posted refunds and fees to orders. Calculate expected net settlement as order amount minus refunds and fees. Group split settlement lines by order and preserve their original line IDs. Record settlement-only lines separately.
3. Compare observed settlement with expected net by order and batch. Keep amount discrepancies, missing source evidence and unmatched lines separate. A balanced amount can still require evidence.
4. Investigate timing, reversals, partial settlement and duplicate lines before resolving an exception. Reconcile any amended statement using its new evidence and keep the original comparison. Unresolved items remain open.

## Known answer / 可复算样例

Batch A includes three orders totaling CA$240, a CA$20 posted refund and CA$24 in fees. Expected net is CA$196. The statement totals CA$192, so actual minus expected is −CA$4. O03 accounts for the difference. O02 balances but lacks its fee receipt. In the revised scenario, an amended statement adds CA$4 to O03 and O02's receipt is supplied. The revised comparison balances.

Batch B includes a CA$50 order and CA$5 fee. Two settlement lines of CA$20 and CA$25 match the order. A separate CA$5 line lacks a matching order and remains open.

## Public scope / 公开范围

Use invented identifiers and synthetic records. Share the matching procedure, arithmetic and evidence statuses. Keep real statements, receipts, internal account mappings, credentials and deployment details private.

按批次和币种锁定范围，再用订单号归集退款、费用与结算行。差额按实际减应结计算，缺凭证和未匹配结算行单独列示。
