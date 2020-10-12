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
  describe: "run command without information logging"
})
.option("depth", {
  default: 0,
  alias: "D",
  describe: "how many folders deep to check"
})
.option("filter", {
  describe: "Filter for files you want to look through, using regex",
  alias: "f"
})
.demandCommand()
.argv

const rmdupes = async () => {
  
  const settings = {
    dry_run: argv.dry_run,
    recursive: argv.recursive,
    depth: argv.depth,
    quiet: argv.quiet,
    filter: argv.filter,
  };
  
  
  try {
    for(folder of argv._) {
      const folderPath = `${process.cwd()}${path.sep}${folder}`;
      await RemoveDuplicates(folderPath, settings);
    }
  }
  catch(e) {
    console.error(e);
  }
}
rmdupes();