# rmdupes
Rmdupes is a command used to remove duplicate files from folders.

The way it works is, we hash the contents of a file, and compare the hashes with eachother, to check if the files contain the same content
If they have the same content, we delete the file.

You may want to use this command recursively as well, checking all the subfolders for duplicate files with other folders.

Be careful running this on extremely large data sets, you might overload your memory. (saving 50k hashes to memory isnt always a good idea)

# Install
`npm i @kingotten/remove-duplicates`

# Example code
```js
const { RemoveDuplicates } = require("@kingotten/remove-duplicates");

const settings = {
    dry_run: false, // run without deleting files
    recursive: true, // run in subfolders (does not compare to subfolders tho)
    depth: 2, // check 2 folders deep
    quiet: true, // run without logging information about the command
    filter: "", // regex filter performed on each filename
};

// use with single string
const path = "path/to/folder";
await RemoveDuplicates(path, settings);
// use with array
const paths = ["PathA", "PathB", "PathC"];
await RemoveDuplicates(paths, settings);
```

# Global install

`npm i -g @kingotten/remove-duplicates`

# Global Use
```
rmdupes -h
rmdupes .
rmdupes FolderA
rmdupes FolderA FolderB
rmdupes FolderA -d -r -D=2
rmdupes E:/Absolute/Path/To/Folder
```