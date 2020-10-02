#!/usr/bin/env node
const dup = require("duplicates");
const fs = require("fs");
const path = require('path');

/**
 * remove duplicate images from a path (WARNING, THIS IS STILL RECURSIVE AS IF THIS VERSION)
 * @param {string} path 
 */
function removeDuplicates(path) {
  let total = 0;
  dup.find(path, function (data) {
    for(key in data)
    {
      let arr = data[key];
      arr.sort();
      while(arr.length != 1)
      { 
          let file = arr[0];
          fs.unlink(file, err => {
              if(err) throw err;
          });
          total++;
          console.log("Removed file: " + file);
          arr.shift();
      }
    }
    return total;
  });
}

module.exports.removeDuplicates = removeDuplicates;