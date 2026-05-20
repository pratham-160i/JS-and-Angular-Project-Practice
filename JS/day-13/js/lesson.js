// Day 13 — Hoisting and TDZ: lesson snippets

const topic1Snippet = `// var declarations are hoisted (initialized as undefined)
console.log(x); // undefined (not ReferenceError)
var x = 1;
console.log(x); // 1`;

const topic2Snippet = `// let / const exist in the "temporal dead zone" before their line
// console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 2;
console.log(y); // 2`;

const topic3Snippet = `// Function declaration: fully hoisted
greet(); // "hi" — works

function greet() {
  console.log("hi");
}

// Function expression: behaves like let/const assignment
// say(); // ReferenceError (TDZ) if using let
const say = function () {
  console.log("there");
};
say(); // "there"`;

document.querySelector("#topic1Code code").textContent = topic1Snippet;
document.querySelector("#topic2Code code").textContent = topic2Snippet;
document.querySelector("#topic3Code code").textContent = topic3Snippet;

console.log("=== Day 13: Hoisting and TDZ (lesson) ===");
