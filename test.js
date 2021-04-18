// const glob = require("glob");
// const jimp = require("jimp");
// const path = require("path");
// const fs = require("fs")
// const percentage = 1;


// (async () => {
//     let start = process.hrtime();
//     const baseFolder = path.normalize("../../random shit/testImages/");
//     let hashes = glob.sync(baseFolder + "*.{png,jpg,jpeg}")
//     .map(async file => {
//         console.log(`hashing ${file}`);
//         let jf = await jimp.read(file);
//         return {
//             hash: jf.pHash(),
//             path: file
//         }
//     });
//     hashes = await Promise.all(hashes);
//     let diff = process.hrtime(start)[0]
//     let time = sToTime(diff);
//     console.log(`hashing took: ${time}`);

//     while(hashes.length > 0)
//     {
//         start = process.hrtime();
//         let h = hashes.shift();
//         console.log(`comparing ${h.path}`);
//         let jf = await jimp.read(h.path);
//         let jfHash = h.hash;

//         let dup = false;
//         for(let hash of hashes)
//         {
//             let distance = jf.distanceFromHash(hash.hash);
//             let per = jimp.compareHashes(hash.hash, jfHash);
//             if (distance * 100 < percentage || per * 100 < percentage) {
//                 dup = true;
//                 break;
//             }
//         }
//         if(dup) {
//             console.log(`\x1b[31m${h.path} is duplicate`)
//             // fs.rmSync(h.path);
//         }
//         diff = process.hrtime(start)[0]
//         time = sToTime(diff);
//         console.log(`took ${time} (${hashes.length} remaining)`);
//     }
// })()

// function sToTime(duration) {
//     return new Date(duration * 1000).toISOString().substr(11,8);
//   }
