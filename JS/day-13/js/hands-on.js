// Day 13 — Hands-on: hoisting and TDZ examples

const topic1Snippet = `// Trace hoisting for var vs let
function demoVar() {
  console.log(a); // undefined
  var a = 10;
  console.log(a); // 10
}

function demoLet() {
  // console.log(b); // ReferenceError in TDZ
  let b = 20;
  console.log(b); // 20
}

demoVar();
demoLet();`;

const topic2Snippet = `// TDZ: two regions in the same block
{
  // console.log(n); // ReferenceError — TDZ for const
  const n = 42;
  console.log(n);
}`;

const topic3Snippet = `// Declaration hoists; assignment does not
console.log(typeof later); // "function" (declaration hoisted)

function later() {}

// const fn = () => {};
// typeof fn in TDZ would throw before const line runs`;

document.querySelector("#topic1Code code").textContent = topic1Snippet;
document.querySelector("#topic2Code code").textContent = topic2Snippet;
document.querySelector("#topic3Code code").textContent = topic3Snippet;

console.log("=== Day 13: Hands-on ===");
