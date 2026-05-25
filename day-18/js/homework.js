/**
 * Day 18 — Homework: wait, chains, race timeout, Promise.any
 * Open day-18/html/homework.html or run: node day-18/js/homework.js
 */

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// 1. Sequential waits (exact pattern from the assignment)
function task1() {
  console.log("\n--- 1. wait(500).then(() => wait(500)).then(() => console.log(\"1s\")) ---");
  return wait(500)
    .then(() => wait(500))
    .then(() => console.log("1s"));
}

// 2. Random success/fail — three sequential .then + .catch
function fetchData(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() >= 0.5;
      if (success) resolve(`Data for ${id}`);
      else reject(new Error(`Failed for ${id}`));
    }, 120);
  });
}

function task2OneRun(label) {
  return fetchData(1)
    .then((data) => {
      console.log(`  ${label} step 1:`, data);
      return fetchData(2);
    })
    .then((data) => {
      console.log(`  ${label} step 2:`, data);
      return fetchData(3);
    })
    .then((data) => {
      console.log(`  ${label} step 3:`, data);
    })
    .catch((err) => {
      console.error(`  ${label} chain stopped:`, err.message);
    });
}

function fetchUser(id, latencyMs = 500) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: "Priya" }), latencyMs);
  });
}

// 3. Timeout via Promise.race (assignment pattern)
function task3FastFetchWins() {
  console.log("\n--- 3a. Promise.race — fetchUser(7) finishes before 2s timeout ---");
  return Promise.race([
    fetchUser(7, 500),
    wait(2000).then(() => Promise.reject(new Error("timeout"))),
  ])
    .then((user) => console.log("  Got user:", user))
    .catch((err) => console.error("  ", err.message));
}

function task3TimeoutWins() {
  console.log("\n--- 3b. Promise.race — slow fetch loses to 2s timeout ---");
  function fetchUserSlow(id) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ id, name: "Priya" }), 3500);
    });
  }
  return Promise.race([
    fetchUserSlow(7),
    wait(2000).then(() => Promise.reject(new Error("timeout"))),
  ])
    .then((user) => console.log("  Got user:", user))
    .catch((err) => console.error("  Expected:", err.message));
}

// 4. Promise.any — first fulfillment wins; rejections ignored until all fail
function flakyFetch(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() >= 0.5) resolve(`${name} success`);
      else reject(new Error(`${name} failed`));
    }, 80);
  });
}

function flakyFixed(name, ms, ok) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (ok) resolve(`${name} OK`);
      else reject(new Error(`${name} fail`));
    }, ms);
  });
}

function task4Deterministic() {
  console.log("\n--- 4a. Promise.any — only API-2 succeeds (deterministic) ---");
  return Promise.any([
    flakyFixed("API-1", 60, false),
    flakyFixed("API-2", 100, true),
    flakyFixed("API-3", 40, false),
  ])
    .then((result) => console.log("  First success:", result))
    .catch((err) => console.log("  All rejected:", err.name, err.message));
}

function task4RandomBatch(label) {
  return Promise.any([flakyFetch("API-1"), flakyFetch("API-2"), flakyFetch("API-3")])
    .then((result) => console.log(`  ${label} first success:`, result))
    .catch((err) => console.log(`  ${label} all failed:`, err.name));
}

(async function runHomework() {
  console.log("=== Day 18 homework ===");

  await task1();

  console.log("\n--- 2. Three .then + .catch — run several times (random 50/50) ---");
  for (let i = 1; i <= 6; i++) {
    console.log(`Run ${i}:`);
    await task2OneRun(`Run-${i}`);
    await wait(30);
  }

  await task3FastFetchWins();
  await task3TimeoutWins();

  await task4Deterministic();
  console.log("\n--- 4b. Promise.any — three random flaky fetches (two batches) ---");
  await task4RandomBatch("Batch A");
  await wait(20);
  await task4RandomBatch("Batch B");

  console.log("\n=== End Day 18 homework ===");
})().catch((e) => console.error(e));
