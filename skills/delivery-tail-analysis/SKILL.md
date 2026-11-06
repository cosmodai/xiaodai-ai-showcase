---
name: delivery-tail-analysis
description: Compare delivery duration distributions and ETA misses across segments using consistent inclusion rules and explicit percentile definitions.
---

# Delivery Tail Analysis / 配送长尾

1. Include completed eligible orders and validate timestamps. State the duration start and end and the estimate used for lateness.
2. Report count, mean, nearest-rank P90 and the share above a chosen duration. Compute nearest-rank P90 at sorted rank ceil(0.9 × N).
3. Report ETA misses separately, using only orders with a usable upper delivery estimate. Give the numerator and denominator for each rate.
4. Compare like-for-like dayparts. Check timestamps for preparation, pickup and drop-off before attributing delays.

## Known answer / 可核对样例

At dinner, eight West deliveries take 30 minutes and two take 70. Ten East deliveries take 38 each. Both means are 38. West nearest-rank P90 is 70 and the share above 60 is 2/10. The same mean conceals a materially different tail in this fixture.

均值、P90、长单率和预计送达偏差分开报告。没有分段时间证据时，保留责任判断。
