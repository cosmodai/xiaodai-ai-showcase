---
name: conversion-funnel-diagnostics
description: Locate a change in food-delivery conversion across impression, visit, cart, checkout, and payment stages using comparable segments and explicit denominators.
---

# Conversion Funnel Diagnostics / 转化漏斗诊断

1. Align the baseline and comparison periods by timezone, observation window, event definitions, filters and coverage. Confirm that each count uses the same cohort or exposure unit before interpreting the chain as a funnel.
2. Show all five counts and calculate each rate as the next stage divided by the current stage. Report changes in percentage points. Mark a zero denominator as unavailable.
3. Start with the largest rate drop, then slice by market, time, merchant or customer segment. Aggregate counts before dividing. If segment mix changed, compare both within-segment rates and aggregate rates.
4. Record the localized stage, the underlying counts and plausible next checks. A falling stage identifies where to investigate. Establish a cause with separate evidence.

## Known answer / 可复算样例

North at dinner: visits were 1,000 in both windows. Cart additions fell from 500 to 350, so visit-to-cart went from 50% to 35%, a drop of 15 percentage points. Exposure-to-visit stayed at 20%. Check menu availability and item interactions next.

先对齐窗口和事件口径，再逐层给出分子、分母和百分点差。先定位掉点，再补证据判断原因。
