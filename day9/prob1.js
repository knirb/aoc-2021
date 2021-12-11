const map = require("fs")
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split("\n")
  .map((row) => row.split("").map((str) => parseInt(str)));
const ans = map
  .reduce((acc, cur, ind, arr) => {
    cur.forEach((point, index) => {
      adjacent = [];
      if (index > 0) adjacent.push(arr[ind][index - 1]);
      if (index < cur.length - 1) adjacent.push(arr[ind][index + 1]);
      if (ind > 0) adjacent.push(arr[ind - 1][index]);
      if (ind < arr.length - 1) adjacent.push(arr[ind + 1][index]);
      if (point < Math.min(...adjacent)) acc.push(point + 1);
    });
    return acc;
  }, [])
  .reduce((acc, cur) => acc + cur);

console.log(ans);
