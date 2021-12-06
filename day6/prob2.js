const fs = require("fs");

const fish = fs
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split(",")
  .map((str) => parseInt(str));

const agePop = (pop) => {
  const children = pop[0];
  const res = [...pop.slice(1), pop[0]];
  res[6] += pop[0];
  return res;
};

const population = fish.reduce((acc, cur) => {
  acc[cur] += 1;
  return acc;
}, new Array(9).fill(0));

const getPopByDay = (pop, day) => {
  if (!day) return pop;
  return agePop(getPopByDay(pop, day - 1));
};

console.log(getPopByDay(population, 256).reduce((acc, cur) => acc + cur, 0));
