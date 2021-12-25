const data = require("fs")
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split("\n")
  .map((row, y) =>
    row.split("").map((str, x) => {
      return {
        name: `${x}${y}`,
        x,
        y,
        cost: parseInt(str),
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
const nodes = data.flat();
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
