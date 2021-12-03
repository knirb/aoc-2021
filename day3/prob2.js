const fs = require("fs");

fs.readFile("./input.txt", "utf8", (err, data) => {
  const getAns = (data) => {
    const rec = (arr, ind, more) => {
      if (arr.length === 1) return parseInt(arr[0].join(""), 2);
      const filt =
        arr.reduce((acc, cur) => {
          acc += cur[ind] ? 1 : -1;
          return acc;
        }, 0) >= 0
          ? more
            ? 1
            : 0
          : more
          ? 0
          : 1;
      return rec(
        arr.filter((nr) => nr[ind] === filt),
        ind + 1,
        more
      );
    };
    return rec(data, 0, true) * rec(data, 0, false);
  };
  console.log(
    getAns(data.split("\n").map((string) => string.split("").map((str) => parseInt(str))))
  );
});
