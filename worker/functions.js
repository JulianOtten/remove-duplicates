const fs = require("fs");
const { prependOnceListener } = require("process");
const {
    Worker
} = require('worker_threads');
let options, MAX_THREADS;

function initFunctionsFile()
{
    options = JSON.parse(process.env.RMDUPES_OPTIONS);
    MAX_THREADS = options?.threads ?? 5;
}

async function compareHashes(hashes) {
    let status = [];
    let chunks = chunkArray(Math.ceil(hashes.length / MAX_THREADS), hashes);
    for(let chunk of chunks)
    {
        status = [...status, compareHash(chunk, hashes)];
    }
    let vals = await Promise.all(status);
    
    // console.log(vals)

    // flatten array and remove duplicate entries
    vals = vals.reduce((prev, cur) => {
        return prev.concat(cur);
    })
    .filter((value, index, self) => self.indexOf(value) === index);
    
    // console.log(vals);
    return vals;
}

async function compareHash(hash, hashes) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__dirname + "/compareHashes.js", {
            workerData: {
                hash,
                hashes
            }
        })
        .on("message", resolve)
        .on("error", e => {
            console.error(e);
            reject();
        })
    })
}


async function hashFiles(files) {
    try {
        let f = [];
        let hashes = [];

        let chunkedArray = chunkArray(Math.ceil(files.length / MAX_THREADS), files);
        for(chunk of chunkedArray) 
        {
            hashes = [...hashes, hashChunk(chunk)]
        }
        let h = await Promise.all(hashes);

        h = h.reduce((prev, next) => {
            return prev.concat(next);
        });

        for(let i = 0; i < files.length; i++)
        {
            f = [...f, {
                hash: h[i],
                file: files[i]
            }]
        }
        return f;
    }
    catch(e) {
        console.error(e);
    }
}

async function hashChunk(chunk) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(__dirname + "/hashFile.js", {
            workerData: {
                chunk
            },
        });
        worker.on("message", res => resolve(res.hashes));
        worker.on("error", e => {
            console.error(e);
            reject();
        })
    })
}

module.exports = { 
    hashFiles,
    compareHashes,
    initFunctionsFile
}

function chunkArray(size, arr) {
    let output = [];
    for(let i = 0; i < arr.length; i += size)
    {
        output = [...output, arr.slice(i, i + size)]
    }
    return output;
}