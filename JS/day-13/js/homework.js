// Day 13 — Homework: predict-the-output snippets (run in console to verify)

const topic1Snippet = `function test() {
  console.log(a); // undefined (var hoisted inside function)
  var a = 2;
  console.log(a); // 2
}
test();`;

const topic2Snippet = `let x = "outer";
{
  // console.log(x); // What happens here? (TDZ)
  let x = "inner";
  console.log(x);
}`;

const topic3Snippet = `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Compare with let i in the same pattern`;

document.querySelector("#topic1Code code").textContent = topic1Snippet;
document.querySelector("#topic2Code code").textContent = topic2Snippet;
document.querySelector("#topic3Code code").textContent = topic3Snippet;

console.log("=== Day 13: Homework (predict output, then run snippets) ===");
