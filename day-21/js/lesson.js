/**
 * Day 21 — Clones, immutability, destructuring, optional chaining (lesson.js)
 * Open day-21/html/lesson.html or run: node day-21/js/lesson.js
 */
(function day21Lesson() {
  const log = (...args) => console.log(...args);

  log("=== Day 21 — Structured data & immutable patterns ===\n");

  // Topic 1 — Shallow vs deep clone
  log("--- Topic 1: shallow vs deep clone ---");
  {
    const original = {
      name: "Priya",
      address: { city: "Jaipur", pin: 302001 },
      hobbies: ["reading", "trekking"],
    };
    const a = { ...original };
    const b = Object.assign({}, original);
    const c = JSON.parse(JSON.stringify(original));

    a.address.city = "Mumbai";
    log("after mutating shallow clone `a.address.city`:");
    log("  original.address.city:", original.address.city);
    log("  a.address === original.address:", a.address === original.address);

    c.address.city = "Delhi";
    log("after mutating JSON clone `c.address.city` to Delhi:");
    log("  original.address.city:", original.address.city);

    const tricky = { d: new Date(), m: new Map([[1, "a"]]), u: undefined };
    log("JSON clone loses Date/Map/undefined shape:", JSON.parse(JSON.stringify(tricky)));
  }

  // Topic 2 — structuredClone
  log("\n--- Topic 2: structuredClone ---");
  {
    const original = {
      name: "Priya",
      date: new Date(2026, 0, 1),
      nested: { city: "Jaipur" },
      scores: new Map([["math", 90]]),
    };
    const copy = structuredClone(original);
    copy.nested.city = "Mumbai";
    log("original.nested.city (unchanged):", original.nested.city);
    log("copy.date instanceof Date:", copy.date instanceof Date);
    log("copy.scores instanceof Map:", copy.scores instanceof Map);

    try {
      structuredClone({ fn: () => {} });
    } catch (e) {
      log("structuredClone({ fn }) →", e.name, "(functions not cloneable)");
    }

    log("\n--- Topic 2 — follow-along ---");
    const o = { x: { y: 1 } };
    const shallow = { ...o };
    shallow.x.y = 99;
    log("after shallow spread: o.x.y (mutated):", o.x.y);

    const deep = structuredClone(o);
    deep.x.y = 50;
    log("after structuredClone copy then b.x.y = 50 → o.x.y (still 99 from shallow step, not 50):", o.x.y);
  }

  // Topic 3 — Object.freeze & deepFreeze
  log("\n--- Topic 3: Object.freeze ---");
  {
    const config = Object.freeze({
      host: "api.example.com",
      port: 8080,
      retries: 3,
    });
    config.port = 9000;
    log("config.port (freeze top-level):", config.port);

    const userFrozen = Object.freeze({
      name: "Priya",
      address: { city: "Jaipur" },
    });
    userFrozen.name = "Anaya";
    userFrozen.address.city = "Mumbai";
    log("frozen user name (ignored):", userFrozen.name);
    log("frozen nested address.city (still mutable on shallow freeze):", userFrozen.address.city);

    function deepFreeze(obj) {
      Object.values(obj).forEach((v) => {
        if (v && typeof v === "object" && !Object.isFrozen(v)) deepFreeze(v);
      });
      return Object.freeze(obj);
    }
    const fully = deepFreeze({ a: 1, n: { x: 2 } });
    try {
      fully.n.x = 99;
    } catch (e) {
      log("assign to deep-frozen nested field:", e.name);
    }
    log("fully.n.x:", fully.n.x);
  }

  // Topic 4 — Immutable updates
  log("\n--- Topic 4: immutable updates ---");
  {
    const user = {
      name: "Priya",
      age: 25,
      address: { city: "Jaipur", pin: 302001 },
      hobbies: ["reading", "trekking"],
    };
    const u1 = { ...user, age: 26 };
    log("u1.age, user.age:", u1.age, user.age);

    const u2 = {
      ...user,
      address: { ...user.address, city: "Mumbai" },
    };
    log("u2.address.city, user.address.city:", u2.address.city, user.address.city);

    const u3 = { ...user, hobbies: [...user.hobbies, "swimming"] };
    log("u3.hobbies:", u3.hobbies);
    log("user.hobbies:", user.hobbies);

    const u4 = { ...user, hobbies: user.hobbies.filter((h) => h !== "trekking") };
    log("u4.hobbies:", u4.hobbies);

    const tasks = [
      { id: 1, done: false },
      { id: 2, done: false },
    ];
    const t1 = tasks.map((t) => (t.id === 1 ? { ...t, done: true } : t));
    log("t1[0].done, tasks[0].done:", t1[0].done, tasks[0].done);
  }

  // Topic 5 — Advanced destructuring
  log("\n--- Topic 5: advanced destructuring ---");
  {
    const { name, role = "user" } = { name: "Priya" };
    log("defaults:", name, role);

    const { name: userName, role: userRole = "user" } = { name: "Aarav" };
    log("rename:", userName, userRole);

    const cfg = {
      api: { host: "api.example.com", port: 8080 },
      db: { host: "db.example.com", port: 5432 },
    };
    const {
      api: { host: apiHost, port: apiPort },
    } = cfg;
    log("nested:", apiHost, apiPort);

    const [first = "?", second = "?", ...rest] = [1, 2, 3, 4, 5];
    log("array + rest:", first, second, rest);

    function Card({ title, subtitle = "—", actions = [] }) {
      log("Card:", title, subtitle, actions);
    }
    Card({ title: "Hello", actions: ["delete"] });
  }

  // Topic 6 — Computed keys
  log("\n--- Topic 6: computed property keys ---");
  {
    const field = "city";
    const value = "Mumbai";
    const stat = { city: "Jaipur" };
    const dyn = { [field]: value };
    log("static:", stat);
    log("computed:", dyn);

    function updateField(obj, key, val) {
      return { ...obj, [key]: val };
    }
    const userU = { name: "Priya", age: 25 };
    log(updateField(userU, "age", 26));
    log(updateField(userU, "city", "Jaipur"));
  }

  // Topic 7 — Optional chaining + nullish coalescing
  log("\n--- Topic 7: ?. and ?? ---");
  {
    const response = {
      user: {
        name: "Priya",
        profile: {
          bio: null,
        },
      },
    };
    const city = response?.user?.profile?.city;
    log("city (missing):", city);
    const cityOrDefault = response?.user?.profile?.city ?? "Unknown";
    log("city ?? fallback:", cityOrDefault);
    const upper = response?.user?.name?.toUpperCase?.();
    log("optional method call:", upper);
    const firstTag = response?.user?.tags?.[0] ?? "no tags";
    log("tags?.[0] ?? :", firstTag);
  }

  log("\n=== End Day 21 lesson ===");
})();
