const data = require("fs")
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split("\n");

const nodes = [];
data.forEach((row) => {
  const arr = row.split("-");
  arr.forEach((el) => {
    const existingNode = nodes.find((node) => node.name === el);
    if (!existingNode) {
      nodes.push({
        name: el,
        connections: [...arr.filter((val) => val != el)],
        doubleAllowed: el === el.toUpperCase(),
      });
    } else {
      existingNode.connections = [...existingNode.connections, ...arr.filter((val) => val != el)];
    }
  });
});

nodes.forEach((node) => {
  const newConnections = [];
  node.connections.forEach((connection) =>
    newConnections.push(nodes.find((node) => node.name === connection))
  );
  node.connections = newConnections;
});

const pathHasDouble = (path) => {
  let hasDoubleSmall = false;
  const smallNodes = path.filter((node) => !node.doubleAllowed);
  for (let i = 0; i < smallNodes.length; i++) {
    const curNode = smallNodes[i];
    for (let j = i + 1; j < smallNodes.length; j++) {
      const compareNode = smallNodes[j];
      if (compareNode.name === curNode.name) hasDoubleSmall = true;
    }
  }
  return hasDoubleSmall;
};

const findPaths = (goal, paths) => {
  console.log(paths, goal);
  const newPaths = paths.filter((path) => path[path.length - 1].name === goal.name);
  paths
    .filter((path) => path[path.length - 1].name !== goal.name)
    .forEach((path) => {
      const lastNode = path[path.length - 1];
      const hasDoubleSmall = pathHasDouble(path);
      lastNode.connections
        .filter((node) => node.name !== lastNode.length)
        .forEach((node) => {
          const existing = path.find((existing) => existing.name === node.name);
          if ((!existing || existing.doubleAllowed || !hasDoubleSmall) && node.name !== "start") {
            newPaths.push([...path, node]);
          }
        });
    });
  if (newPaths.filter((path) => path[path.length - 1].name !== goal.name).length > 0) {
    return findPaths(goal, newPaths);
  } else {
    return newPaths;
  }
};

const start = nodes.find((node) => node.name === "start");
const end = nodes.find((node) => node.name === "end");

const printPath = (path) => {
  const stringPath = [];
  path.forEach((node) => stringPath.push(node.name));
  console.log(stringPath);
};
const paths = findPaths(end, [[start]]);
paths.forEach((path) => printPath(path));
console.log(paths.length);
