// function makeCounter() {
//     let count = 0;
//     return function () {
//         count++;
//         return count;
//     }
// }

// const cnt1 = makeCounter();
// const cnt2 = makeCounter();

// console.log(cnt1());
// console.log(cnt1());


// console.log(cnt2());
// console.log(cnt2());

// console.log(cnt1())


// for (let i = 1; i <= 3; i++) {
//      setTimeout(() =>
//     console.log(i), 100); 
// }

function createAccount(intial) {
    let balance = intial;
    return {
     deposit(amount) {
         balance += amount
    },
     withdraw(amount) {
         balance -= amount
    },
     getBalance(amount) {
       return balance
    }
}
}

const acc = createAccount(1000)
acc.deposit(500)
acc.withdraw(200)

console.log(acc.getBalance())



