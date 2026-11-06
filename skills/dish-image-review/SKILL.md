---
name: dish-image-review
description: Review and prepare a food delivery menu image from an approved product reference, then verify the mapping and resulting image after an authorized update.
---

# Dish Image Review / 菜品图验收

1. Bind each source image to a menu item and variant. Diagnose missing, blurred or visually unsuitable images and preserve a suitable style reference where available.
2. Use the source to preserve dish composition, portion, container and identifying marks. For a full menu artwork, freeze bilingual dish names and approved copy before rendering. Keep supporting decoration clear of the food.
3. Check the intended aspect ratio and crop. Verify every rendered label against approved copy using OCR and visual review, including vertical plaques and small labels. Apply the required illustrative-image disclaimer and inspect it on the final output.
4. Present before/after and the item-to-asset mapping for review. For a separately authorized write, capture the old image value, apply the update to the confirmed item and read it back. If the effective image differs, record the mismatch and stop the batch.

## Known answer / 可核验示例

For fictional item DEMO-01, map the approved square dish image to the exact menu variant. The readback passes when DEMO-01 returns the intended asset and the prior asset can be recovered.

先核源图和菜品对应，再生成、核字、审图与回读。公开演示使用虚构菜单和素材。
