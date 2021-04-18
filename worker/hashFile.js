const { parentPort, workerData, threadId } =  require("worker_threads");
const jimp = require("jimp");
const colors = require('colors');
const JPEG = require("jpeg-js");

async function hashFile(chunk) {
    console.log(`hashing on thread ${threadId}`.cyan);
    jimp.decoders['image/jpeg'] = (data) => JPEG.decode(data, { maxMemoryUsageInMB: 4096 });
    let hashes = [];
    // console.log(chunk)
    for(let file of chunk)
    {
        try {
            let f = await jimp.read(file);
            hashes = [...hashes, f.pHash()];
        }
        catch(e) {
            console.log(`${file}`.red);
            throw e;
        }
    }
    parentPort.postMessage({hashes});
}

hashFile(workerData.chunk)