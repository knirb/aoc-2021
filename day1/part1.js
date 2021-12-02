const fs = require("fs");
fs.readFile("day1/input.txt", "utf8", (err, data) => {
  const sum = data
    .split("\n")
    .map((depth) => parseInt(depth))
    .reduce((acc, curVal, index, arr) => {
      acc += curVal > arr[index - 1] ? 1 : 0;
      return acc;
    }, 0);
  console.log(sum);
});
