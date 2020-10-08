# rmdupes
Rmdupes is a command used to remove duplicate files from folders
The way it works is, we hash the contents of a file, and compare the hashes with eachother, to check if the files contain the same content
If they have the same content, we delete the file.

You may want to use this command recursively as well, checking all the subfolders for duplicate files with other folders.

Be careful running this on extremely large data sets, you might overload your memory. (saving 50k hashes to memory isnt always a good idea)

# Install
`npm i @kingotten/remove-duplicates`

# Example code
```js
const { removeDuplicates } = require("@kingotten/remove-duplicates");

const folderPath = `path/to/your/folder`;

removeDuplicates(folderPath);
```

# Global install

`npm i -g @kingotten/remove-duplicates`

# Global Use
```
rmdupes .
rmdupes foldername
rmdupes foldername/subfoldername
rmdupes /absolute/path/to/folder
```