const util = require('util');
const fs = require('fs');


// Create a voterSelector JSON object with the following structure:
//
// voterSelector[choise] = {
//    "sybilVotes": sybilVotes,
//    "hoprVotes": hoprVotes,
//    "newParticipantVotes": newParticipantVotes,
//    "totalVotes": totalVotes
//    }
//
// populate choices with values from 1 to 8

const createVotesSelector = () => {
    const votesSelector = {};
    for (let i = 1; i <= 8; i++) {
        votesSelector[i] = {
            "sybilVotes": 0,
            "hoprVotes": 0,
            "newParticipantVotes": 0,
            "totalVotes": 0
        }
    }
    return votesSelector;
}

// Read entries from hopr-results.log and populate votesSelector
const ballotCounter = () => {
    const voterData = fs.readFileSync('./logs/hopr-results.log', 'utf-8');
    const voterDataArray = JSON.parse(voterData);
    const votesSelector = createVotesSelector();

    for (let [key, value] of Object.entries(voterDataArray)) {
        if (value.isHOPR) {
            votesSelector[value.choice].hoprVotes++;
        }
        if (!value.isSybil && !value.isHOPR) {
            votesSelector[value.choice].newParticipantVotes++;
        }
        if (value.isSybil) {
            votesSelector[value.choice].sybilVotes++;
        }
        votesSelector[value.choice].totalVotes++;
    }
    fs.writeFileSync('./logs/votes-labeled.log', JSON.stringify(votesSelector, null, 2));
    return votesSelector;
}

module.exports = { 
    ballotCounter
}
