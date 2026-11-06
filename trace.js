// 合成执行记录。结构参照真实运行方式简化，所有编号、时间和数据均为示例。
const TASK = "T-1102-07";

const common = [
  {
    who: "定时任务", title: "按计划触发", kind: "info",
    note: "周一 07:30 触发，任务编号写入任务文件，之后每一步都挂在这个编号下。",
    log: `trigger   weekly_report_north\ntask_id   ${TASK}\nexpect    data_through = 2026-11-01\nstate     tasks.md -> pending`,
  },
  {
    who: "主脑", title: "用文字“派单”，没有调用工具", kind: "warn",
    note: "主脑回了一句“交给分析 agent 处理”，但没有产生任何工具调用。文字路由不会触发派单，hook 也看不到它。路由检查发现本轮没有调度调用，要求重发。",
    log: `assistant.text  "好的，这个交给分析 agent 处理。"\ntool_use        (none)\nroute_check     FAIL  no dispatch call in turn\naction          re-prompt: route via dispatch tool`,
  },
  {
    who: "主脑", title: "通过调度工具派单", kind: "ok",
    note: "这次路由是调度工具的枚举参数。PreToolUse hook 校验参数合法后放行，派单正式发生。",
    log: `tool_use  dispatch\n  route    = "analyst"      # Literal 枚举\n  task_id  = "${TASK}"\nPreToolUse  route in enum      PASS\n            task_id registered  PASS`,
  },
  {
    who: "分析 agent", title: "想直接把周报发进群", kind: "block",
    note: "外发消息只允许发件箱执行。子 agent 直接调用发送工具，在调用前就被拦下，并被告知改走发件箱。",
    log: `tool_use  send_message(channel="ops-group", ...)\nPreToolUse  caller=analyst  allowed=[outbox]\n            BLOCK  external send must go through outbox`,
  },
  {
    who: "分析 agent", title: "生成周报，自报“已完成”", kind: "info",
    note: "子 agent 读取周报模板，生成报告文件，然后宣布完成。注意：它用的是缓存里的数据。",
    log: `skill     weekly-report template   loaded\nsource    metrics_cache (hit)\nwrite     reports/north_weekly.md\nclaim     "周报已完成"`,
  },
];

const withAssert = [
  {
    who: "完成断言", title: "回读结果：数据日期不对，退回", kind: "fail",
    note: "文件存在、格式正确，但报告里的数据截止日是 10 月 25 日，比要求早一周。子 agent 的“完成”被驳回，任务退回重做。",
    log: `assert  file_exists(reports/north_weekly.md)   PASS\nassert  sections == template                   PASS\nassert  data_through == 2026-11-01             FAIL  got 2026-10-25\nverdict REJECT -> back to analyst`,
  },
  {
    who: "分析 agent", title: "绕过缓存重跑", kind: "info",
    note: "退回信息里带着失败的断言，子 agent 这次直接从数据源取数。",
    log: `source    metrics_db (cache bypassed)\nwrite     reports/north_weekly.md\nclaim     "周报已完成"`,
  },
  {
    who: "完成断言", title: "再次回读，全部通过", kind: "ok",
    note: "三项断言都通过，任务才进入外发环节。",
    log: `assert  file_exists                PASS\nassert  sections == template      PASS\nassert  data_through == 2026-11-01  PASS\nverdict ACCEPT -> outbox`,
  },
  {
    who: "发件箱", title: "投递到运营群", kind: "ok",
    note: "发件箱是唯一能对外发消息的角色，投递时带上任务编号，方便对回执。",
    log: `outbox  send ops-group  ref=${TASK}\nstatus  delivered`,
  },
  {
    who: "回执", title: "收到签收，归档", kind: "ok",
    note: "收到带同一任务编号的签收，任务文件才改成完成。",
    log: `receipt  ref=${TASK}  ack\nstate    tasks.md -> done`,
  },
];

const withoutAssert = [
  {
    who: "主脑", title: "接受子 agent 的自报", kind: "risk",
    note: "没有完成断言，主脑只能相信“已完成”这句话，直接放行。",
    log: `claim     "周报已完成"\nassert    (disabled)\nverdict   ACCEPT -> outbox`,
  },
  {
    who: "发件箱", title: "投递到运营群", kind: "ok",
    note: "投递本身没有问题，问题是投出去的内容。",
    log: `outbox  send ops-group  ref=${TASK}\nstatus  delivered`,
  },
  {
    who: "回执", title: "收到签收，归档为“完成”", kind: "fail",
    note: "系统记录一切正常。但群里收到的周报，数据截止 10 月 25 日，是上上周的。",
    log: `receipt  ref=${TASK}  ack\nstate    tasks.md -> done\n# 报告实际 data_through = 2026-10-25`,
  },
];

const label = { risk: "未核验", info: "进行", ok: "通过", warn: "需重试", block: "已拦截", fail: "未通过" };

const stepsEl = document.querySelector("#steps");
const detailEl = document.querySelector("#detail");
const outcomeEl = document.querySelector("#outcome");
const nextBtn = document.querySelector("#next");
const playBtn = document.querySelector("#play");
const assertBox = document.querySelector("#assert");

let shown = 0;
let timer = null;

const script = () => common.concat(assertBox.checked ? withAssert : withoutAssert);

function showDetail(step, index) {
  detailEl.replaceChildren();
  const h = document.createElement("h2");
  h.textContent = `第 ${index + 1} 步 · ${step.who}`;
  const p = document.createElement("p");
  p.textContent = step.note;
  const pre = document.createElement("pre");
  pre.textContent = step.log;
  detailEl.append(h, p, pre);
}

function select(index) {
  [...stepsEl.children].forEach((li, i) => li.classList.toggle("current", i === index));
  showDetail(script()[index], index);
}

function renderOutcome() {
  const done = shown === script().length;
  outcomeEl.hidden = !done;
  if (!done) return;
  outcomeEl.className = assertBox.checked ? "outcome good" : "outcome bad";
  outcomeEl.innerHTML = assertBox.checked
    ? "<h2>结果：正确的周报送达，回执已归档</h2><p>过程中拦下 1 次无效派单、1 次越权外发，退回 1 次过期数据。三处问题都没有流到群里。</p>"
    : "<h2>结果：系统显示“完成”，群里收到的是过期周报</h2><p>每一步看起来都成功了，记录里也没有任何报错。这就是“假完成”：问题不在执行，而在没人回读结果。打开上面的开关再跑一遍对比。</p>";
}

function next() {
  const all = script();
  if (shown >= all.length) return stop();
  const step = all[shown];
  const li = document.createElement("li");
  li.className = `step ${step.kind}`;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "step-btn";
  const idx = shown;
  btn.addEventListener("click", () => select(idx));
  const who = document.createElement("span");
  who.className = "who";
  who.textContent = step.who;
  const title = document.createElement("span");
  title.className = "title";
  title.textContent = step.title;
  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = label[step.kind];
  btn.append(who, title, badge);
  li.append(btn);
  stepsEl.append(li);
  shown += 1;
  select(idx);
  nextBtn.disabled = shown >= all.length;
  if (shown >= all.length) stop();
  renderOutcome();
}

function stop() {
  clearInterval(timer);
  timer = null;
  playBtn.textContent = "自动播放";
  playBtn.disabled = shown >= script().length;
}

function reset() {
  stop();
  shown = 0;
  stepsEl.replaceChildren();
  detailEl.innerHTML = '<h2>证据</h2><p class="muted">点击“下一步”开始。</p>';
  nextBtn.disabled = false;
  playBtn.disabled = false;
  renderOutcome();
}

playBtn.addEventListener("click", () => {
  if (timer) return stop();
  playBtn.textContent = "暂停";
  next();
  timer = setInterval(next, 1400);
});
nextBtn.addEventListener("click", () => { stop(); next(); });
document.querySelector("#reset").addEventListener("click", reset);
assertBox.addEventListener("change", reset);
reset();
