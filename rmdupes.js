#!/usr/bin/env node
const path = require("path");
const { RemoveDuplicates } = require("./index");
const os = require("os");
const fs = require('fs');
const pathModule = require("path");
const argv = require("yargs")
.usage("usage: rmdupes <path> [options]")
.alias("v", "version")
.alias("h", "help")
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
  default: "all",
  alias: "D",
  describe: "how many folders deep to check"
})
.option("filter", {
  describe: "Filter for files you want to look through, using regex",
  alias: "f"
})
.option("hard_compare", {
  describe: "Compare folders with eachother, only keeping the first file that has been found",
  alias: "H"
})
.option("percentage", {
  describe: "Percetange of the images that has to differ (0 being fully matched, 100 being completely different)",
  alias: "p",
  default: 0
})
.option("threads", {
  describe: "Threads to use when hashing and comparing",
  alias: "t",
  default: os.cpus().length * 2
})
.option("json", {
  describe: "output in json string, or save json to file if outfile is defined",
  default: false,
  type: "boolean"
})
.option("outfile", {
  describe: "name of the output file when used with json output",
  default: "",
  type: "string"
})
.option("verbose", {
  describe: "more output logging, mainly for debugging",
  alias: "v",
  default: false
})
.demandCommand()
.argv

const rmdupes = async () => {
  let startTime = process.hrtime();
  const settings = {
    dry_run: argv.dry_run,
    recursive: argv.recursive,
    depth: argv.depth,
    quiet: argv.quiet,
    filter: argv.filter,
    hard_compare: argv.hard_compare,
    percentage: argv.percentage,
    threads: argv.threads,
    verbose: argv.verbose
  };
  
  try {
    let files = argv._.map(folder => `${process.cwd()}${path.sep}${folder}`);
    let result = await RemoveDuplicates(files, settings);

    if(argv.json && argv.outfile == "") {
      let json = JSON.stringify(result, null, 4);
      console.log(json);
    }

    if(argv.outfile.length > 0 && argv.json) {
      let fileName = argv.json;
      fileName = pathModule.basename(fileName, "." + fileName.split(".").splice(-1,1)[0]);
      fs.writeFileSync(`${process.cwd()}${path.sep}${fileName}.json`, JSON.stringify(result, null, 4));
      console.log(`output written to ${fileName}.json`);
    }

    let found = ((argv.dry_run) ? `Found` : `Removed`) + ` ${result.length} files`;
    console.log(found);
    let diff = process.hrtime(startTime)[0]; 
    if(!argv.quiet) console.log(`Time taken: ${sToTime(diff)}`);
  }
  catch(e) {
    console.error(e);
  }
}

function sToTime(duration) {
  return new Date(duration * 1000).toISOString().substr(11,8);
}

rmdupes();