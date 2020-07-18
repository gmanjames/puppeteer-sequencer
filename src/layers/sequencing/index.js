const fs = require('fs');

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
        let [source, sourceMethod, args] = instruction.split(':');

        const TABSTOP = 4;
        const currentDepth = source.match(/[^\s]/).index / TABSTOP;
        source = source.trimStart();

        if (currentDepth > hierarchy.length - 1) {
            hierarchy.push(source)
        }
        else if (currentDepth < hierarchy.length - 1) {
            hierarchy.pop();
        }

        return [hierarchy.slice(0, currentDepth).concat(source).join(' '), sourceMethod, args];
    })
}

const noOp = (source) => console.log('no-op', source);

const getParsedSequence = (fileName) => readSequenceFile(fileName).then((sequenceData) => parseSequenceData(sequenceData));

module.exports = {
    getParsedSequence,
    noOp
}