require('dotenv').config();
const plotly = require('plotly')(process.env.PLOTLY_USERNAME, process.env.PLOTLY_API_KEY);
const { ballotCounter } = require('./utils/votes-aggroupment.js');

const votes = ballotCounter();

var trace1 = {
  x: ["Meme #1", "Meme #2", "Meme #3", "Meme #4", "Meme #5", "Meme #6", "Meme #7", "Meme #8"],
  y: [votes['1'].totalVotes, votes['2'].totalVotes, votes['3'].totalVotes, votes['4'].totalVotes, votes['5'].totalVotes, votes['6'].totalVotes, votes['7'].totalVotes, votes['8'].totalVotes],
  name: "Total Votes",
  type: "bar"
};
var data = [trace1];
var layout = {barmode: "stack"};
var graphOptions = {layout: layout, filename: "total-votes", fileopt: "overwrite"};
plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
    console.log(err);
});