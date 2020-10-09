#!/usr/bin/env node
const fs = require("fs");
const hash_file = require("hash-file");
const pathModule = require('path');

/**
 * remove duplicate images from a path
 * @param {string} path 
 * @param {dry_run: boolean | string, recursive, depth, quiet, filter} options
 * @return {Promise<string[]>} output
 */
async function RemoveDuplicates(path, options = {depth: 0, recursive: false, dry_run: false, quiet: false})
{
  // check if we have iterations yet, if not, create the property to compare to the depth, if we do, increment it
  if(options.iterations == undefined) options.iterations = 0;
  else options.iterations++;
  
  // error handle all other properties
  if(options.depth == undefined) options.depth = 0;
  if(options.recursive == undefined) options.recursive = false;
  if(options.dry_run == undefined) options.dry_run = false;
  if(options.quiet == undefined) options.quiet = false;
  // duplicates array of all the files that were deleted
  let deletedFiles = [];
  // define hashes array to compare all our hashes too
  let fileHashes = [];
  // read the main dir
  let files = fs.readdirSync(path)
  // sort files into order. given file a.txt and a (2).txt, this will ensure a (2).txt gets removed rather than a.txt (just a personal preference)
  files.sort();
  files.reverse();
  // if we have a regex filter set, try filter through all the files
  if(options.filter != undefined)
  {
    const inputstring = options.filter;
    var flags = inputstring.replace(/.*\/([gimy]*)$/, '$1');
    var pattern = inputstring.replace(new RegExp('^/(.*?)/'+flags+'$'), '$1');
    var regex = new RegExp(pattern);
    files = files.filter(file => file.match(regex));
  }
  // loop over each file
  for(let file of files) {
    const filePath = `${path}${pathModule.sep}${file}`;
    const info = fs.lstatSync(filePath);
    // if we want recursion and we havent reached the max depth yet, call same function, if we dont, just return to skip this iteration
    if(info.isDirectory()) {
      if(options.recursive && options.iterations !== options.depth)
      {
        let removed = await RemoveDuplicates(filePath, options);
        deletedFiles = [...deletedFiles, ...removed];
      }
      continue;
    } 
    // hash the file contents to compare with eachother
    let hash = await hash_file(filePath)
    // see if hash exists, if not, add to hashes array, if it does, remove file and log this info
    // if we have dry_run defined, we dont remove the file yet, but display it
    if(!fileHashes.includes(hash)) fileHashes = [...fileHashes, hash];
    else {
      if(!options.dry_run) {
        fs.unlinkSync(filePath);
      }
      // if we log info, log the removal of the file
      if(!options.quiet) {
        let msg = (options.dry_run) ? "Found" : "Removed";
        console.log(`${msg} ${filePath}`);
      } 
      deletedFiles = [...deletedFiles, filePath];
    }
  }
  return deletedFiles;
}

module.exports.RemoveDuplicates = RemoveDuplicates;