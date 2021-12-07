const fs = require("fs");

const data = fs
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split(",")
  .map((str) => parseInt(str));

const maxDist = Math.max(...data);
let maxFuel = Number.POSITIVE_INFINITY;
for (let i = 0; i < maxDist + 1; i++) {
  const cost = data.reduce((acc, cur) => acc + Math.abs(cur - i), 0);
  if (cost < maxFuel) maxFuel = cost;
}

console.log(maxFuel);