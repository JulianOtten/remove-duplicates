const { parentPort, workerData, threadId } =  require("worker_threads");
const jimp = require("jimp");
const fs = require("fs");
const colors = require("colors");
const options = JSON.parse(process.env.RMDUPES_OPTIONS);
const PERCENTAGE = options?.percentage ?? 1;

async function compareHashes(compareChunk, hashes) {
    let dupes = [];
    for(let ch of compareChunk)
    {
        console.log(`comparing ${ch.file} on thread`.cyan + ` ${threadId}`.green);
        let file = await jimp.read(ch.file);
        let dupeFiles = [];
        for(let h of hashes) {
            if(ch.file == h.file) continue;
            let distance = file.distanceFromHash(h.hash);
            let per = jimp.compareHashes(ch.hash, h.hash);
            if (distance * 100 <= PERCENTAGE || per * 100 <= PERCENTAGE) {
                dupes.push(ch.file);
                dupeFiles.push(h.file);
            }
        }
        if(dupeFiles.length > 0) dupes.push(dupeFiles);
        // console.log(`done comparing ${ch.file} on thread ${threadId}`.yellow);
    }
    parentPort.postMessage(dupes);
}

compareHashes(workerData.hash, workerData.hashes)