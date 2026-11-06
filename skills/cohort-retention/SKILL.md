---
name: cohort-retention
description: Compare user-level repeat purchase across first-order cohorts with complete follow-up, and separately report repeat purchase without a coupon.
---

# Cohort Retention / 用户留存

1. Define the first valid order, the cutoff and the follow-up window. For each user, check that the full window has elapsed by the cutoff.
2. Deduplicate users within each cohort. Use all eligible first-order users as the denominator, including those with no repeat.
3. Count users with at least one eligible repeat in days 1 through N. Also count users with at least one eligible repeat without a coupon. Repeated orders from one user count once per metric.
4. Report immature exclusions and state that the coupon split is descriptive. It cannot identify behavior under a no-coupon policy.

## Known answer / 可核对样例

Cutoff day 35, 28-day window. Cohort A begins on day 0 with four users. A1 repeats on day 5 with a coupon and on day 18 without one. A2 repeats on day 14 with a coupon. A3 repeats on day 30. A4 never repeats. Expected overall 2/4 and without coupon 1/4. A day-21 cohort is excluded.

先核观察窗口，再按用户去重。整体复购和无券复购用同一个完整观察人群作分母。
