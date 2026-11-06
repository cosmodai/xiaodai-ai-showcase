// 合成执行记录。结构参照真实运行方式简化，所有编号、时间和数据均为示例。
// Synthetic execution records, simplified from the real system. All IDs, times and data are examples.
const EN = new URLSearchParams(location.search).get("lang") === "en";
const t = (zh, en) => (EN ? en : zh);

if (EN) {
  document.documentElement.lang = "en";
  document.title = "Execution Trace Replay · Xiaodai AI";
  for (const el of document.querySelectorAll("[data-en]")) el.textContent = el.dataset.en;
  for (const el of document.querySelectorAll("[data-en-href]")) el.setAttribute("href", el.dataset.enHref);
  document.querySelector("#language").removeAttribute("lang");
}

const TASK = "T-1102-07";

const common = [
  {
    who: t("定时任务", "Scheduler"), title: t("按计划触发", "Fires on schedule"), kind: "info",
    note: t("周一 07:30 触发，任务编号写入任务文件，之后每一步都挂在这个编号下。",
      "Fires Monday at 07:30. The task ID is written to the task file, and every later step is recorded under it."),
    log: `trigger   weekly_report_north\ntask_id   ${TASK}\nexpect    data_through = 2026-11-01\nstate     tasks.md -> pending`,
  },
  {
    who: t("主脑", "Coordinator"), title: t("用文字“派单”，没有调用工具", "“Routes” in text, no tool call"), kind: "warn",
    note: t("主脑回了一句“交给分析 agent 处理”，但没有产生任何工具调用。文字路由不会触发派单，hook 也看不到它。路由检查发现本轮没有调度调用，要求重发。",
      "The coordinator replies “I'll hand this to the analyst agent” but makes no tool call. Text routing dispatches nothing, and no hook can see it. The route check finds no dispatch call this turn and asks it to route again."),
    log: t(`assistant.text  "好的，这个交给分析 agent 处理。"`, `assistant.text  "OK, handing this to the analyst agent."`) +
      `\ntool_use        (none)\nroute_check     FAIL  no dispatch call in turn\naction          re-prompt: route via dispatch tool`,
  },
  {
    who: t("主脑", "Coordinator"), title: t("通过调度工具派单", "Dispatches through the tool"), kind: "ok",
    note: t("这次路由是调度工具的枚举参数。PreToolUse hook 校验参数合法后放行，派单正式发生。",
      "This time the route is an enum argument on the dispatch tool. The PreToolUse hook validates it and lets it through, so the work is actually dispatched."),
    log: `tool_use  dispatch\n  route    = "analyst"      # Literal enum\n  task_id  = "${TASK}"\nPreToolUse  route in enum      PASS\n            task_id registered  PASS`,
  },
  {
    who: t("分析 agent", "Analyst agent"), title: t("想直接把周报发进群", "Tries to post the report itself"), kind: "block",
    note: t("外发消息只允许发件箱执行。子 agent 直接调用发送工具，在调用前就被拦下，并被告知改走发件箱。",
      "Only the outbox may send external messages. The subagent's direct call to the send tool is blocked before it runs, and it is told to use the outbox."),
    log: `tool_use  send_message(channel="ops-group", ...)\nPreToolUse  caller=analyst  allowed=[outbox]\n            BLOCK  external send must go through outbox`,
  },
  {
    who: t("分析 agent", "Analyst agent"), title: t("生成周报，自报“已完成”", "Writes the report, claims “done”"), kind: "info",
    note: t("子 agent 读取周报模板，生成报告文件，然后宣布完成。注意：它用的是缓存里的数据。",
      "The subagent loads the report template, writes the file and announces it is done. Note that it used cached data."),
    log: `skill     weekly-report template   loaded\nsource    metrics_cache (hit)\nwrite     reports/north_weekly.md\nclaim     ` + t(`"周报已完成"`, `"weekly report done"`),
  },
];

const withAssert = [
  {
    who: t("完成断言", "Completion check"), title: t("回读结果：数据日期不对，退回", "Read-back: wrong data date, rejected"), kind: "fail",
    note: t("文件存在、格式正确，但报告里的数据截止日是 10 月 25 日，比要求早一周。子 agent 的“完成”被驳回，任务退回重做。",
      "The file exists and matches the template, but its data runs through Oct 25, a week earlier than required. The subagent's “done” is rejected and the task goes back."),
    log: `assert  file_exists(reports/north_weekly.md)   PASS\nassert  sections == template                   PASS\nassert  data_through == 2026-11-01             FAIL  got 2026-10-25\nverdict REJECT -> back to analyst`,
  },
  {
    who: t("分析 agent", "Analyst agent"), title: t("绕过缓存重跑", "Reruns without the cache"), kind: "info",
    note: t("退回信息里带着失败的断言，子 agent 这次直接从数据源取数。",
      "The rejection includes the failed assertion, so this time the subagent reads from the source database."),
    log: `source    metrics_db (cache bypassed)\nwrite     reports/north_weekly.md\nclaim     ` + t(`"周报已完成"`, `"weekly report done"`),
  },
  {
    who: t("完成断言", "Completion check"), title: t("再次回读，全部通过", "Read-back passes"), kind: "ok",
    note: t("三项断言都通过，任务才进入外发环节。", "All three assertions pass. Only now does the task move on to sending."),
    log: `assert  file_exists                PASS\nassert  sections == template      PASS\nassert  data_through == 2026-11-01  PASS\nverdict ACCEPT -> outbox`,
  },
  {
    who: t("发件箱", "Outbox"), title: t("投递到运营群", "Delivers to the ops group"), kind: "ok",
    note: t("发件箱是唯一能对外发消息的角色，投递时带上任务编号，方便对回执。",
      "The outbox is the only role that sends externally. It tags the delivery with the task ID so the receipt can be matched."),
    log: `outbox  send ops-group  ref=${TASK}\nstatus  delivered`,
  },
  {
    who: t("回执", "Receipt"), title: t("收到签收，归档", "Receipt matched, closed"), kind: "ok",
    note: t("收到带同一任务编号的签收，任务文件才改成完成。", "The task file is marked done only after a receipt carrying the same task ID arrives."),
    log: `receipt  ref=${TASK}  ack\nstate    tasks.md -> done`,
  },
];

const withoutAssert = [
  {
    who: t("主脑", "Coordinator"), title: t("接受子 agent 的自报", "Accepts the subagent's claim"), kind: "risk",
    note: t("没有完成断言，主脑只能相信“已完成”这句话，直接放行。",
      "With no completion assertion, the coordinator can only take “done” at its word and lets it through."),
    log: `claim     ` + t(`"周报已完成"`, `"weekly report done"`) + `\nassert    (disabled)\nverdict   ACCEPT -> outbox`,
  },
  {
    who: t("发件箱", "Outbox"), title: t("投递到运营群", "Delivers to the ops group"), kind: "ok",
    note: t("投递本身没有问题，问题是投出去的内容。", "The delivery itself works. The problem is what was delivered."),
    log: `outbox  send ops-group  ref=${TASK}\nstatus  delivered`,
  },
  {
    who: t("回执", "Receipt"), title: t("收到签收，归档为“完成”", "Receipt matched, closed as “done”"), kind: "fail",
    note: t("系统记录一切正常。但群里收到的周报，数据截止 10 月 25 日，是上上周的。",
      "Every record says the run succeeded. But the report in the group has data through Oct 25, from the week before last."),
    log: `receipt  ref=${TASK}  ack\nstate    tasks.md -> done\n# report data_through = 2026-10-25`,
  },
];

const label = EN
  ? { risk: "Unverified", info: "Running", ok: "Pass", warn: "Retry", block: "Blocked", fail: "Fail" }
  : { risk: "未核验", info: "进行", ok: "通过", warn: "需重试", block: "已拦截", fail: "未通过" };

const stepsEl = document.querySelector("#steps");
const detailEl = document.querySelector("#detail");
const outcomeEl = document.querySelector("#outcome");
const nextBtn = document.querySelector("#next");
const playBtn = document.querySelector("#play");
const assertBox = document.querySelector("#assert");
const PLAY = t("自动播放", "Autoplay");
const PAUSE = t("暂停", "Pause");

let shown = 0;
let timer = null;

const script = () => common.concat(assertBox.checked ? withAssert : withoutAssert);

function showDetail(step, index) {
  detailEl.replaceChildren();
  const h = document.createElement("h2");
  h.textContent = t(`第 ${index + 1} 步 · ${step.who}`, `Step ${index + 1} · ${step.who}`);
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
  const [title, body] = assertBox.checked
    ? [t("结果：正确的周报送达，回执已归档", "Result: the correct report was delivered and closed on a receipt"),
       t("过程中拦下 1 次无效派单、1 次越权外发，退回 1 次过期数据。三处问题都没有流到群里。",
         "Along the way it caught one non-dispatch, one unauthorized send and one stale report. None of them reached the group.")]
    : [t("结果：系统显示“完成”，群里收到的是过期周报", "Result: the system says “done”, the group got a stale report"),
       t("每一步看起来都成功了，记录里也没有任何报错。这就是“假完成”：问题不在执行，而在没人回读结果。打开上面的开关再跑一遍对比。",
         "Every step looked successful and nothing in the logs shows an error. That is phantom completion: the failure is not in execution but in nobody reading back the result. Turn the switch back on and compare.")];
  outcomeEl.replaceChildren();
  const h = document.createElement("h2");
  h.textContent = title;
  const p = document.createElement("p");
  p.textContent = body;
  outcomeEl.append(h, p);
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
  playBtn.textContent = PLAY;
  playBtn.disabled = shown >= script().length;
}

function reset() {
  stop();
  shown = 0;
  stepsEl.replaceChildren();
  detailEl.replaceChildren();
  const h = document.createElement("h2");
  h.textContent = t("证据", "Evidence");
  const p = document.createElement("p");
  p.className = "muted";
  p.textContent = t("点击“下一步”开始。", "Press “Next step” to begin.");
  detailEl.append(h, p);
  nextBtn.disabled = false;
  playBtn.disabled = false;
  renderOutcome();
}

playBtn.addEventListener("click", () => {
  if (timer) return stop();
  playBtn.textContent = PAUSE;
  next();
  timer = setInterval(next, 1400);
});
nextBtn.addEventListener("click", () => { stop(); next(); });
document.querySelector("#reset").addEventListener("click", reset);
assertBox.addEventListener("change", reset);
reset();
