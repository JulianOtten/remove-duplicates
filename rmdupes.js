#!/usr/bin/env node
const path = require('path');
const { removeDuplicates } = require("./index");

if(process.argv[2] == undefined)
{
  return console.log("Please enter a directory");
}
const folderPath = `${process.cwd()}${path.sep}${process.argv[2]}`;

removeDuplicates(folderPath);
