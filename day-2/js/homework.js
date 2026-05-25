// Day 2 - Variables
// Homework

const fullName = "   Pratham Bankar   ";
const age = 23;
const city = "Madhya Pradesh";

console.log("Full Name (trimmed): " + fullName.trim());
console.log("Upper case: " + fullName.trim().toUpperCase());
console.log("Length: " + fullName.trim().length);
console.log("Includes 'Pratham': " + fullName.includes("Pratham"));

let price = 1000;
let discount = 0.2;
let finalPrice = price - (price * discount);
console.log("Final price after 20% discount: ₹" + finalPrice);
