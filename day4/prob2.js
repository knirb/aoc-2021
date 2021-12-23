const fs = require("fs");

const bingo = (table) => {
  for (let i = 0; i < table.length; i++) {
    if (
      table[i].reduce((acc, cur) => {
        return (acc += cur === "X" ? 1 : 0);
      }, 0) >= table.length
    ) {
      return true;
    }
    let sum = 0;
    for (let y = 0; y < table.length; y++) {
      sum += table[y][i] === "X" ? 1 : 0;
    }
    if (sum >= table.length) {
      return true;
    }
  }
  return false;
};

const findIndex = (table, nr) => {
  for (let y = 0; y < table.length; y++) {
    const x = table[y].findIndex((cell) => cell === nr);
    if (x >= 0) return [x, y];
  }
  return null;
};

const calcSum = (t1) => {
  let sum = 0;
  for (let y = 0; y < t1.length; y++) {
    for (let x = 0; x < t1[y].length; x++) {
      sum += t1[y][x] !== "X" ? parseInt(t1[y][x]) : 0;
    }
  }
  return sum;
};

fs.readFile("day4/input.txt", "utf8", (err, data) => {
  const [list, ...tables] = data
    .split("\n\n")
    .map((row) => row.split("\n"))
    .map((table) =>
      table.length > 1
        ? table.map((row) => row.split(" ").filter((cell) => cell))
        : table[0].split(",")
    );

  const winner = list.reduce(
    (acc, cur, ind, arr) => {
      if (typeof acc[1] === "number") {
        return acc;
      }
      if (acc.length === 1 && bingo(acc[0])) return [acc[0], parseInt(arr[ind - 1])];
      acc.forEach((table, i) => {
        const coords = findIndex(table, cur);
        if (coords) {
          acc[i][coords[1]][coords[0]] = "X";
        }
      });

      return acc.length > 1 ? acc.filter((table) => !bingo(table)) : acc;
    },
    [...tables]
  );
  const ans = calcSum(winner[0]) * winner[1];
  console.log(ans);
});
