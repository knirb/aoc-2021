const fs = require("fs");
fs.readFile("day2/input.txt", "utf8", (err, data) => {
  const ans = data
    .split("\n")
    .reduce(
      (acc, cur) => {
        const [dir, valString] = cur.split(" ");
        const val = parseInt(valString);
        switch (dir) {
          case "up":
            acc[0] -= val;
            break;
          case "down":
            acc[0] += val;
            break;
          default:
            acc[1] += val;
            break;
        }
        return acc;
      },
      [0, 0]
    )
    .reduce((acc, cur) => {
      return acc * cur;
    }, 1);
  console.log(ans);
});
