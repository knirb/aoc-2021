const fs = require("fs");

fs.readFile("./input.txt", "utf8", (err, data) => {
  const ans = data
    .split("\n")
    .map((string) => string.split("").map((str) => parseInt(str)))
    .reduce((acc, cur) => {
      for (let i = 0; i < cur.length; i++) {
        acc[i] += cur[i] ? 1 : -1;
      }
      return acc;
    }, new Array(12).fill(0))
    .map((nr) => (nr > 0 ? 1 : 0))
    .reduce(
      (acc, nr, index, arr) => {
        acc[0] += nr * Math.pow(2, arr.length - 1 - index);
        acc[1] += nr ? 0 : Math.pow(2, arr.length - 1 - index);
        return acc;
      },
      [0, 0]
    )
    .reduce((acc, cur) => acc * cur, 1);
  console.log(ans);
});
