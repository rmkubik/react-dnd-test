const path = require("path");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function run() {
  const fileExtension = ".png";
  const [_, __, inputFileName, bgColor] = process.argv;
  const baseName = path.basename(inputFileName, fileExtension);
  const outputFileName = `${baseName}-padded${fileExtension}`;

  await exec(
    `convert ${inputFileName} -gravity center -background "${bgColor}" -extent 260%x220% ${outputFileName}`
  );

  console.log(`Created padded file: ${outputFileName}`);
}

run();
