/**
 * Day 14 — Lexical scope, scope chain, closures, IIFE (lesson.js)
 * Open day-14/html/lesson.html or run: node day-14/js/lesson.js
 */
(function day14Lesson() {
  const log = (...args) => console.log(...args);

  log("=== Day 14 — Scope & closures ===");

  /**
   * Topic 1 — Lexical (static) scope: where you write decides what you see
   */
  log("\nTopic 1 — Lexical scope (never dynamic)");
  const city = "Jaipur";
  function outer() {
    const language = "Hindi";
    function inner() {
      const greeting = "Namaste";
      log("Topic 1 — inner sees:", greeting, language, city);
    }
    inner();
  }
  outer();

  /**
   * Topic 2 — Scope chain: current → outer → … → global (one direction)
   */
  log("\nTopic 2 — Scope chain");
  const a = "global a";
  function outerChain() {
    const b = "outer b";
    function innerChain() {
      const c = "inner c";
      log("Topic 2 —", a, b, c);
    }
    innerChain();
  }
  outerChain();

  const x = 1;
  function aFollow() {
    const y = 2;
    function bFollow() {
      log("Topic 2 follow-along x + y:", x + y);
    }
    bFollow();
  }
  aFollow();

  /**
   * Topic 3 — Closures: inner function keeps outer variables after outer returns
   */
  log("\nTopic 3 — Closures");
  function makeGreeter(name) {
    return function () {
      log(`Namaste, ${name}!`);
    };
  }
  const greetPriya = makeGreeter("Priya");
  const greetAarav = makeGreeter("Aarav");
  greetPriya();
  greetAarav();

  /**
   * Topic 4 — Practical patterns: counter, private state, memoize
   */
  log("\nTopic 4 — Closure patterns (counter, account, memoize)");
  function makeCounter() {
    let count = 0;
    return function () {
      count += 1;
      return count;
    };
  }
  const c = makeCounter();
  log("makeCounter:", c(), c(), c());

  function createAccount(initial) {
    let balance = initial;
    return {
      deposit: (amt) => (balance += amt),
      withdraw: (amt) => (balance -= amt),
      getBalance: () => balance,
    };
  }
  const acc = createAccount(1000);
  acc.deposit(500);
  log("account balance:", acc.getBalance());

  function memoize(fn) {
    const cache = {};
    return function (n) {
      if (n in cache) return cache[n];
      cache[n] = fn(n);
      return cache[n];
    };
  }
  const slowSquare = (n) => {
    log("  memoize — computing for", n);
    return n * n;
  };
  const fastSquare = memoize(slowSquare);
  log("memo first(5):", fastSquare(5));
  log("memo second(5):", fastSquare(5));

  /**
   * Topic 5 — var in loop: one binding vs let / IIFE (sync demos, same idea as setTimeout)
   */
  log("\nTopic 5 — var in loop vs let / IIFE (closure over one shared var)");
  const varFuncs = [];
  for (var i = 0; i < 3; i += 1) {
    varFuncs.push(() => i);
  }
  log("var + callbacks (expect 3,3,3):", varFuncs.map((f) => f()).join(", "));

  const letFuncs = [];
  for (let i2 = 0; i2 < 3; i2 += 1) {
    letFuncs.push(() => i2);
  }
  log("let (expect 0,1,2):", letFuncs.map((f) => f()).join(", "));

  const iifeFuncs = [];
  for (var i3 = 0; i3 < 3; i3 += 1) {
    iifeFuncs.push(((j) => () => j)(i3));
  }
  log("IIFE per iteration (expect 0,1,2):", iifeFuncs.map((f) => f()).join(", "));

  log("Fix 3 — bind (sync demo):");
  [0, 1, 2].forEach((i) => {
    console.log.bind(console, "Topic 5 bind i:", i)();
  });

  const followVar = [];
  for (var k = 1; k <= 2; k += 1) {
    followVar.push(() => k);
  }
  log(
    "follow-along var k (after loop k is 3; expect 3, 3):",
    followVar.map((f) => f()).join(", ")
  );

  /**
   * Topic 6 — IIFE: private scope, params, module object
   */
  log("\nTopic 6 — IIFE");
  (function () {
    const secret = "hidden";
    log("IIFE ran (secret stays private:", secret.length, "chars)");
  })();

  (function (place) {
    log("IIFE with arg:", place);
  })("Jaipur");

  (() => {
    log("arrow IIFE:", 42);
  })();

  const counterModule = (function () {
    let count = 0;
    return {
      inc: () => {
        count += 1;
        return count;
      },
      get: () => count,
    };
  })();
  counterModule.inc();
  counterModule.inc();
  log("counterModule.get():", counterModule.get());
})();
