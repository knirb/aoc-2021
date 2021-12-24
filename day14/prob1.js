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
console.log(pairMap);

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

const unfoldedSequence = getSequenceAtDepth(sequence, 10);

const counts = {};

unfoldedSequence.forEach((element) => {
  if (Object.keys(counts).includes(element)) counts[element]++;
  else counts[element] = 1;
});

console.log(counts);
