const form = document.querySelector("#scenario");
const orders = document.querySelector("#orders");
const subsidy = document.querySelector("#subsidy");
const error = document.querySelector("#error");
const results = document.querySelector("#results");
const money = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", currencyDisplay: "code" });

function calculate(orderCount, subsidyCents) {
  const cost = orderCount * subsidyCents;
  return { cost, contribution: orderCount * 600 - cost };
}

const baseline = calculate(100, 200);

function display(metric, cents) {
  document.getElementById(metric).textContent = money.format(cents / 100);
  const difference = cents - baseline[metric];
  const sign = difference > 0 ? "+" : "";
  document.getElementById(metric + "-delta").textContent =
    "较基准 " + sign + money.format(difference / 100);
}

function render() {
  const valid = form.checkValidity();
  error.hidden = valid;
  results.hidden = !valid;
  if (!valid) return;

  const scenario = calculate(orders.valueAsNumber, Math.round(subsidy.valueAsNumber * 100));
  display("cost", scenario.cost);
  display("contribution", scenario.contribution);
}

form.addEventListener("submit", (event) => event.preventDefault());
form.addEventListener("input", render);
render();
