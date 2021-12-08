const fs = require("fs");
const data = fs
  .readFileSync(`${__dirname}/test.txt`, "utf-8", (err, data) => data)
  .split("\n")
  .map((line) => line.split(" | ").map((str) => str.split(" ")));

const letterMap = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
};

const isSubset = (main, subset) => {
  let res = true;
  subset.forEach((val, index) => {
    if (val && main[index] !== val) res = false;
  });
  return res;
};

const sumArr = (arr) => {
  return arr.reduce((acc, cur) => acc + cur, 0);
};

const vecDiff = (vec1, vec2) => {
  let res = 0;
  vec1.forEach((val, index) => {
    if (vec2[index] !== val) res += 1;
  });
  return res;
};

const decode = (code, map) => {
  const nrs = [];
  code.forEach((code) => {
    const index = map.findIndex((encodedNr) => vecDiff(encodedNr, code) === 0);
    if (index >= 0) nrs.push(index);
  });
  return parseInt(nrs.join(""));
};

const ans = data.reduce((acc, cur) => {
  const [all, code] = cur;
  const encoded = all
    .sort((a, b) => (a.length >= b.length ? 1 : -1))
    .map((str) => str.split("").sort().join(""))
    .reduce((acc, cur, index) => {
      const encoded = cur.split("").reduce((acc, letter) => {
        acc[letterMap[letter]] += 1;
        return acc;
      }, new Array(7).fill(0));
      acc.push(encoded);
      return acc;
    }, []);
  const codeEncoded = code
    .map((str) => str.split("").sort().join(""))
    .reduce((acc, cur, index) => {
      const encoded = cur.split("").reduce((acc, letter) => {
        acc[letterMap[letter]] += 1;
        return acc;
      }, new Array(7).fill(0));
      acc.push(encoded);

      return acc;
    }, []);
  const sum = encoded.reduce((acc, cur) => {
    cur.forEach((nr, index) => (acc[index] += nr));
    return acc;
  }, new Array(7).fill(0));

  let nrs = new Array(10).fill(0);
  nrs[1] = encoded[0];
  nrs[7] = encoded[1];
  nrs[4] = encoded[2];
  nrs[8] = encoded.find((arr) => sumArr(arr) === 7);

  const l5nrs = encoded.filter((arr) => sumArr(arr) === 5);
  const l6nrs = encoded.filter((arr) => sumArr(arr) === 6);

  nrs[3] = l5nrs.find((arr) => isSubset(arr, encoded[0]));
  nrs[6] = l6nrs.find((arr) => !isSubset(arr, encoded[0]));
  nrs[9] = l6nrs.find((arr) => isSubset(arr, nrs[3]));
  nrs[5] = l5nrs.find((arr) => vecDiff(arr, nrs[6]) < 2);
  nrs[2] = l5nrs.find((arr) => !!vecDiff(arr, nrs[5]) && !!vecDiff(arr, nrs[3]));
  nrs[0] = l6nrs.find((arr) => !!vecDiff(arr, nrs[6]) && !!vecDiff(arr, nrs[9]));
  const codeDecoded = decode(codeEncoded, nrs);
  return acc + codeDecoded;
}, 0);

console.log(ans);
