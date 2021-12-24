const printSequence = (sequence) => {
  console.log(sequence.join(""));
};

const [sequenceData, pairMapData] = require("fs")
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split("\n\n");
const sequence = sequenceData.split("");
const pairMap = pairMapData
  .split("\n")
  .map((row) => row.split(" -> "))
  .reduce((acc, cur) => {
    acc[cur[0]] = cur[1];
    return acc;
  }, {});

const getNextSequence = (seqIn) => {
  return seqIn.reduce((acc, cur, ind, arr) => {
    if (ind < 1) {
      acc.push(cur);
      return acc;
    }
    acc.push(pairMap[arr[ind - 1] + cur], cur);
    return acc;
  }, []);
};

const getSequenceAtDepth = (seq, depth) => {
  for (let i = 0; i < depth; i++) {
    seq = getNextSequence(seq);
  }
  return seq;
};

const getCountsAtDepth = (triplets, depths) => {};

const triplets = {};
for (let i = 0; i < sequence.length / 2; i++) {
  let element = sequence[i * 2] + sequence[i * 2 + 1];
  element += sequence[i * 2 + 2] ? sequence[i * 2 + 2] : "";
  if (Object.keys(triplets).includes(element)) triplets[element]++;
  else triplets[element] = 1;
}

// const remaining = (sequence.length % 3) + 1;
// triplets[sequence.reverse().slice(0, remaining).reverse().join("")] = 1;
console.log(triplets);

const evolve = (population) => {
  let res = {};
  for (const key in population) {
    const count = population[key];
    const pairs = key.split("").reduce((acc, cur, ind, arr) => {
      if (ind === 0) return acc;
      acc.push([arr[ind - 1], cur].join(""));
      return acc;
    }, []);
    pairs.forEach((pair) => {
      letters = pair.split("");
      const newTriplet = letters[0] + pairMap[pair] + letters[1];
      if (Object.keys(res).includes(newTriplet)) res[newTriplet] += count;
      else res[newTriplet] = count;
    });
  }
  return res;
};

const evolveNGen = (pop, n) => {
  let res = pop;
  for (let i = 0; i < n; i++) {
    res = evolve(res);
  }
  return res;
};

const countLetters = (population) => {
  const letterCounts = {};

  for (const key in population) {
    const count = population[key];
    const letters = key.split("").slice(0, 2);
    letters.forEach((letter) => {
      if (Object.keys(letterCounts).includes(letter)) letterCounts[letter] += count;
      else letterCounts[letter] = count;
    });
  }
  return letterCounts;
};

const evolved = evolveNGen(triplets, 40);
const counts = countLetters(evolved);

counts[sequence[sequence.length - 1]]++;
const countArray = [];
for (const key in counts) {
  countArray.push({
    key,
    count: counts[key],
  });
}
console.log(countArray.sort((a, b) => (a.count < b.count ? 1 : -1)));
console.log(countArray[0].count - countArray[countArray.length - 1].count);
// console.log(sequence.length);
