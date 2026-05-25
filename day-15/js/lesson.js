/**
 * Day 15 — The `this` keyword (lesson.js)
 * Open day-15/html/lesson.html or run: node day-15/js/lesson.js
 */
(function day15Lesson() {
  "use strict";

  const log = (...args) => console.log(...args);
  log("=== Day 15 — The `this` keyword ===");

  /**
   * Topic 1 — `this` is chosen at call time (who invoked the function?)
   */
  log("\nTopic 1 — Call time, not definition time");
  function whoAmI() {
    log("Topic 1 — whoAmI() this:", this);
  }
  whoAmI();

  const userPriya = { name: "Priya", whoAmI };
  const userAarav = { name: "Aarav", whoAmI };
  userPriya.whoAmI();
  userAarav.whoAmI();

  /**
   * Topic 2 — Four binding rules: default, implicit, explicit, new
   */
  log("\nTopic 2 — Four binding rules");

  function speak() {
    log("Topic 2 — default binding this:", this);
  }
  speak();

  const car = {
    brand: "Tata",
    show() {
      log("Topic 2 — implicit (method):", this.brand);
    },
  };
  car.show();

  function intro(city) {
    log(`Topic 2 — explicit: ${this.name} from ${city}`);
  }
  const uIntro = { name: "Priya" };
  intro.call(uIntro, "Jaipur");

  function PersonCtor(name) {
    this.name = name;
  }
  const p = new PersonCtor("Anaya");
  log("Topic 2 — new binding:", p.name);

  const obj = {
    n: 7,
    f() {
      return this.n;
    },
  };
  const g = obj.f;
  log("Topic 2 follow-along obj.f():", obj.f());
  try {
    log("Topic 2 follow-along g():", g());
  } catch (e) {
    log("Topic 2 follow-along g():", e.name, "—", e.message);
  }

  /**
   * Topic 3 — call, apply, bind
   */
  log("\nTopic 3 — call / apply / bind");
  function greetCity(city, lang) {
    log(`${this.name} from ${city} speaks ${lang}`);
  }
  const uGreet = { name: "Priya" };
  greetCity.call(uGreet, "Jaipur", "Hindi");
  greetCity.apply(uGreet, ["Jaipur", "Hindi"]);
  const greetPriya = greetCity.bind(uGreet, "Jaipur");
  greetPriya("English");
  greetPriya("Marathi");
  greetPriya.call({ name: "Aarav" }, "Tamil");

  /**
   * Topic 4 — Arrow functions: lexical `this` (no own `this`)
   */
  log("\nTopic 4 — Arrow vs regular on objects");
  const userArrow = {
    name: "Priya",
    regular: function () {
      log("Topic 4 — regular method this.name:", this.name);
    },
    arrow: () => {
      log("Topic 4 — arrow as method this.name:", this && this.name);
    },
  };
  userArrow.regular();
  userArrow.arrow();

  const team = {
    members: ["Priya", "Aarav", "Riya"],
    greetAll() {
      this.members.forEach((m) => {
        log(`Topic 4 — Hi ${m}, team size ${this.members.length}`);
      });
    },
  };
  team.greetAll();

  /**
   * Topic 5 — Classes (same implicit rule on the instance)
   */
  log("\nTopic 5 — `this` in classes");
  class User {
    constructor(name) {
      this.name = name;
    }
    greet() {
      log(`Topic 5 — Hi, I'm ${this.name}`);
    }
  }
  const instA = new User("Priya");
  const instB = new User("Aarav");
  instA.greet();
  instB.greet();
  const greetStripped = instA.greet;
  try {
    greetStripped();
  } catch (e) {
    log("Topic 5 — stripped method:", e.name, e.message);
  }

  /**
   * Topic 6 — Lost `this` and fixes (sync demos)
   */
  log("\nTopic 6 — Lost `this` & fixes");
  class Counter {
    constructor() {
      this.count = 0;
    }
    inc() {
      this.count += 1;
      return this.count;
    }
  }
  const c = new Counter();
  c.inc();
  const incAlone = c.inc;
  try {
    incAlone();
  } catch (e) {
    log("Topic 6 — lost this:", e.name);
  }
  log("Topic 6 — fix bind:", incAlone.bind(c)());
  log("Topic 6 — fix arrow wrapper:", (() => c.inc())());

  class CounterArrow {
    count = 0;
    inc = () => {
      this.count += 1;
      return this.count;
    };
  }
  const ca = new CounterArrow();
  const incArrowLoose = ca.inc;
  log("Topic 6 — class field arrow (safe loose ref):", incArrowLoose());
})();
