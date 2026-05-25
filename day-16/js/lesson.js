/**
 * Day 16 — Prototypes & the prototype chain (lesson.js)
 * Open day-16/html/lesson.html or run: node day-16/js/lesson.js
 */
(function day16Lesson() {
  const log = (...args) => console.log(...args);

  log("=== Day 16 — Prototypes & prototype chain ===");

  /**
   * Topic 1 — [[Prototype]], Object.prototype, end of chain is null
   */
  log("\nTopic 1 — Every object has a prototype");
  const lessonUser = { name: "Priya" };
  log(
    "Object.getPrototypeOf(lessonUser) === Object.prototype:",
    Object.getPrototypeOf(lessonUser) === Object.prototype
  );
  log("lessonUser.toString():", lessonUser.toString());
  log(
    "Object.prototype has own toString:",
    Object.prototype.hasOwnProperty("toString")
  );
  log("End of chain:", Object.getPrototypeOf(Object.prototype));

  /**
   * Topic 2 — Object.create
   */
  log("\nTopic 2 — Object.create(proto)");
  const animal = {
    eat() {
      log(`${this.name} is eating`);
    },
    sleep() {
      log(`${this.name} is sleeping`);
    },
  };
  const dog = Object.create(animal);
  dog.name = "Bruno";
  dog.eat();
  dog.sleep();
  log("Object.getPrototypeOf(dog) === animal:", Object.getPrototypeOf(dog) === animal);
  log("dog has own name:", dog.hasOwnProperty("name"));
  log("dog has own eat:", dog.hasOwnProperty("eat"));

  log("\nTopic 2 — follow-along");
  const protoA = { x: 1 };
  const objB = Object.create(protoA);
  objB.y = 2;
  log("b.x:", objB.x);
  log("b.y:", objB.y);
  log('b.hasOwnProperty("x"):', objB.hasOwnProperty("x"));

  /**
   * Topic 3 — Prototype chain reads walk up; writes create own properties (shadowing)
   */
  log("\nTopic 3 — Read walks up; write creates own");
  const grandparent = { lastName: "Sharma" };
  const parent = Object.create(grandparent);
  parent.firstName = "Priya";
  const child = Object.create(parent);
  child.age = 5;
  log("child.age:", child.age);
  log("child.firstName (from parent):", child.firstName);
  log("child.lastName (from grandparent):", child.lastName);
  log("typeof child.toString:", typeof child.toString);

  child.firstName = "Anaya";
  log("After child.firstName = 'Anaya' — child.firstName:", child.firstName);
  log("parent.firstName unchanged:", parent.firstName);

  /**
   * Topic 4 — hasOwnProperty vs in vs Object.hasOwn
   */
  log("\nTopic 4 — hasOwnProperty / in / Object.hasOwn");
  const creature = { eat() {} };
  const pup = Object.create(creature);
  pup.bark = () => log("woof");
  log("pup.hasOwnProperty('bark'):", pup.hasOwnProperty("bark"));
  log("pup.hasOwnProperty('eat'):", pup.hasOwnProperty("eat"));
  log('"bark" in pup:', "bark" in pup);
  log('"eat" in pup:', "eat" in pup);
  log('"toString" in pup:', "toString" in pup);
  if (typeof Object.hasOwn === "function") {
    log("Object.hasOwn(pup, 'eat'):", Object.hasOwn(pup, "eat"));
  }

  /**
   * Topic 5 — Constructor functions + prototype + inheritance (classic pattern)
   */
  log("\nTopic 5 — Constructor + .prototype (pre-ES6 pattern)");

  function User(name, city) {
    this.name = name;
    this.city = city;
  }
  User.prototype.greet = function () {
    log(`Hi, I'm ${this.name} from ${this.city}`);
  };

  const instA = new User("Priya", "Jaipur");
  const instB = new User("Aarav", "Mumbai");
  instA.greet();
  instB.greet();
  log("Same greet function on instances:", instA.greet === instB.greet);
  log(
    "Object.getPrototypeOf(instA) === User.prototype:",
    Object.getPrototypeOf(instA) === User.prototype
  );

  function Admin(name, city, level) {
    User.call(this, name, city);
    this.level = level;
  }
  Admin.prototype = Object.create(User.prototype);
  Admin.prototype.constructor = Admin;
  Admin.prototype.power = function () {
    log(`${this.name} has level ${this.level}`);
  };

  const ad = new Admin("Riya", "Bangalore", 5);
  ad.greet();
  ad.power();

  /**
   * Topic 6 — Do not modify built-in prototypes (explanation + safe utility)
   */
  log("\nTopic 6 — Avoid Array.prototype pollution");
  log(
    "Do NOT add Array.prototype.last in shared code — collides with future spec, affects all arrays, confuses iteration."
  );
  const fruits = ["apple", "mango", "banana"];
  function last(arr) {
    return arr[arr.length - 1];
  }
  log("Safe helper last(fruits):", last(fruits));
})();
