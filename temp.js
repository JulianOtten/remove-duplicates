const filePath = `${path}${pathModule.sep}${file}`;
if (recursive) {
    const info = fs.lstatSync(filePath);
    // if we want recursion and we havent reached the max depth yet, call same function, if we dont, just return to skip this iteration
    if (info.isDirectory()) {
        if (iterations !== depth) {
            let result = await RemoveDuplicates(filePath, {
                ...options,
                fileHashes,
            });
            deletedFiles = [...deletedFiles, ...result];
            // if(hard_compare) fileHashes = [...fileHashes, ...result.fileHashes];
        }
        continue;
    }
}
// console.log(`reading ${filePath}`);
// hash the file contents to compare with eachother
let jimpFile = await jimp.read(filePath);
// console.log(`hashing ${filePath}`);
let hash = jimpFile.pHash();

let dup = false;
for (let h of fileHashes) {
    let distance = jimpFile.distanceFromHash(h.hash);
    let per = jimp.compareHashes(hash, h.hash);
    if (distance * 100 < percentage || per * 100 < percentage) {
        dup = true;
        break;
    }
}
// no dup, add hash to fileHashes and continue scanning
if (!dup) {
    fileHashes = [
        ...fileHashes,
        {
            hash,
            filePath,
        },
    ];
    continue;
}
// if we found a dup, remove file
if (!dry_run) {
    //fs.unlinkSync(filePath);
}
// if we log info, log the removal of the file
if (!quiet) {
    let msg = dry_run ? "Found" : "Removed";
    console.log(`${msg} ${filePath}`);
}
deletedFiles = [...deletedFiles, filePath];

// loop over each file to create hashes
for (let file of files) {
    const filePath = `${path}${pathModule.sep}${file}`;
    if (recursive) {
        const info = fs.lstatSync(filePath);
        // if we want recursion and we havent reached the max depth yet, call same function, if we dont, just return to skip this iteration
        if (info.isDirectory()) {
            if (iterations !== depth) {
                let result = await RemoveDuplicates(filePath, {
                    ...options,
                    fileHashes,
                });
                deletedFiles = [...deletedFiles, ...result];
                // if(hard_compare) fileHashes = [...fileHashes, ...result.fileHashes];
            }
            continue;
        }
    }
    let jf = await jimp.read(filePath);
    let hash = jf.pHash();
    fileHashes = [...fileHashes, hash];
}


let dup = false;
    console.log(`running on thread ${threadId ?? "undefined"}`)
    for(let h of workerData.fileHashes)
    {
        // let distance = jimpFile.distanceFromHash(h.hash)
        let per = jimp.compareHashes(workerData.hash, h.hash);
        if(per * 100 < 1){
            dup = true;
            break;
        }
    }
    parent.postMessage(dup);