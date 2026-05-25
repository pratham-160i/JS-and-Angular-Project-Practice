/**
 * Day 17 — ES6 class syntax (lesson.js)
 * Open day-17/html/lesson.html or run: node day-17/js/lesson.js
 */
(function day17Lesson() {
  const log = (...args) => console.log(...args);

  log("=== Day 17 — ES6 classes ===\n");

  // Topic 1 — Class syntax basics
  log("--- Topic 1: class User — constructor + methods ---");
  {
    class User {
      constructor(name, city) {
        this.name = name;
        this.city = city;
      }
      greet() {
        log(`Hi, I'm ${this.name} from ${this.city}`);
      }
    }
    const instA = new User("Priya", "Jaipur");
    const instB = new User("Aarav", "Mumbai");
    instA.greet();
    instB.greet();
    log("typeof User:", typeof User);
    log("instA.greet === instB.greet:", instA.greet === instB.greet);
    log("Object.getPrototypeOf(instA) === User.prototype:", Object.getPrototypeOf(instA) === User.prototype);
  }

  // Topic 2 — Getters and setters
  log("\n--- Topic 2: Product — getters / setters ---");
  class Product {
    constructor(name, priceInPaise) {
      this.name = name;
      this._priceInPaise = priceInPaise;
    }
    get priceInRupees() {
      return this._priceInPaise / 100;
    }
    set priceInRupees(rupees) {
      if (rupees < 0) throw new Error("Price cannot be negative");
      this._priceInPaise = rupees * 100;
    }
    get priceWithGST() {
      return this.priceInRupees * 1.18;
    }
  }
  const p = new Product("Notebook", 5000);
  log("p.priceInRupees (getter):", p.priceInRupees);
  log("p.priceWithGST:", p.priceWithGST);
  p.priceInRupees = 100;
  log("after p.priceInRupees = 100:", p.priceInRupees);

  log("\n--- Topic 2 — follow-along (°C → °F via getter) ---");
  class T {
    constructor(c) {
      this._c = c;
    }
    get f() {
      return (this._c * 9) / 5 + 32;
    }
  }
  const t = new T(100);
  log("t.f (100°C in °F):", t.f, "← prints 212");

  // Topic 3 — extends and super
  log("\n--- Topic 3: Animal / Dog — extends & super ---");
  class Animal {
    constructor(name) {
      this.name = name;
    }
    speak() {
      log(`${this.name} makes a sound`);
    }
  }
  class Dog extends Animal {
    constructor(name, breed) {
      super(name);
      this.breed = breed;
    }
    speak() {
      super.speak();
      log(`${this.name} barks!`);
    }
  }
  const d = new Dog("Bruno", "Labrador");
  d.speak();
  log("d instanceof Dog:", d instanceof Dog);
  log("d instanceof Animal:", d instanceof Animal);

  // Topic 4 — static methods (separate block: another `User` in the doc)
  log("\n--- Topic 4: static methods ---");
  class MathUtils {
    static gst(amount, rate = 18) {
      return amount * (rate / 100);
    }
    static format(amount) {
      return `₹${amount.toFixed(2)}`;
    }
  }
  log("MathUtils.gst(1000):", MathUtils.gst(1000));
  log("MathUtils.format(1180):", MathUtils.format(1180));

  {
    class User {
      constructor(name) {
        this.name = name;
      }
      static fromEmail(email) {
        const name = email.split("@")[0];
        return new User(name);
      }
    }
    const u = User.fromEmail("priya@example.com");
    log("User.fromEmail('priya@example.com').name:", u.name);
  }

  // Topic 5 — private fields #
  log("\n--- Topic 5: BankAccount — private fields ---");
  class BankAccount {
    #balance;
    #transactions = [];
    constructor(initial) {
      this.#balance = initial;
    }
    deposit(amt) {
      this.#balance += amt;
      this.#transactions.push({ type: "deposit", amt });
    }
    withdraw(amt) {
      if (amt > this.#balance) throw new Error("Insufficient funds");
      this.#balance -= amt;
      this.#transactions.push({ type: "withdraw", amt });
    }
    get balance() {
      return this.#balance;
    }
    get history() {
      return [...this.#transactions];
    }
  }
  const acc = new BankAccount(1000);
  acc.deposit(500);
  acc.withdraw(200);
  log("acc.balance:", acc.balance);
  log("acc.history:", acc.history);

  // Topic 6 — custom errors
  log("\n--- Topic 6: Custom Error classes ---");
  class AppError extends Error {
    constructor(message, code) {
      super(message);
      this.name = this.constructor.name;
      this.code = code;
    }
  }
  class ValidationError extends AppError {
    constructor(field, message) {
      super(message, "VALIDATION_FAILED");
      this.field = field;
    }
  }
  class NotFoundError extends AppError {
    constructor(resource) {
      super(`${resource} not found`, "NOT_FOUND");
    }
  }
  function validateAge(age) {
    if (age < 0) throw new ValidationError("age", "Must be non-negative");
    if (age > 150) throw new ValidationError("age", "Must be under 150");
  }
  try {
    validateAge(-5);
  } catch (e) {
    if (e instanceof ValidationError) {
      log(`[${e.code}] ${e.field}: ${e.message}`);
    }
  }
  log("NotFoundError example:", new NotFoundError("User").message);

  // Topic 7 — classes are sugar (legacy vs class in separate scopes)
  log("\n--- Topic 7: classes are sugar ---");
  {
    function Person(name) {
      this.name = name;
    }
    Person.prototype.greet = function () {
      log("(pre-ES6) Person:", this.name);
    };
    const legacy = new Person("Legacy Pat");
    legacy.greet();
  }
  {
    class Person {
      constructor(name) {
        this.name = name;
      }
      greet() {
        log("(ES6 class) Person:", this.name);
      }
    }
    const modern = new Person("Modern Pat");
    modern.greet();
  }

  log("\n=== End Day 17 lesson ===");
})();
