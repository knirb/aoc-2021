const fs = require("fs");
const data = fs
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split("\n")
  .map((line) => line.split(" | ").map((str) => str.split(" ")));

const digitLengths = [2, 4, 3, 7];
const ans = data.reduce((acc, cur) => {
  const noDigits = cur[1].reduce((acc, cur) => {
    const isDigit = digitLengths.includes(cur.length) ? 1 : 0;
    return acc + isDigit;
  }, 0);
  return acc + noDigits;
}, 0);

console.log(ans);
