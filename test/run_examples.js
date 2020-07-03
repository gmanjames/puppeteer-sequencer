const sequencer = require('../src/layers/sequencing/index');

// Stand-in for puppeteer API
const element = ({name}) => {
    const click = () => Promise.resolve(console.log(`${name} -- click`));
    const type = (text) => Promise.resolve(console.log(`${name} -- type "${text}"`));
    const $ = (q) => Promise.resolve(element({name: name + '$' + q}));
    return {
        name,
        click,
        type,
        $,
    };
};

(async () => {
    const runner = sequencer(Promise.resolve(element({name: 'html'})))
    runner.run('login_sequence.txt');
    runner.run('list_sequence.txt');
})()

