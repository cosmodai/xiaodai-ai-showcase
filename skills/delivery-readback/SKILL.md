---
name: delivery-readback
description: Verify that a dashboard publication, data correction, or operational handoff actually reached the intended destination and state.
---

# Delivery Readback / 交付回读核验

1. Define the expected object, destination, version or value, and acceptable observation time before making a change. Capture the prior state and rollback reference for authorized writes.
2. Record the action response separately from the resulting state. A save response, local build, or send event is an intermediate checkpoint.
3. Read the actual destination after the change using the receiver-facing view or authoritative record. Compare the key, value and version against the expectation. For handoffs, match the receipt to the same task or delivery ID.
4. If readback differs, preserve both observations, identify the failed stage and stop or retry within the authorized scope. Report separately if the recipient-side check is unavailable.

## Known answer / 可复算示例

Local dashboard v42 shows data through Nov 5. Shared view v41 shows data through Nov 4. Publication verification fails. After publication, read the shared view again. It passes when v42 and Nov 5 both match.

先定义验收条件，再分开记录提交结果和实际状态。版本、对象或接收方任一不符，都应保留差异并说明待查环节。
