const user = {
  name: "priya",
  greet() {
    console.log(this.name);
  },
};

user.greet();
const g = user.greet.bind(user);
g();

class Timer {
  constructor() {
    this.sec = 0;
  }
  tick() {
    this.sec++;
    console.log(this.sec);
  }
}

const t = new Timer();
t.tick();
t.tick();
console.log("Timer (bind): use setInterval(t.tick.bind(t), ms) in real apps");

function describe(role, city) {
  console.log(`${this.name} is a ${role} from ${city}`);
}
const u = { name: "Aarav" };

describe.call(u, "designer", "Jaipur");
describe.apply(u, ["manager", "Delhi"]);
const boundDescribe = describe.bind(u, "developer");
boundDescribe("Bangalore");
