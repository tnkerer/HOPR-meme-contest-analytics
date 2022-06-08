const { getVotes } = require('./utils/fetch-subgraph');
const util = require('util');
const fs = require('fs');
require('dotenv').config();

util.inspect.defaultOptions.maxArrayLength = null;

// PHASE 01: Fetch votes from the snapshot subgraph
// Write logs to votes.log file from getVotes function returned data
const printLogs = () => {
    getVotes().then(data => {
        fs.writeFileSync('./logs/votes.log', JSON.stringify(data, null, 2));
    });
}

// PHASE 02: Format votes data to be used by sybil-checker.js
// Create a new JSON object with the following structure:
// {
//     "voters": {
//         "voterData.voter": {
//             "isSybil": false,
//             "isHOPR": false,
//             "choise": voterData.choise
//         }
//     }
// }

const createVoterData = () => {
    printLogs()
    const voterData = fs.readFileSync('./logs/votes.log', 'utf-8');
    const voterDataArray = JSON.parse(voterData);
    const voterDataObject = {};
    voterDataArray.forEach( (vote) => {
        const voterAddress = vote.voter;
        const voterChoice = vote.choice;
        const voterIsSybil = false;
        const voterIsHOPR = false;
        voterDataObject[voterAddress] = {
            "isSybil": voterIsSybil,
            "isHOPR": voterIsHOPR,
            "choice": voterChoice
        }
    }
    );
    return voterDataObject;
}

// PHASE 03: Check if the voter is a sybil or not using the function isSybil from sybil-checker.js
// Assign isSybil to true if the voter is a sybil

const sybilChecker = async (skip) => {
    if(skip === 'true') {
        return false;
    }
    const voterMap = createVoterData();
    const { isSybil } = require('./utils/sybil-checker');
    const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
    let count = 0;

    for (let [key, value] of Object.entries(voterMap)) {
        await delay();
        count++;
        isSybil(key).then(result => {
            if (result) {
                value.isSybil = true;
            }
        }
        );
        console.log('Checked ' + count + ' voters for sybil status');
    }

    fs.writeFileSync('./logs/sybil-results.log', JSON.stringify(voterMap, null, 2));
}

// Check sybil and disable writing log file if skip is true
// Can be disabled if sybil-results.log already exists

sybilChecker(process.env.SKIP_SYBIL_RUN); 

// PHASE 04: Use storeS3staker function from utils/hopr-checker.js to create stakers list
// then check if the voter is a HOPR or not using the function checkHOPR from hopr-checker.js
// Assign isHOPR to true if the voter is a HOPR

const { storeS3Staker, isHOPR } = require('./utils/hopr-checker');

const hoprChecker = async (skip) => {
    if(skip === 'true') {
        return false;
    }
    await storeS3Staker();
    const voterData = fs.readFileSync('./logs/sybil-results.log', 'utf-8');
    const voterDataArray = JSON.parse(voterData);
    const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
    let count = 0;
    for (let [key, value] of Object.entries(voterDataArray)) {
        await delay();
        count++;
        isHOPR(key).then(result => {
            if (result) {
                value.isHOPR = true;
            }
        }
        );
        console.log('Checked ' + count + ' voters for HOPR status');
    }
    console.log(voterDataArray)
    fs.writeFileSync('./logs/hopr-results.log', JSON.stringify(voterDataArray, null, 2));
}

// Check HOPR addresses and disable writing log file if skip is true
// Can be disabled if hopr-results.log already exists

hoprChecker(process.env.SKIP_HOPR_RUN);

// Write logs from ballotCounter

const { ballotCounter } = require('./utils/votes-aggroupment');

ballotCounter();



    



