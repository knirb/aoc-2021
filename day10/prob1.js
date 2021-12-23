const data = require("fs")
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split("\n")
  .map((row) => row.split(""));

const closers = {
  ")": {
    opener: "(",
    score: 3,
  },
  "]": {
    opener: "[",
    score: 57,
  },

  "}": {
    opener: "{",
    score: 1197,
  },
  ">": {
    opener: "<",
    score: 25137,
  },
};

const scores = data.reduce((acc, cur) => {
  const queue = [];
  let score;
  cur.forEach((char) => {
    if (score) return;
    if (!closers[char]) {
      queue.push(char);
    } else {
      if (queue[queue.length - 1] !== closers[char].opener) {
        score = closers[char].score;
      } else {
        queue.pop();
      }
    }
  });
  return (acc += score ? score : 0);
}, 0);

console.log(scores);
