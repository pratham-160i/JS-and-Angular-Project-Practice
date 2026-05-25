"use strict";

const log = (...args) => console.log(...args);

/**
 * Task 1 — user.greet(), detached fn(), .call()
 * Predict (strict): user.greet() → "Priya" | fn() → TypeError (this undefined) | call({name:"X"}) → "X"
 */
log("=== Task 1 — Predict, then run ===");
log('Predict: user.greet() → "Priya" (method call, this === user)');
log("Predict: fn() → TypeError in strict (lost receiver, this is undefined)");
log('Predict: user.greet.call({ name: "X" }) → "X" (explicit this)');

const user = {
  name: "Priya",
  greet() {
    log("  greet →", this.name);
  },
};

user.greet();

const fn = user.greet;
try {
  fn();
} catch (e) {
  log("  fn() →", e.name + ":", e.message);
}

user.greet.call({ name: "X" });

/**
 * Task 2 — Class method as callback: same “lost this” as setTimeout(cb); fix three ways
 */
log("\n=== Task 2 — Callback bug + three fixes (documented) ===");

class Counter {
  constructor() {
    this.count = 0;
  }
  tick() {
    this.count += 1;
    return this.count;
  }
}

const c = new Counter();
c.tick();
const looseTick = c.tick;
try {
  looseTick();
} catch (e) {
  log("BUG: pass c.tick as bare reference (like setTimeout(cb)) →", e.name);
}

log(
  "Fix 1 — .bind(c): keeps receiver. e.g. setTimeout(c.tick.bind(c), ms) — demo:",
  looseTick.bind(c)()
);

const c2 = new Counter();
c2.tick();
log(
  "Fix 2 — arrow wrapper: setTimeout(() => c2.tick(), ms) closes over c2 — demo:",
  (() => c2.tick())()
);

class CounterArrow {
  count = 0;
  tick = () => {
    this.count += 1;
    return this.count;
  };
}
const c3 = new CounterArrow();
c3.tick();
const looseArrow = c3.tick;
log(
  "Fix 3 — class field arrow: tick holds lexical this; bare ref OK — demo:",
  looseArrow()
);

/**
 * Task 3 — sum + .apply(array)
 * .apply shines when args already live in an array (no manual spread; works with unknown length).
 */
log("\n=== Task 3 — sum + .apply ===");

function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}

const arr = [1, 2, 3, 4, 5];
log("sum.apply(null, arr) →", sum.apply(null, arr));
log(
  "Why .apply: passes each array element as one argument without writing sum(1,2,3,4,5) by hand; great when the array is built at runtime."
);

/**
 * Task 4 — Top-level arrow + .bind: bind cannot change lexical this
 */
log("\n=== Task 4 — Arrow + .bind ===");
const f = () => {
  log("  arrow sees lexical this:", this);
};
const bound = f.bind({ x: 1 });
log("Calling bound() — same as f(); bind's thisArg is ignored for arrows:");
bound();
