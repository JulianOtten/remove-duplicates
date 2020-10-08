#!/usr/bin/env node
const path = require("path");
const { RemoveDuplicates } = require("./index");
const argv = require("yargs")
.usage("usage: rmdupes <path> [args]")
.option("dry_run", {
  alias: "d",
  describe: "run command without deleting files",
})
.option("recursive", {
  alias: "r",
  describe: "do checks for all sub folders as well (does not compare folders with eachother)"
})
.option("quiet", {
  alias: "q",
  default: false,
  describe: "run command without information logging"
})
.option("depth", {
  default: 0,
  describe: "how many folders deep to check"
})
.argv

const rmdupes = async () => {
  if (argv._[0] == undefined) {
      argv.help();
  }
  const folderPath = `${process.cwd()}${path.sep}${argv._[0]}`;

  const settings = {
      dry_run: argv.dry_run,
      recursive: argv.recursive,
      depth: argv.depth,
      quiet: argv.quiet,
  };

  await RemoveDuplicates(folderPath, settings);
}
rmdupes();