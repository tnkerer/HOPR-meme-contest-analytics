require('dotenv').config();
const plotly = require('plotly')(process.env.PLOTLY_USERNAME, process.env.PLOTLY_API_KEY);
const { ballotCounter } = require('./utils/votes-aggroupment.js');

const votes = ballotCounter();

var trace1 = {
  x: ["Meme #1", "Meme #2", "Meme #3", "Meme #4", "Meme #5", "Meme #6", "Meme #7", "Meme #8"],
  y: [votes['1'].hoprVotes, votes['2'].hoprVotes, votes['3'].hoprVotes, votes['4'].hoprVotes, votes['5'].hoprVotes, votes['6'].hoprVotes, votes['7'].hoprVotes, votes['8'].hoprVotes],
  name: "HOPR Votes",
  type: "bar"
};

var trace2 = {
  x: ["Meme #1", "Meme #2", "Meme #3", "Meme #4", "Meme #5", "Meme #6", "Meme #7", "Meme #8"],
  y: [votes['1'].newParticipantVotes, votes['2'].newParticipantVotes, votes['3'].newParticipantVotes, votes['4'].newParticipantVotes, votes['5'].newParticipantVotes, votes['6'].newParticipantVotes, votes['7'].newParticipantVotes, votes['8'].newParticipantVotes],
  name: "New Participant Votes",
  type: "bar"
};

var trace3 = {
  x: ["Meme #1", "Meme #2", "Meme #3", "Meme #4", "Meme #5", "Meme #6", "Meme #7", "Meme #8"],
  y: [votes['1'].sybilVotes, votes['2'].sybilVotes, votes['3'].sybilVotes, votes['4'].sybilVotes, votes['5'].sybilVotes, votes['6'].sybilVotes, votes['7'].sybilVotes, votes['8'].sybilVotes],
  name: "Sybil Votes",
  type: "bar"
};


var data = [trace1, trace2, trace3];
var layout = {barmode: "stack"};
var graphOptions = {layout: layout, filename: "total-labeled-votes", fileopt: "overwrite"};
plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
});