const data = require("fs")
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split("\n")
  .map((row) => row.split("").map((str) => parseInt(str)));

const addToMatrix = (mat, arg) => {
  const res = [];
  for (let y = 0; y < mat.length; y++) {
    res[y] = [];
    for (let x = 0; x < mat[0].length; x++) {
      res[y][x] = ((mat[y][x] + arg - 1) % 9) + 1;
    }
  }
  return res;
};

const concatMatricies = (matA, matB, dir = "horizontal") => {
  const res = [];
  if (dir === "horizontal") {
    for (let i = 0; i < matA.length; i++) {
      res[i] = [...matA[i], ...matB[i]];
    }
  } else {
    const mats = [matA, matB];
    for (let mat = 0; mat < mats.length; mat++) {
      for (let i = 0; i < matA.length; i++) {
        res.push(mats[mat][i]);
      }
    }
  }
  return res;
};

const printMap = (map) => {
  map.forEach((row) => console.log(row.join("")));
  console.log("");
};

const extendedMapMatrix = [];
for (let y = 0; y < 5; y++) {
  extendedMapMatrix[y] = [];
  for (let x = 0; x < 5; x++) {
    extendedMapMatrix[y] = extendedMapMatrix[y].length
      ? concatMatricies(extendedMapMatrix[y], addToMatrix(data, x + y))
      : addToMatrix(data, y);
  }
}

const extendedMap = extendedMapMatrix.flat();

const map = extendedMap.map((row, y) =>
  row.map((val, x) => {
    return {
      name: `${x}${y}`,
      x,
      y,
      cost: val,
      visited: false,
      connections: [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ],
    };
  })
);

const dimensions = { x: data[0].length, y: data.length };
const nodes = map.flat();

nodes.forEach((node) => {
  const newConnections = [];
  node.connections.forEach((connection) => {
    const connectionNode = nodes.find(
      (node) => node.x === connection[0] && node.y === connection[1]
    );
    if (connectionNode) {
      newConnections.push(connectionNode);
    }
  });
  node.connections = newConnections;
});

const start = nodes[0];
start.visited = true;
const end = nodes[nodes.length - 1];

const makeStep = (paths) => {
  const sorted = paths.sort((a, b) => (a.cost > b.cost ? 1 : -1));
  // console.log(
  //   paths
  //     .sort((a, b) => (a.cost > b.cost ? 1 : -1))
  //     .map((path) =>
  //       path.path
  //         .map(
  //           (node) => "(cost: " + node.cost + ", coord: " + node.name.split("").join(",") + ")\n"
  //         )
  //         .join(" -> ")
  //     )
  // );

  const cheapestPath = sorted[0];
  const connections = cheapestPath.path[cheapestPath.path.length - 1].connections;
  const nodesNotInPath = connections.filter((node) => !node.visited);
  let foundGoal;
  if (nodesNotInPath.length) {
    const newPaths = nodesNotInPath.map((node) => {
      node.visited = true;
      return {
        cost: cheapestPath.cost + node.cost,
        path: [...cheapestPath.path, node],
      };
    });
    newPaths.forEach((newPath) => {
      if (newPath.path[newPath.path.length - 1].name == end.name) {
        foundGoal = newPath;
      }
    });

    sorted.shift();
    return { cheapestPath: foundGoal, paths: [...newPaths, ...sorted] };
  } else {
    sorted.shift();
    return { cheapestPath: foundGoal, paths: [...sorted] };
  }
};

const findCheapestPath = (start, goal) => {
  let paths = [
    {
      cost: 0,
      path: [start],
    },
  ];
  let cheapestPath;
  while (!cheapestPath) {
    const res = makeStep(paths, goal);
    cheapestPath = res.cheapestPath;
    paths = res.paths;
  }
  return cheapestPath;
};
const printPath = (path) => {
  let res = [];
  let sum = 0;
  path.path.slice(1, path.path.length).forEach((node) => {
    res.push(node.name);
    sum += node.cost;
  });
  console.log(res.join("->"));
  console.log("sum: ", sum);
};

printPath(findCheapestPath(start, end));
