const fs = require("fs");
fs.readFile("./input.txt", "utf8", (err, data) => {
  const getAns = (data) => {
    const rec = (arr, ind, more) => {
      if (arr.length === 1) return parseInt(arr[0].join(""), 2);
      const filt =
        arr.reduce((acc, cur) => {
          return (acc += cur[ind] ? 1 : -1);
        }, 0) >= 0
          ? more
          : !more;
      return rec(
        arr.filter((nr) => nr[ind] == filt),
        ind + 1,
        more
      );
    };
    return rec(data, 0, 1) * rec(data, 0, 0);
  };
  console.log(
    getAns(data.split("\n").map((string) => string.split("").map((str) => parseInt(str))))
  );
});
