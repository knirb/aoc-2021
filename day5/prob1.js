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
  if (line[0] === line[2]) {
    const dy = line[3] - line[1];
    const dir = Math.sign(dy);
    for (let i = 0; i < Math.abs(dy) + 1; i++) {
      map[line[0] + (line[1] + i * dir) * maxsz] += 1;
    }
  } else if (line[1] === line[3]) {
    const dx = line[2] - line[0];
    const dir = Math.sign(dx);
    for (let i = 0; i < Math.abs(dx) + 1; i++) {
      map[line[0] + i * dir + maxsz * line[1]] += 1;
    }
  }
});
console.log(map[522 + 854 * maxsz]);
console.log(map.filter((val) => val >= 2).length);
