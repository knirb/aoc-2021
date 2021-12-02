const fs = require("fs");
fs.readFile("day1/input.txt", "utf8", (err, data) => {
  const sum = data
    .split("\n")
    .map((depth) => parseInt(depth))
    .reduce((acc, depth, index, arr) => {
      if (!(index < 1 || index === arr.length - 1)) acc.push(arr[index - 1] + arr[index] + arr[index + 1]);
      return acc;
    }, [])
    .reduce((acc, curVal, index, arr) => {
      acc += curVal > arr[index - 1] ? 1 : 0;
      return acc;
    }, 0);
  console.log(sum);
});
