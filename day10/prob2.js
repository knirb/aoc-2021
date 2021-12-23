const data = require("fs")
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split("\n")
  .map((row) => row.split(""));

const closers = {
  ")": {
    opener: "(",
    score: 1,
  },
  "]": {
    opener: "[",
    score: 2,
  },

  "}": {
    opener: "{",
    score: 3,
  },
  ">": {
    opener: "<",
    score: 4,
  },
};

const openers = {
  "(": 1,
  "[": 2,
  "{": 3,
  "<": 4,
};

const sortedScores = data
  .reduce((acc, cur) => {
    const queue = [];
    let corrupt;
    cur.forEach((char) => {
      if (corrupt) return;
      if (!closers[char]) {
        queue.push(char);
      } else {
        if (queue[queue.length - 1] !== closers[char].opener) {
          corrupt = true;
        } else {
          queue.pop();
        }
      }
    });
    if (corrupt) return acc;
    const score = queue.reverse().reduce((acc, cur) => {
      const charScore = openers[cur];
      return acc * 5 + charScore;
    }, 0);
    acc.push(score);
    return acc;
  }, [])
  .sort((a, b) => (a > b ? 1 : -1));

console.log(sortedScores[(sortedScores.length - 1) / 2]);
