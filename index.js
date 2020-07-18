const {
    getParsedSequence,
    noOp
} = require('./src/layers/sequencing')

const actions = (fileName) => getParsedSequence(fileName);

const sequence = (actions) => (document) => {
    return Promise.all([
        actions,
        document
    ])
    .then(([a, d]) => {
        return a.reduce(async (promise, action) => {
            let [source, method = 'toString', args = {}] = action,
            element = await d.$(source);
            return promise.then(element[method].bind(element, args))
        }, Promise.resolve());
    })
}

module.exports = {
    actions,
    sequence
}