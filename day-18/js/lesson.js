/**
 * Day 18 — Sync vs async, callbacks, Promises (lesson.js)
 * Open day-18/html/lesson.html or run: node day-18/js/lesson.js
 *
 * Uses an async runner + short delays so console output stays in teaching order.
 */
(function day18Lesson() {
  const log = (...args) => console.log(...args);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  (async () => {
    log("=== Day 18 — Sync, callbacks & Promises ===\n");

    // Topic 1 — Sync vs async
    log("--- Topic 1: synchronous (top to bottom) ---");
    log("1");
    log("2");
    log("3");
    // → 1, 2, 3

    log("\n--- Topic 1: asynchronous (setTimeout — JS does not wait) ---");
    log("1");
    setTimeout(() => log("2"), 0);
    log("3");
    // → 1, 3, 2 — "2" runs after sync code, via the event loop
    await delay(30);

    // Topic 2 — Callbacks (Node-style err, data)
    log("\n--- Topic 2: callbacks ---");
    function fetchUserCb(id, callback) {
      log(`Fetching user ${id}...`);
      setTimeout(() => {
        const user = { id, name: "Priya" };
        callback(null, user);
      }, 400);
    }
    await new Promise((resolve) => {
      fetchUserCb(7, (err, user) => {
        if (err) {
          console.error("Failed:", err);
          resolve();
          return;
        }
        log("Got user:", user);
        resolve();
      });
    });

    // Topic 3 — Callback hell (pyramid of doom)
    log("\n--- Topic 3: callback hell (why Promises exist) ---");
    function fetchOrdersCb(userId, callback) {
      setTimeout(() => {
        if (userId < 0) callback(new Error("bad user"));
        else callback(null, [{ id: 101, userId }]);
      }, 80);
    }
    function fetchItemsCb(orderId, callback) {
      setTimeout(() => {
        callback(null, [{ sku: "A1", orderId }]);
      }, 80);
    }
    await new Promise((resolve) => {
      fetchUserCb(7, (err, user) => {
        if (err) {
          log(err);
          resolve();
          return;
        }
        fetchOrdersCb(user.id, (err2, orders) => {
          if (err2) {
            log(err2);
            resolve();
            return;
          }
          fetchItemsCb(orders[0].id, (err3, items) => {
            if (err3) {
              log(err3);
              resolve();
              return;
            }
            log("Nested result (items):", items);
            log("(Problems: deep indent, repeated error handling, hard to extend.)");
            resolve();
          });
        });
      });
    });

    // Topic 4 — Promise states + delay helper + follow-along
    log("\n--- Topic 4: Promise states (pending → fulfilled / rejected) ---");
    const settled = new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = true;
        if (success) resolve("Done!");
        else reject(new Error("Oops"));
      }, 200);
    });
    settled.then((msg) => log("Promise settled with:", msg));

    function delayLesson(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
    await delayLesson(250);
    await delayLesson(500).then(() => log("delay(500): half a second passed (doc pattern)"));

    log("\n--- Topic 4 — follow-along: log promise, then value ---");
    const pFollow = new Promise((res) => {
      setTimeout(() => res(42), 100);
    });
    log("Right after creating promise, p is pending:", pFollow);
    pFollow.then((v) => log("After ~100ms, .then receives:", v));
    // First line runs immediately (Promise object); 42 logs when timer fires
    await delay(150);

    // Topic 5 — .then / .catch / .finally
    log("\n--- Topic 5: .then / .catch / .finally ---");
    function fetchUserPromise(id) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (id < 0) reject(new Error("Bad id"));
          else resolve({ id, name: "Priya" });
        }, 300);
      });
    }
    await fetchUserPromise(7)
      .then((user) => {
        log("got user:", user);
        return user.id;
      })
      .then((id) => {
        return fetchUserPromise(id + 1);
      })
      .then((nextUser) => {
        log("next user:", nextUser);
      })
      .catch((err) => {
        console.error("any failure caught here:", err.message);
      })
      .finally(() => {
        log("done — runs whether success or fail (Topic 5 chain)");
      });

    await delay(50);

    // Topic 6 — Promise combinators (no real network — stubs so Node runs offline)
    log("\n--- Topic 6: Promise combinators ---");
    const mockFetch = (label, ms, shouldReject = false) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (shouldReject) reject(new Error(`${label} failed`));
          else resolve({ label });
        }, ms);
      });

    const p1 = mockFetch("/user", 120);
    const p2 = mockFetch("/orders", 80);
    const p3 = mockFetch("/items", 100);

    try {
      const all = await Promise.all([p1, p2, p3]);
      log("Promise.all — all done:", all);
    } catch (e) {
      console.error("Promise.all catch:", e.message);
    }

    const p4 = mockFetch("a", 40);
    const p5 = mockFetch("b", 60);
    const p6 = mockFetch("c", 50);
    const settledAll = await Promise.allSettled([p4, p5, p6]);
    settledAll.forEach((r) => {
      if (r.status === "fulfilled") log("allSettled ok:", r.value);
      else log("allSettled fail:", r.reason);
    });

    const raceWinner = await Promise.race([
      mockFetch("slow", 5000),
      delayLesson(200).then(() => "timeout wins first"),
    ]);
    log("Promise.race (timeout pattern):", raceWinner);

    try {
      const anyWinner = await Promise.any([
        Promise.reject(new Error("x")),
        delayLesson(60).then(() => ({ ok: true })),
        delayLesson(100).then(() => ({ ok: false })),
      ]);
      log("Promise.any — first fulfillment:", anyWinner);
    } catch (e) {
      console.error("Promise.any all rejected:", e.name);
    }

    // Topic 7 — Promise.resolve / Promise.reject + cache-or-fetch pattern
    log("\n--- Topic 7: Promise.resolve / Promise.reject ---");
    const cached = Promise.resolve({ id: 1, name: "Priya" });
    cached.then((u) => log("Promise.resolve cached user:", u));

    const failed = Promise.reject(new Error("nope"));
    failed.catch((e) => log("Promise.reject caught:", e.message));

    function getUser(id, cache) {
      if (cache[id]) return Promise.resolve(cache[id]);
      return fetchUserPromise(id);
    }
    const cache = { 7: { id: 7, name: "Cached Priya" } };
    const fromCache = await getUser(7, cache);
    log("getUser with cache (instant Promise.resolve path):", fromCache);

    log("\n=== End Day 18 lesson ===");
  })().catch((e) => console.error(e));
})();
