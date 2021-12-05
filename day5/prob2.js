const fs = require("fs");

const lines = fs
  .readFileSync(`${__dirname}/input.txt`, "utf8", (err, data) => data)
  .split("\n")
  .map((line) =>
    line
      .split(" -> ")
      .map((item) =>
        item
          .split(",")
          .map((str) => parseInt(str))
          .flat()
      )
      .flat()
  );
const maxsz = Math.max(...lines.flat()) + 1;
const map = new Array(maxsz * maxsz).fill(0);

lines.forEach((line) => {
  const dx = line[2] - line[0];
  const dy = line[3] - line[1];
  const dirx = Math.sign(dx);
  const diry = Math.sign(dy);
  for (let i = 0; i < Math.max(Math.abs(dx), Math.abs(dy)) + 1; i++) {
    map[line[0] + i * dirx + (line[1] + i * diry) * maxsz] += 1;
  }
});

console.log(map.filter((val) => val >= 2).length);
