const puppeteerSequencer = require('../');
const path = require('path');
const dataDirPath = path.resolve(__dirname, '../data', 'examples');

//const puppeteer = require('puppeteer');
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
    const {sequence, actions} = puppeteerSequencer;
    const loginSequence = sequence(actions(`${dataDirPath}/login_sequence.txt`))
    loginSequence(element({name: 'html'})).then(() => {
        console.log('sequence completed')
    })
})()

