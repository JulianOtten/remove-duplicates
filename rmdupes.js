#!/usr/bin/env node
const path = require('path');
const { RemoveDuplicates } = require("./index");


if(process.argv[2] == undefined)
{
  return console.log("Please enter a directory");
}
const folderPath = `${process.cwd()}${path.sep}${process.argv[2]}`;

const settings = {
  dry_run: true,
  recursive: true,
  depth: "all",
  quiet: true,
}

let files = RemoveDuplicates(folderPath, settings);

files.forEach(file => console.log(file));

