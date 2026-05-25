/**
 * Day 16 — Hands-on (prototypes)
 * Open day-16/html/hands-on.html or run: node day-16/js/hands-on.js
 */

console.log("=== Day 16 — Hands-on ===\n");

// Task 1 — Inspect a prototype
//
// Prototype chain for const arr = [1, 2, 3]:
//   arr  →  Array.prototype  →  Object.prototype  →  null
//
console.log("--- Task 1: Inspect a prototype ---");
const arr = [1, 2, 3];
const arrProto1 = Object.getPrototypeOf(arr);
console.log("Object.getPrototypeOf(arr):", arrProto1);
console.log("That object is Array.prototype:", arrProto1 === Array.prototype);

const arrProto2 = Object.getPrototypeOf(arrProto1);
console.log("Object.getPrototypeOf(Object.getPrototypeOf(arr)):", arrProto2);
console.log("That object is Object.prototype:", arrProto2 === Object.prototype);

const arrProto3 = Object.getPrototypeOf(arrProto2);
console.log("Next step (end of chain):", arrProto3);
console.log("Chain ends at null:", arrProto3 === null);

// Task 2 — Build with Object.create
console.log("\n--- Task 2: Object.create (vehicle → car, bike) ---");
const vehicle = {
  start() {
    console.log(`${this.name} starting`);
  },
};
const car = Object.create(vehicle);
car.name = "Tata Nexon";
const bike = Object.create(vehicle);
bike.name = "Royal Enfield";
car.start();
bike.start();

console.log("car.hasOwnProperty('name'):", car.hasOwnProperty("name"));
console.log("car.hasOwnProperty('start'):", car.hasOwnProperty("start"));
console.log("'name' in car:", "name" in car);
console.log("'start' in car:", "start" in car);

// Task 3 — Constructor function inheritance
console.log("\n--- Task 3: Person → Student ---");
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function () {
  console.log("Hi, I'm " + this.name);
};

function Student(name, school) {
  Person.call(this, name);
  this.school = school;
}
Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;
Student.prototype.study = function () {
  console.log(this.name + " studies at " + this.school);
};

const riya = new Student("Riya", "IIT Delhi");
riya.greet();
riya.study();

// Bonus — hasOwnProperty vs in
//
// Rule: use hasOwnProperty / Object.hasOwn when you care only about keys on the
// object itself; use "in" when you need to know if a property is visible anywhere
// on the prototype chain (including Object.prototype).
//
console.log("\n--- Bonus: hasOwnProperty vs in ---");
const dog = Object.create({ species: "Canis" });
dog.name = "Bruno";
console.log("dog.hasOwnProperty('name'):", dog.hasOwnProperty("name"));
console.log("dog.hasOwnProperty('species'):", dog.hasOwnProperty("species"));
console.log("'name' in dog:", "name" in dog);
console.log("'species' in dog:", "species" in dog);
console.log("'toString' in dog:", "toString" in dog);

console.log("\n=== End Day 16 hands-on ===");
