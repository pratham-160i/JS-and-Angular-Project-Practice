function multiplier(factor) {

    return function(number) {
        return number * factor;
    };

}

const double = multiplier(2);
const triple = multiplier(3);


console.log((double(5)))
console.log((triple(3)))

//2
for(let v of [12,20,13]) {
    setTimeout(() => {
        console.log(v)
    },1000)
}

function createAccount(intial) {
    let bal = intial;
    let transCount = 0;
    return {
        deposit(amt) {
            bal += amt
            transCount++;
        },
        withdraw(amt) {
            bal -= amt
            transCount++;
        },
        getBalance() {
            return bal
        },
        getCount() {
            return transCount
        }
    }
} 

const acc = createAccount(1000)
acc.deposit(500)
acc.withdraw(300)
console.log(acc.getBalance())
console.log(acc.transCount())