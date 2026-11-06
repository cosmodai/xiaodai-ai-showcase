# 公开 Skills / Public Skills

小戴在日常运营里使用的九个工作流，去掉了真实数据和内部细节后公开。每个 Skill 都写明了步骤、验收条件和一个可以复算的示例。

Nine workflows Xiaodai uses in daily operations, published without real data or internal details. Each one states its steps, acceptance criteria and a worked example you can recompute.

| Skill | 用途 | Use |
| --- | --- | --- |
| [order-change-drilldown](order-change-drilldown/SKILL.md) | 订单异动下钻：拆成流量和转化两部分 | Split an order change into traffic and conversion components |
| [conversion-funnel-diagnostics](conversion-funnel-diagnostics/SKILL.md) | 转化漏斗诊断：定位掉点环节 | Locate the funnel stage where conversion dropped |
| [storefront-audit](storefront-audit/SKILL.md) | 店铺装修诊断：改版预览与验收清单 | Audit a storefront and produce a redesign preview with acceptance checks |
| [dish-image-review](dish-image-review/SKILL.md) | 菜品图验收：出图、核字、映射、回读 | Prepare and verify a menu image and its item mapping |
| [delivery-readback](delivery-readback/SKILL.md) | 交付回读核验：确认结果真正到达 | Verify that a publication or hand-off actually reached its destination |
| [cohort-retention](cohort-retention/SKILL.md) | 用户留存 | Compare mature first-order cohorts |
| [coupon-redemption](coupon-redemption/SKILL.md) | 红包核销 | Reconcile redemption and observed order gaps |
| [delivery-tail-analysis](delivery-tail-analysis/SKILL.md) | 配送长尾 | Compare P90 and ETA misses |
| [known-answer-acceptance](known-answer-acceptance/SKILL.md) | 已知答案验收 | Run fixed fixtures against a candidate implementation |

## 怎么用 / How to use

这些文件采用 Claude Skills 的格式（带 `name` 和 `description` 的 `SKILL.md`）。

These files follow the Claude Skills format (a `SKILL.md` with `name` and `description` front matter).

**Claude Code**：把需要的文件夹复制到项目的 `.claude/skills/`，或个人目录的 `~/.claude/skills/`，Claude 会在任务匹配时自动加载。

**Claude Code**: copy a skill folder into your project's `.claude/skills/` or your personal `~/.claude/skills/`. Claude loads it when a task matches its description.

```bash
git clone https://github.com/cosmodai/xiaodai-ai-showcase
cp -r xiaodai-ai-showcase/skills/delivery-readback ~/.claude/skills/
```

也可以直接把 `SKILL.md` 的内容当作提示词使用。

You can also paste a `SKILL.md` into any assistant as a prompt.

## 在线演示 / Live demos

- [转化漏斗诊断 / Funnel diagnostics](https://cosmodai.github.io/xiaodai-ai-showcase/funnel.html?lang=en)
- [店铺装修诊断 / Storefront audit](https://cosmodai.github.io/xiaodai-ai-showcase/storefront.html?lang=en)
- [执行轨迹回放 / Execution trace](https://cosmodai.github.io/xiaodai-ai-showcase/trace.html?lang=en)
- [用户留存 / Compare mature first-order cohorts](https://cosmodai.github.io/xiaodai-ai-showcase/lab.html?demo=retention&lang=en)
- [红包核销 / Reconcile redemption and observed order gaps](https://cosmodai.github.io/xiaodai-ai-showcase/lab.html?demo=coupon&lang=en)
- [配送长尾 / Compare P90 and ETA misses](https://cosmodai.github.io/xiaodai-ai-showcase/lab.html?demo=delivery&lang=en)
- [已知答案验收 / Run fixed fixtures against a candidate implementation](https://cosmodai.github.io/xiaodai-ai-showcase/lab.html?demo=checks&lang=en)
