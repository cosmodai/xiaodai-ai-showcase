---
name: coupon-redemption
description: Audit coupon issuance, redemption, funded cost and observed customer order gaps using deduplicated coupon and user identifiers.
---

# Coupon Redemption / 红包核销

1. Match unique issued coupon IDs to valid redemptions as of a stated cutoff. Use issued coupons as the redemption-rate denominator. Keep recipients and redeemers as distinct user counts.
2. Sum the documented funded amount once per redeemed coupon. Exclude failed or voided events under the declared rule.
3. Classify each redemption against the immediately previous valid order. Distinguish no observed prior order, known gap, and unknown history. Report repeat redeemers separately when relevant.
4. Show any inactivity threshold explicitly. An observed gap describes behavior, while incremental reactivation requires a separate comparison.

## Known answer / 可核对样例

Campaign A issues six coupons to five users. Three coupons redeem for CAD 2, 3 and 2 across two users. Expected redemption 3/6, funded cost CAD 7, and unique redeemers 2. The three gaps are 35 days, 2 days and no prior observed order. At a 30-day threshold, exactly one redemption qualifies by gap.

发券和核销按券编号去重，人数按用户去重。回流候选以真实间隔筛选，并单列历史缺失。
