const baseline = new Map([
  ["北区 / 2026-01-05", 12000],
  ["南区 / 2026-01-05", 8000],
]);
const incoming = new Map([
  ["北区 / 2026-01-05", 9500],
  ["南区 / 2026-01-05", 8000],
]);

const rows = document.querySelector("#rows");
const status = document.querySelector("#status");
const skip = document.querySelector("#skip");
const apply = document.querySelector("#apply");
const current = new Map();
const format = (cents) => (cents / 100).toFixed(2);

function render(checked) {
  const readback = new Map(current);
  const mismatches = [...incoming].filter(([key, expected]) => readback.get(key) !== expected);
  rows.replaceChildren();
  for (const [key, expected] of incoming) {
    const actual = readback.get(key);
    const row = rows.insertRow();
    const verdict = actual === expected ? "一致" : "待更新";
    for (const value of [key, format(baseline.get(key)), format(expected), format(actual), verdict]) {
      row.insertCell().textContent = value;
    }
  }
  if (!checked) {
    status.textContent = "预检发现 " + mismatches.length + " 条差异。请运行模拟导入。";
  } else if (mismatches.length) {
    status.textContent = "回读发现 " + mismatches.length + " 条费用仍是旧值。";
  } else {
    status.textContent = "回读通过。两条费用均与上游一致。";
  }
}

function reset() {
  for (const [key, value] of baseline) current.set(key, value);
  skip.disabled = false;
  apply.disabled = true;
  render(false);
}

skip.addEventListener("click", () => {
  for (const [key, value] of incoming) {
    if (!current.has(key)) current.set(key, value);
  }
  skip.disabled = true;
  apply.disabled = false;
  render(true);
});

apply.addEventListener("click", () => {
  for (const [key, value] of incoming) current.set(key, value);
  apply.disabled = true;
  render(true);
});

document.querySelector("#reset").addEventListener("click", reset);
reset();
