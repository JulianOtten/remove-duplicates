#!/usr/bin/env node
const fs = require("fs");
const hash_file = require("hash-file");
const pathModule = require('path');
const { InvalidPathError, PathIsNotADirectoryError } = require("./errors");

/**
 * remove duplicate images from a path
 * @param {string | string[]} path Path(s) to the folder(s) to check
 * @param {recurisve, dry_run, quiet, depth, filter, hard_compare} options
 * @return {Promise<string[]>} Array of all the files it removed
 * @throws { InvalidPathError }
 */
async function RemoveDuplicates(path, options = {depth: 0, recursive: false, dry_run: false, quiet: false, hard_compare: false})
{
  // check if we have iterations yet, if not, create the property to compare to the depth, if we do, increment it
  if(options.iterations == undefined) options.iterations = 0;
  else options.iterations++;
  
  // error handle all other properties
  if(options.depth == undefined) options.depth = 0;
  if(options.recursive == undefined) options.recursive = false;
  if(options.dry_run == undefined) options.dry_run = false;
  if(options.quiet == undefined) options.quiet = false;
  if(options.hard_compare == undefined) options.hard_compare = false;
  // destruct the options object
  let {iterations, depth, recursive, dry_run, quiet, filter, hard_compare} = options;
  // duplicates array of all the files that were deleted
  let deletedFiles = [];
  // define hashes array to compare all our hashes too
  let fileHashes = [];
  // check if we have a fileHashes object passed from different function, and if we want to hard compare each file, and assign it to the current array
  if(options.fileHashes !== undefined && hard_compare) {
    fileHashes = options.fileHashes;
    // remove the property from the options object to prevent it from being passed around too much
    delete options.fileHashes;
  } 
  // if the user provided an array, handle it differently
  if(typeof path === "object") {
    // loop over each path in the input array
    for(p of path) {
      let result = await RemoveDuplicates(p, {...options, fileHashes});
      deletedFiles = [...deletedFiles, ...result];
      // if(hard_compare) fileHashes = [...fileHashes, ...result.fileHashes];
    }
    return deletedFiles;
  }
  // check if dir exists, if not throw path now found error
  if (!fs.existsSync(path)) {
    throw new InvalidPathError(`Path "${path}" was not found`);
  }
  // check if file is a dir
  if(!fs.lstatSync(path).isDirectory()) {
    throw new PathIsNotADirectoryError(`Path "${path}" is not a directory`)
  }
  // read the main dir
  let files = fs.readdirSync(path);

  // sort out all dirs and files, and put all the files before the dirs in alphabetical order
  let dirs = files.filter(file => fs.lstatSync(`${path}${pathModule.sep}${file}`).isDirectory()).sort();
  let filesFiltered = files.filter(file => fs.lstatSync(`${path}${pathModule.sep}${file}`).isFile()).sort();
  files = [...dirs, ...filesFiltered].reverse();

  // if we have a regex filter set, try filter through all the files
  if(filter != undefined && filter != null && filter != "")
  {
    const inputstring = filter;
    // somehow this works lets keep it that way
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
      if(recursive && iterations !== depth)
      {
        let result = await RemoveDuplicates(filePath, {...options, fileHashes});
        deletedFiles = [...deletedFiles, ...result];
        // if(hard_compare) fileHashes = [...fileHashes, ...result.fileHashes];
      }
      continue;
    } 
    // hash the file contents to compare with eachother
    let hash = await hash_file(filePath)
    // see if hash exists, if not, add to hashes array, if it does, remove file and log this info
    // if we have dry_run defined, we dont remove the file yet, but display it
    if(!fileHashes.includes(hash)) fileHashes = [...fileHashes, hash];
    else {
      if(!dry_run) {
        fs.unlinkSync(filePath);
      }
      // if we log info, log the removal of the file
      if(!quiet) {
        let msg = (dry_run) ? "Found" : "Removed";
        console.log(`${msg} ${filePath}`);
      } 
      deletedFiles = [...deletedFiles, filePath];
    }
  }
  return deletedFiles;
}

module.exports.RemoveDuplicates = RemoveDuplicates;