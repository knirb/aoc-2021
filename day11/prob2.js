const flash = (flasher, octopussies) => {
  const [x, y] = [flasher.x, flasher.y];
  flasher.hasFlashed = true;
  for (let ix = x - 1; ix <= x + 1; ix++) {
    for (let iy = y - 1; iy <= y + 1; iy++) {
      const flashedPus = octopussies.find((octopus) => octopus.x === ix && octopus.y === iy);
      if (flashedPus) {
        flashedPus.val += 1;
      }
    }
  }
  return octopussies;
};

const octopussies = require("fs")
  .readFileSync(`${__dirname}/input.txt`, "utf-8", (err, data) => data)
  .split("\n")
  .map((row, y) =>
    row.split("").map((str, x) => {
      return {
        val: parseInt(str),
        x,
        y,
        hasFlashed: false,
      };
    })
  )
  .flat();
const noDays = 1000;

let totFlashes = 0;

for (let day = 0; day < noDays; day++) {
  if (!octopussies.filter((pus) => pus.val !== octopussies[0].val).length > 0) {
    console.log("DAY: ", day);
    break;
  }
  octopussies.forEach((pus) => (pus.val += 1));
  let flashers = octopussies.filter((pus) => pus.val > 9 && !pus.hasFlashed);
  while (flashers.length > 0) {
    totFlashes += flashers.length;
    flashers.forEach((flasher) => flash(flasher, octopussies));
    flashers = octopussies.filter((pus) => pus.val > 9 && !pus.hasFlashed);
  }
  octopussies.forEach((pus) => {
    pus.val = pus.val > 9 ? 0 : pus.val;
    pus.hasFlashed = false;
  });
}

console.log(totFlashes);
