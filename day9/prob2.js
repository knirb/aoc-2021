const map = require("fs")
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split("\n")
  .map((row) => row.split("").map((str) => parseInt(str)));

const createObjectMap = (map) => {
  const newMap = [];
  map.forEach((row, y) => {
    const newRow = [];
    row.forEach((point, x) => {
      newRow.push({
        x,
        y,
        value: map[y][x],
        visited: false,
      });
    });
    newMap.push(newRow);
  });
  return newMap;
};

const findSize = (point, map) => {
  const [x, y] = point;
  let sum = 1;
  map[y][x].visited = true;
  if (
    x > 0 &&
    !map[y][x - 1].visited &&
    map[y][x - 1].value < 9 &&
    map[y][x].value < map[y][x - 1].value
  )
    sum += findSize([x - 1, y], map);
  if (
    x < map[0].length - 1 &&
    !map[y][x + 1].visited &&
    map[y][x + 1].value < 9 &&
    map[y][x].value < map[y][x + 1].value
  )
    sum += findSize([x + 1, y], map);

  if (
    y > 0 &&
    !map[y - 1][x].visited &&
    map[y - 1][x].value < 9 &&
    map[y][x].value < map[y - 1][x].value
  )
    sum += findSize([x, y - 1], map);

  if (
    y < map.length - 1 &&
    !map[y + 1][x].visited &&
    map[y + 1][x].value < 9 &&
    map[y][x].value < map[y + 1][x].value
  )
    sum += findSize([x, y + 1], map);

  return sum;
};

const findCrevaseSize = (bottomPoint, map) => {
  const objectMap = createObjectMap(map);
  const [bx, by] = bottomPoint;
  objectMap[by][bx].visited = true;
  return findSize(bottomPoint, objectMap);
};

const points = map
  .reduce((acc, cur, y, arr) => {
    cur.forEach((point, x) => {
      adjacent = [];
      if (x > 0) adjacent.push(arr[y][x - 1]);
      if (x < cur.length - 1) adjacent.push(arr[y][x + 1]);
      if (y > 0) adjacent.push(arr[y - 1][x]);
      if (y < arr.length - 1) adjacent.push(arr[y + 1][x]);
      if (point < Math.min(...adjacent)) acc.push(findCrevaseSize([x, y], map));
    });
    return acc;
  }, [])
  .sort((a, b) => (a < b ? 1 : -1))
  .slice(0, 3)
  .reduce((acc, cur) => acc * cur, 1);

console.log(points);
