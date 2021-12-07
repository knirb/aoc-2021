const fs = require("fs");

const data = fs
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split(",")
  .map((str) => parseInt(str));

const median = data.sort((a, b) => (a > b ? 1 : -1))[data.length / 2];
const cost = data.reduce((acc, cur) => acc + Math.abs(cur - median), 0);
console.log(cost);
