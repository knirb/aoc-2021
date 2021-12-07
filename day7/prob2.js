const fs = require("fs");

const data = fs
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split(",")
  .map((str) => parseInt(str));

const maxDist = Math.max(...data);
const mean = data.reduce((acc, cur) => acc + cur) / data.length;
const cost = data.reduce((acc, cur) => {
  const n = Math.abs(cur - mean);
  return acc + (n * (n + 1)) / 2;
}, 0);

console.log(Math.round(cost));
