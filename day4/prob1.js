const fs = require("fs");

fs.readFile("day4/input.txt", "utf8", (err, data) => {
  const [list, ...tables] = data
    .split("\n\n")
    .map((row) => row.split("\n"))
    .map((table) =>
      table.length > 1
        ? table.map((row) => row.split(" ").filter((cell) => cell))
        : table[0].split(",")
    );

  const [szy, szx] = [tables[0].length, tables[0][0].length];

  const bingo = (table) => {
    for (let i = 0; i < table.length; i++) {
      if (table[i].reduce((acc, cur) => acc + cur, 0) >= table.length) {
        return true;
      }
      let sum = 0;
      for (let y = 0; y < table.length; y++) {
        sum += table[y][i];
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

  const calcSum = (t1, t2) => {
    let sum = 0;
    for (let y = 0; y < t1.length; y++) {
      for (let x = 0; x < t1[y].length; x++) {
        sum += !t1[y][x] ? parseInt(t2[y][x]) : 0;
      }
    }
    return sum;
  };

  const winner = list.reduce((acc, cur, ind, arr) => {
    if (acc.length < 4) return acc;
    if (ind === 0) {
      for (let len = 0; len < acc.length; len++) {
        acc[len] = [];
        for (let y = 0; y < szy; y++) {
          acc[len][y] = [];
          for (let x = 0; x < szx; x++) {
            acc[len][y][x] = 0;
          }
        }
      }
    }
    tables.forEach((table, i) => {
      const coords = findIndex(table, cur);
      if (coords) {
        acc[i][coords[1]][coords[0]] = 1;
      }
    });
    const id = acc.findIndex((table) => bingo(table));
    if (id >= 0) return [acc[id], tables[id], parseInt(cur)];
    return acc;
  }, new Array(tables.length));

  const ans = calcSum(...winner.slice(0, 2)) * winner[2];
  console.log(ans);
});
