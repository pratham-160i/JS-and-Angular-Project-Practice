/**
 * Day 20 — The event loop: single thread, microtasks, macrotasks (lesson.js)
 * Open day-20/html/lesson.html or run: node day-20/js/lesson.js
 */
(function day20Lesson() {
  const log = (...args) => console.log(...args);

  /** Wait until after one macrotask (lets prior microtasks + one timer run). */
  function afterMacrotask() {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  (async () => {
    log("=== Day 20 — Event loop & task queues ===\n");

    // Topic 1 — Single-threaded
    log("--- Topic 1: single-threaded JS ---");
    log(
      "JS has ONE call stack — one synchronous statement at a time. Async work is delegated to the runtime (browser Web APIs / Node libuv); when done, callbacks are queued. The event loop runs queued work when the stack is empty."
    );

    // Topic 2 — Runtime architecture (diagram in lesson.html)
    log("\n--- Topic 2: engine + Web APIs + queues (see HTML diagram) ---");

    // Topic 3 — Event loop algorithm
    log("\n--- Topic 3: event loop (simplified) ---");
    log("1) Wait until call stack is empty");
    log("2) Drain ALL microtasks (Promise.then, queueMicrotask, …)");
    log("3) Run ONE macrotask (setTimeout, I/O, …)");
    log("4) Repeat — microtasks always run before the next macrotask.");

    // Topic 4 — Student doc code (verbatim) + same behavior in an isolated tick
    log("\n--- Topic 4: setTimeout(0) vs Promise ---");
    log("(Verbatim from Day 20 student doc — multi-line block comment in lesson.js right below.)");
    /*
     * ----- Topic 4 — from student doc -----
     * console.log("1"); // sync
     * setTimeout(() => console.log("2"), 0); // macrotask
     * Promise.resolve().then(() => console.log("3")); // microtask
     * console.log("4"); // sync
     * // Output: 1, 4, 3, 2
     * //
     * // Step by step:
     * // Sync: "1" → "4" (call stack drains)
     * // Microtasks: "3" (drained before any macrotask)
     * // Macrotasks: "2" (one at a time)
     * //
     * // "3" beats "2" because microtasks have priority.
     * // "2" with delay 0 doesn't mean "now" — it means "queue this as soon as possible
     * // as a macrotask, after sync code AND all microtasks are done".
     */
    log("Runnable demo (same statements; isolated so later topics don't share one event-loop turn):");
    await new Promise((resolve) => {
      console.log("1"); // sync
      setTimeout(() => {
        console.log("2"); // macrotask
        resolve();
      }, 0);
      Promise.resolve().then(() => console.log("3")); // microtask
      console.log("4"); // sync
    });

    // Topic 4 follow-along (expect X, W, Y, Z)
    log("\n--- Topic 4 — follow-along (expect: X, W, Y, Z) ---");
    await new Promise((resolve) => {
      log("X");
      Promise.resolve().then(() => log("Y"));
      setTimeout(() => {
        log("Z");
        resolve();
      }, 0);
      log("W");
    });

    // Topic 5 — Student doc code (verbatim) + runnable isolated
    log("\n--- Topic 5: microtasks vs macrotasks ---");
    log("(Verbatim from Day 20 student doc — multi-line block comment in lesson.js right below.)");
    /*
     * ----- Topic 5 — from student doc (predict before you run) -----
     * // 5 logs — predict the order before you run
     * console.log("A");
     * setTimeout(() => console.log("B"), 0);
     * Promise.resolve()
     *   .then(() => console.log("C"))
     *   .then(() => console.log("D")); // chained: another microtask
     * queueMicrotask(() => console.log("E"));
     * console.log("F");
     * // Output: A, F, C, E, D, B
     * //
     * // 1. Sync: A, F
     * // 2. Microtasks (drained completely):
     * // C → schedules another microtask (D)
     * // E (queueMicrotask registered after the first .then microtask)
     * // Actual order: A, F, C, E, D, B
     * // .then(C) → microtask 1
     * // queueMicrotask(E) → microtask 2 (queued before C runs, runs after C)
     * // C runs, then schedules D
     * // E runs (before D — queued before C appended D)
     * // D runs (queued mid-drain — still drained in this tick)
     * // 3. Macrotask: B
     */
    log("Runnable demo (verbatim statements; isolated):");
    await new Promise((resolve) => {
      console.log("A");
      setTimeout(() => {
        console.log("B");
        resolve();
      }, 0);
      Promise.resolve()
        .then(() => console.log("C"))
        .then(() => console.log("D")); // chained: another microtask
      queueMicrotask(() => console.log("E"));
      console.log("F");
    });

    // Topic 6 — Student doc: blocking + setTimeout(0) (exact 3000ms)
    log("\n--- Topic 6: don't block the loop (verbatim from student doc) ---");
    log("(Full snippet + step-by-step notes in block comment below; runnable code matches the doc.)");
    /*
     * function blocking() {
     *   const t0 = Date.now();
     *   while (Date.now() - t0 < 3000) {} // busy-wait 3 seconds
     *   console.log("done blocking");
     * }
     * setTimeout(() => console.log("timer"), 0);
     * blocking();
     * console.log("after block");
     * // Output:
     * // (3-second pause)
     * // done blocking
     * // after block
     * // timer
     * //
     * // blocking() holds the call stack busy for 3 seconds.
     * // During that time, nothing else can run — not even a setTimeout(0).
     * // The browser tab is FROZEN. Don't write code like this in real apps!
     */
    function blocking() {
      const t0 = Date.now();
      while (Date.now() - t0 < 3000) {
        /* busy-wait 3 seconds */
      }
      console.log("done blocking");
    }
    setTimeout(() => console.log("timer"), 0);
    blocking();
    console.log("after block");
    await afterMacrotask();

    // Topic 7 — Practical implications
    log("\n--- Topic 7: practical implications ---");
    log("• Promise .then chains are microtasks — they run before the next timer.");
    log('• setTimeout(0) means "after current sync work AND after all microtasks", not "immediately".');
    log("• Blocking the call stack freezes timers, UI, and other callbacks until it returns.");
    log("• await continuation scheduling is microtask-based (same family as .then).");

    log("\n=== End Day 20 lesson ===");
  })().catch((e) => console.error(e));
})();
