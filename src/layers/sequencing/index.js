const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env['DATA_DIR'];

const readSequenceFile = (path) => {
    return new Promise(
        (resolve, reject) => {
            if (!fs.existsSync(path)) {
                reject(`no such file or directory ${path}`)
            }
            else {
                const readable = fs.createReadStream(path);
                const chunks = [];
                readable.on('readable', () => {
                    let chunk;
                    while (chunk = readable.read()) chunks.push(chunk);
                    resolve(chunks.reduce((prev, next) => prev + next.toString(), ''))
                })
            }
        }
    )
};

const parseSequenceData = (sequenceData) => {
    let hierarchy = [];

    return sequenceData.split('\n').map((instruction) => {
        let [source, sourceMethod = null, args = null] = instruction.split(':');

        const TABSTOP = 4;
        const currentDepth = source.match(/[^\s]/).index / TABSTOP;
        source = source.trimStart();

        if (currentDepth > hierarchy.length - 1) {
            hierarchy.push(source)
        }
        else if (currentDepth < hierarchy.length - 1) {
            hierarchy.pop();
        }

        return [hierarchy.slice(0, currentDepth).concat(source).join('$'), sourceMethod, args];
    })
}

module.exports = (document) => {

    const cache = {
        'root': document
    }

    return {
        run: (fileName) => {
            readSequenceFile(`${DATA_DIR}/${fileName}`)
                .then((sequenceData) => parseSequenceData(sequenceData))
                .then((sequence) => {
                    sequence.map((line) => {
                        let [source, action, args] = line;
                        cache[source] = cache[source]
                                     || cache[source.substr(0, source.lastIndexOf('$')) || 'root']
                                            .then(elem => elem.$(source.split('$').pop()));
            
                        return () => cache[source].then((elem) => action ? elem[action](args) : console.log(`no-op for ${elem.name}`));
                    })
                    .reduce((prev, next) => () => prev().then(next))()
                })
        }
    }
}