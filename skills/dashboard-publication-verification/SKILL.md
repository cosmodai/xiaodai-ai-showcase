---
name: dashboard-publication-verification
description: "Simulate a refresh, publish and receiver readback with version and data-date checks."
---

# Dashboard Publication Verification / 看板发布核验

## Workflow / 流程

1. Record the expected version, data cutoff and receiver-facing destination before publishing.
2. Refresh locally and record the local snapshot. Publish and keep the operation receipt as an intermediate checkpoint.
3. Open the destination from the receiver's view. Compare both the version and the data cutoff to the expected values.
4. Keep the task open on a mismatch. Identify the stale component and repeat readback after a separately authorized retry.

## Known answer / 可核对样例

Initial shared state is v41 with data through Nov 4. Expected state is v42 through Nov 5. A successful publish receipt followed by v42 through Nov 4 fails. The shared state v42 through Nov 5 passes.

以接收方实际看到的版本和数据日期为验收依据。发布回执和接收方回读分别记录。
