const [points, instructions] = require("fs")
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split("\n\n");

const pts = points.split("\n").map((pt) => pt.split(",").map((str) => parseInt(str)));
const inst = instructions
  .split("\n")
  .map((row) => row.split("along ")[1])
  .map((inst) => inst.split("="))
  .map((i) => [i[0], parseInt(i[1])]);

const createMap = (szx, szy) => {
  const map = [];
  for (let i = 0; i < szy; i++) {
    map.push(new Array(szx).fill(0));
  }
  return map;
};

const maxX = Math.max(...pts.map((pt) => pt[0]).flat()) + 1;
const maxY = Math.max(...pts.map((pt) => pt[1]).flat()) + 1;

let map = createMap(maxX, maxY);

pts.forEach((pt) => (map[pt[1]][pt[0]] = 1));

const foldMap = (map, instruction) => {
  const [dir, pos] = instruction;
  let newMap;
  console.log(dir, pos);
  if (dir === "x") {
    newMap = createMap(Math.max(map[0].length - 1 - pos, pos), map.length);
    const offset = Math.ceil(map[0].length - 1) / 2 - pos;
    for (let i = 0; i < newMap.length; i++) {
      for (let j = 0; j < newMap[0].length; j++) {
        if (offset >= 0) {
          newMap[i][j] += map[i][j];
          newMap[i][j] += offset + j >= 0 ? map[i][map[0].length - 1 - j + offset] : 0;
        } else {
          newMap[i][j] += map[i][map[0].length - 1 - j];
          newMap[i][j] += offset - j >= 0 ? map[i][j + offset] : 0;
        }
      }
    }
  } else {
    newMap = createMap(map[0].length, Math.max(map.length - 1 - pos, pos));
    const offset = Math.ceil((map.length - 1) / 2) - pos;
    for (let i = 0; i < newMap.length; i++) {
      for (let j = 0; j < newMap[0].length; j++) {
        if (offset <= 0) {
          newMap[i][j] += map[i][j];
          newMap[i][j] += offset + i >= 0 ? map[map.length - 1 - i + offset][j] : 0;
        } else {
          newMap[i][j] += map[map.length - 1 - i][j];
          newMap[i][j] += offset - i <= 0 ? map[i - offset][j] : 0;
        }
      }
    }
  }
  // printMap(newMap);
  return newMap;
};

const printMap = (map) => {
  map.forEach((row) => {
    console.log(row.reduce((acc, cur) => (acc += cur ? "# " : ". "), ""));
  });
};
inst.forEach((instruction) => {
  map = foldMap(map, instruction);
  printMap(map);
});

const res = foldMap(map, inst[0]);
console.log(res.flat().reduce((acc, cur) => (acc += cur ? 1 : 0)));
