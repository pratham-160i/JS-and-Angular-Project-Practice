/**
 * Day 19 — async / await (lesson.js)
 * Open day-19/html/lesson.html or run: node day-19/js/lesson.js
 */
(function day19Lesson() {
  const log = (...args) => console.log(...args);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function fetchUser(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id < 0) reject(new Error("Bad id"));
        else resolve({ id, name: "Priya" });
      }, 250);
    });
  }

  function fetchProduct(id) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ id, price: 100 }), 350);
    });
  }

  (async () => {
    log("=== Day 19 — async / await ===\n");

    // Topic 1 — async always returns a Promise
    log("--- Topic 1: async returns a Promise (even for plain return) ---");
    async function greet() {
      return "Namaste";
    }
    const result = greet();
    log("greet() is a Promise:", result);
    await result.then((msg) => log("via .then:", msg));

    function greetOld() {
      return Promise.resolve("Namaste");
    }
    log("greetOld() same idea:", greetOld());

    // Topic 2 — await pauses this async function only
    log("\n--- Topic 2: .then style vs async/await ---");
    function withThen() {
      fetchUser(7).then((user) => {
        log("withThen got:", user);
      });
    }
    withThen();
    await delay(300);

    async function withAwait() {
      const user = await fetchUser(7);
      log("withAwait got:", user);
    }
    await withAwait();

    log("\n--- Topic 2 — follow-along: f() vs await f() ---");
    async function f() {
      return 1;
    }
    log("console.log(f())  → Promise (pending then resolving to 1):", f());
    log("await f()         → plain value:", await f());
    // First logs Promise object; second logs 1 after microtask/unwind

    // Topic 3 — try / catch / finally
    log("\n--- Topic 3: try / catch / finally ---");
    async function showUser(id) {
      try {
        const user = await fetchUser(id);
        log("showUser got:", user);
      } catch (err) {
        console.error("showUser failed:", err.message);
      } finally {
        log("showUser done (finally)");
      }
    }
    await showUser(7);
    await showUser(-1);

    // Topic 4 — sequential vs parallel
    log("\n--- Topic 4: sequential vs parallel ---");
    async function slowSequential() {
      const t0 = Date.now();
      const a = await fetchProduct(1);
      const b = await fetchProduct(2);
      const c = await fetchProduct(3);
      log("slow (sequential) ms:", Date.now() - t0, { a, b, c });
    }
    await slowSequential();

    async function fastParallel() {
      const t0 = Date.now();
      const [a, b, c] = await Promise.all([
        fetchProduct(1),
        fetchProduct(2),
        fetchProduct(3),
      ]);
      log("fast (Promise.all) ms:", Date.now() - t0, { a, b, c });
    }
    await fastParallel();
    log("(Use sequential only when the next step depends on the previous; else Promise.all.)");

    // Topic 5 — forEach trap
    log("\n--- Topic 5: forEach ignores returned Promises ---");
    const ids = [1, 2, 3];

    async function bugForEach() {
      log("BUG forEach — start");
      ids.forEach(async (id) => {
        const p = await fetchProduct(id);
        log("  got", p);
      });
      log("BUG forEach — end (often BEFORE any 'got')");
    }
    await bugForEach();
    await delay(400);

    async function fixSequential() {
      log("FIX for...of — start");
      for (const id of ids) {
        const p = await fetchProduct(id);
        log("  got", p);
      }
      log("FIX for...of — end (after all 'got')");
    }
    await fixSequential();

    async function fixParallel() {
      log("FIX Promise.all + map — start");
      const results = await Promise.all(ids.map((id) => fetchProduct(id)));
      results.forEach((p) => log("  got", p));
      log("FIX Promise.all + map — end");
    }
    await fixParallel();

    // Topic 6 — top-level await (ES modules) vs IIFE in classic scripts
    log("\n--- Topic 6: top-level await ---");
    log(
      "In ES modules (type=\"module\" or .mjs), you may use top-level await. In a classic script, wrap in an async IIFE."
    );
    async function mockFetchConfig() {
      await delay(80);
      return { theme: "dark", region: "IN" };
    }
    await (async () => {
      const config = await mockFetchConfig();
      log("IIFE + await (like top-level await in modules):", config);
    })();

    // Topic 7 — mixing async with .then for callers
    log("\n--- Topic 7: mixing with .then ---");
    async function getUserName(id) {
      const user = await fetchUser(id);
      return user.name;
    }
    getUserName(7).then((name) => log("via .then:", name));
    await delay(300);
    await (async () => {
      const name = await getUserName(7);
      log("via await inside IIFE:", name);
    })();

    log("\n=== End Day 19 lesson ===");
  })().catch((e) => console.error(e));
})();
