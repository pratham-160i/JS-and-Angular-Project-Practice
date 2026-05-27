/**
 * Day 22 — Map, Set, WeakMap & WeakSet (lesson.js)
 * Open day-22/html/lesson.html or run: node day-22/js/lesson.js
 */
(function day22Lesson() {
  const log = (...args) => console.log(...args);

  log("=== Day 22 — Map, Set & weak collections ===\n");

  // Topic 1 — Map: any key type, insertion order, size, iteration
  log("--- Topic 1: Map — better keyed storage ---");
  const m = new Map();
  m.set("name", "Priya");
  m.set(42, "the answer");
  m.set(true, "a boolean key");
  const userObj = { id: 1 };
  m.set(userObj, "value associated with userObj");
  log('m.get("name"):', m.get("name"));
  log("m.get(userObj):", m.get(userObj));
  log("m.size:", m.size);
  log("m.has(42):", m.has(42));
  m.delete(42);

  const m2 = new Map([
    ["a", 1],
    ["b", 2],
  ]);
  log('m2.get("a"):', m2.get("a"));
  log("for...of m2 (insertion order):");
  for (const [key, value] of m2) {
    log(" ", key, value);
  }

  // Topic 2 — Object ↔ Map, iteration helpers, forEach (value, key)
  log("\n--- Topic 2: Object ↔ Map ---");
  const obj = { name: "Priya", city: "Jaipur" };
  const mapFromObj = new Map(Object.entries(obj));
  log('map.get("name"):', mapFromObj.get("name"));
  const back = Object.fromEntries(mapFromObj);
  log("Object.fromEntries(map):", back);

  log("map.forEach — note: (value, key) order:");
  mapFromObj.forEach((value, key) => log(`  ${key} = ${value}`));

  log("\n--- Topic 2 — follow-along: two object literals as keys ---");
  const mFollow = new Map();
  const k1 = { id: 1 };
  const k2 = { id: 1 };
  mFollow.set(k1, "a");
  mFollow.set(k2, "b");
  log("m.size (different object identities):", mFollow.size, "← 2");

  // Topic 3 — Set: unique values, dedup, object identity
  log("\n--- Topic 3: Set — unique values ---");
  const s = new Set();
  s.add("a");
  s.add("b");
  s.add("a");
  log("s.size after duplicate add:", s.size);
  log('s.has("a"):', s.has("a"));
  s.delete("b");

  const tags = new Set(["js", "react", "js", "node", "react"]);
  log("tags.size (deduped):", tags.size);

  const arr = [1, 2, 2, 3, 4, 4, 5];
  const uniq = [...new Set(arr)];
  log("[...new Set(arr)]:", uniq);

  log("iterate tags:");
  for (const v of tags) log(" ", v);

  const setObj = new Set();
  setObj.add({ id: 1 });
  setObj.add({ id: 1 });
  log("Set of two distinct { id: 1 } objects — size:", setObj.size);

  // Topic 4 — Set operations: union, intersection, difference
  log("\n--- Topic 4: Set operations ---");
  const a = new Set([1, 2, 3]);
  const b = new Set([2, 3, 4]);
  const union = new Set([...a, ...b]);
  log("union:", [...union]);
  const inter = new Set([...a].filter((x) => b.has(x)));
  log("intersection:", [...inter]);
  const diff = new Set([...a].filter((x) => !b.has(x)));
  log("difference A − B:", [...diff]);
  log("(ES2025+ Set.prototype.union / intersection / difference where supported.)");

  // Topic 5 — When to use which + practical snippets
  log("\n--- Topic 5: when to use Object / Array / Map / Set ---");
  function doFetch(req) {
    return { ok: true, id: req.id };
  }
  const cache = new Map();
  function fetchWithCache(req) {
    if (cache.has(req)) return cache.get(req);
    const result = doFetch(req);
    cache.set(req, result);
    return result;
  }
  const req = { id: 7 };
  log("fetchWithCache first call:", fetchWithCache(req));
  log("fetchWithCache second (cached):", fetchWithCache(req));

  const posts = [
    { tags: ["js", "react"] },
    { tags: ["node", "js", "react"] },
  ];
  const allTags = new Set();
  posts.forEach((p) => p.tags.forEach((t) => allTags.add(t)));
  log("allTags from posts:", [...allTags]);

  // Topic 6 — WeakMap & WeakSet
  log("\n--- Topic 6: WeakMap & WeakSet ---");
  const wm = new WeakMap();
  let user = { id: 1, name: "Priya" };
  wm.set(user, { lastSeen: Date.now() });
  log("WeakMap get(user):", wm.get(user));
  user = null;
  log("(After user = null, entry is eligible for GC — not directly observable.)");

  const dataForElement = new WeakMap();
  function attachData(el, data) {
    dataForElement.set(el, data);
  }
  log("Pattern: attachData(el, data) for per-node metadata without leaking DOM refs.");

  const seen = new WeakSet();
  function process(item) {
    if (seen.has(item)) return "skip";
    seen.add(item);
    return "work";
  }
  const item = {};
  log("WeakSet process same object twice:", process(item), "|", process(item));

  log("\n=== End Day 22 lesson ===");
})();
