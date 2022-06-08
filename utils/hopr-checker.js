const { ethers } = require('ethers');
const util = require('util');
const fs = require('fs');
const hoperABI = require('../constants/hoprABI.json');
const Web3 = require('web3');
const web3 = new Web3('https://rpc.gnosischain.com/');
require('dotenv').config();

const HOPR_TOKEN_ADDRESS = '0xF5581dFeFD8Fb0e4aeC526bE659CFaB1f8c781dA';
const XHOPR_TOKEN_ADDRESS = '0xD057604A14982FE8D88c5fC25Aac3267eA142a08';
const WXHOPR_TOKEN_ADDRESS = '0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1';
const HOPR_S3_STAKE_ADDRESS = '0xae933331ef0bE122f9499512d3ed4Fa3896DCf20';
const S3_START_BLOCK = 21819537;

const HOPR_TOKEN_ABI = hoperABI;


const GNOSIS_PROVIDER_URL = 'https://xdai-archive.blockscout.com/';
const ETHEREUM_PROVIDER_URL = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;

util.inspect.defaultOptions.maxArrayLength = null;

const gnosisProvider = new ethers.providers.JsonRpcProvider(GNOSIS_PROVIDER_URL);
const ethereumProvider = new ethers.providers.JsonRpcProvider(ETHEREUM_PROVIDER_URL);

// Instantiate HOPR, xHOPR, and wxHOPR tokens
const hoprToken = new ethers.Contract(HOPR_TOKEN_ADDRESS, HOPR_TOKEN_ABI, ethereumProvider);
const xhoprToken = new ethers.Contract(XHOPR_TOKEN_ADDRESS, HOPR_TOKEN_ABI, gnosisProvider);
const wxhoprToken = new ethers.Contract(WXHOPR_TOKEN_ADDRESS, HOPR_TOKEN_ABI, gnosisProvider);

// Check balance of HOPR, xHOPR and wxHOPR tokens from a given input address
const checkBalance = async (address) => {
    const hoprBalance = await hoprToken.balanceOf(address);
    const xhoprBalance = await xhoprToken.balanceOf(address);
    const wxhoprBalance = await wxhoprToken.balanceOf(address);
    return {
        hoprBalance: ethers.utils.formatEther(hoprBalance),
        xhoprBalance: ethers.utils.formatEther(xhoprBalance),
        wxhoprBalance: ethers.utils.formatEther(wxhoprBalance)
    };
}

// Fetch and write all staker addresses to file in LOG file
// by using a filter on the S3 staking contract
const storeS3Staker = async () => {
    const stakers = new Map();

    // Listing Season 3 stakers
    const xhoprEventFilter = xhoprToken.filters.Transfer(null, HOPR_S3_STAKE_ADDRESS);
    let data = await xhoprToken.queryFilter(xhoprEventFilter, S3_START_BLOCK, 'latest');

    for (let i = 0; i < Object.keys(data).length; i++) {
        if (!stakers.has(data[i].args.from)) {
          stakers.set(data[i].args.from, parseInt(web3.utils.fromWei(`${data[i].args.value}`, 'ether')))
        } else {
          const newCount = stakers.get(data[i].args.from) + parseInt(web3.utils.fromWei(`${data[i].args.value}`, 'ether'))
          stakers.set(data[i].args.from, newCount)
        }
    }

    // list keys from stakers map
    const stakerKeys = Array.from(stakers.keys());
    fs.writeFileSync('./logs/season3-stakers.log', util.inspect(stakerKeys), 'utf-8');
    return
}

// Read from file and check if address is staking in Season 3
const checkS3Staker = async (address) => {
    const stakers = fs.readFileSync('./logs/season3-stakers.log', 'utf-8');
    const stakerArray = stakers.split(',');
    for (let i = 0; i < stakerArray.length; i++) {
        stakerArray[i] = stakerArray[i].replace(/[^a-zA-Z0-9]/g, '');
    }
    if (stakerArray.includes(address)) {
        return true;
    }
    return false;
}

// Use checkBalance to check if all balances are zero
// then checkS3Staker to check if the address is staking in Season 3
// if none are true, then address is not HOPR
const isHOPR = async (address) => {
    const balance = await checkBalance(address);
    const isStaker = await checkS3Staker(address);
    if (balance.hoprBalance === '0.0' && balance.xhoprBalance === '0.0' && balance.wxhoprBalance === '0.0' && isStaker === false) {
        return false;
    }
    return true;
}

module.exports = {
    storeS3Staker,
    isHOPR
}




