const fs = require("fs");

const fish = fs
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split(",")
  .map((str) => parseInt(str));

const age = (fish) => {
  return fish > 0 ? fish - 1 : [6, 8];
};

const getPopByDay = (fish, day) => {
  if (!day) return fish;
  return getPopByDay(
    fish.flatMap((fish) => age(fish)),
    day - 1
  );
};

console.log(getPopByDay(fish, 80).length);
