const axios = require('axios');

// Make an API call using AXIOS to blockscout xdai endpoints to check address transactions
// Return '0' if no transactions found

const getGnosisTransactions = async (address) => {
    try {
        const transactions = await axios.get(`https://blockscout.com/xdai/mainnet/api?module=account&action=txlist&address=${address}&starttimestamp=1641579200`);
        if (transactions.data.result.length === 0) {
            return '0';
        }
        return transactions.data.result;
    } catch (error) {
        console.log(error);
    }
}

const getEthereumTransactions = async (address) => {
    try {
        const transactions = await axios.get(`https://blockscout.com/eth/mainnet/api?module=account&action=txlist&address=${address}&starttimestamp=1641579200`);
    if (transactions.data.result.length === 0) {

        return '0';
    }
    return transactions.data.result;
    } catch (error) {
        console.log(error);
    }
}

const isSybil = async (address) => {
    const isActiveOnGnosis = await getGnosisTransactions(address);
    const isActiveOnEth = await getEthereumTransactions(address);
    if (isActiveOnGnosis === '0' && isActiveOnEth === '0') {
        return true; // Sybil

    } else {
        return false; // Not Sybil
    }
}

module.exports = { isSybil };


