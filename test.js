// // function callbackFunction(name) {
// //     console.log('Hello ' + name);
// //   }

// //   function outerFunction(callback) {
// //     let name = console.log('Please enter your name.');
// //     callback(name);
// //   }

// //   outerFunction(callbackFunction);
// test = 'test';
// console.log(test);

let operations = ['++X', '++X', 'X++'];

let val = 0;
// operations.map((v) => {
for (let i = 0; i < operations.length; i++) {
  if (operations[i].includes('++')) {
    val += 1;
  } else {
    val -= 1;
  }
}

// });

console.log(val);
