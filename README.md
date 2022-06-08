# 🦗 HOPR Meme Contest Analysis

Scripts to verify voters eligibility for the HOPR Meme Contest.

### 🚨 Overview

[Labeled Vote Logs](https://github.com/menezesphill/HOPR-meme-contest-analytics/blob/master/logs/votes-labeled.log)<br>
[Total Votes on Plotly](https://chart-studio.plotly.com/~menezesphill/2/total-votes/#/plot)<br>
[Labeled Votes on Plotly](https://chart-studio.plotly.com/~menezesphill/4/hopr-votes-new-participant-votes-sybil-votes/#/plot)

# 🧭 Table of contents

- [🦗 HOPR Meme Contest Analysis](#-hopr-meme-contest-analysis)
- - [🚨 Overview](#-overview)
- [🧭 Table of contents](#-table-of-contents)
- [✅ Quick Rundown](#-quick-rundow)
- [🚀 Instructions to Re-run the Analysis](#-instructions-to-re-run-the-analysis)
- - [📝 Clone or fork this repo](#-clone-or-fork-this-repo)
- - [💿 Install all dependencies](#-install-all-dependencies)
- - [⚡ Setting up Local Variables](#-setting-up-local-variables)
- - [🤖 Runing the scripts](#-running-the-scripts)


# ✅ Quick Rundown

This is script has several steps to ensure eligibility for the HOPR Meme constest. The steps are listed below:

1. Voters are extracted from [HOPR's proposal on Snapshot](https://snapshot.org/#/vote.hopr.eth/proposal/0xeee139906a330be9e1c2fc8a244166d9998a29fc6a172bb519b72bb40abf5e08)
     * Scripts used for this step can be found at `./utils/fetch-subgraph.js`
     * Voters data is extracted from Snapshot GraphQL API
     * Output logs for step is available at `./logs/votes.log`
     
2. **Sybil Checker**: a sybil check script check all voters addresses from Step 1
     * Scripts used for this step can be found at `./utils/sybil-checker.js`
     * The script check if address has any activity in both Gnosis and Ethereum
     * If no activity is found, the address is tagged as `Sybil`
     * Output logs for this step is available at `./logs/sybil-results.log`
     * After running the script, data should look like this:

```jsx
  '0xC93A5e8c31B88fcdBEF0606fC3E4B49ad74fA6f3': { isSybil: true, isHOPR: false, choice: 6 },
  '0x05895B308Bac6a322eF4902FA81b3E7Ae57Fd0B1': { isSybil: true, isHOPR: false, choice: 6 },
  '0x98d19523D2225e59224F9F93Bf0599Fb7ed75019': { isSybil: true, isHOPR: false, choice: 6 },
  '0xB90d5E95012f9B3C53aC3c9942a6224A0F1dBa5B': { isSybil: true, isHOPR: false, choice: 6 },
  '0xB4E72508614BeF370b18A9456eD6154f1C9aef03': { isSybil: false, isHOPR: false, choice: 6 },
  '0x732caBA9E0c58D7FA631eADbdE0cD317Db5b2228': { isSybil: true, isHOPR: false, choice: 3 },
  '0x2C081816B53275FeC8BE4570Ef863A1861b8D269': { isSybil: true, isHOPR: false, choice: 3 },
```

⚠️ At this point, the script haven't checked HOPR community members yet, so all accounts will be tagged as `isHOPR: false`. But we will fix that in a moment 👻

3. **HOPR Checker**: a script check all voters addresses from Step 1
     * Scripts used for this step can be found at `./utils/hopr-checker.js`
     * The script check if address either holds `HOPR`, `xHOPR`, `wxHOPR`, or is currently staking in Season 3
     * Addesses holding the assets mentioned above or staking in HOPR S3 are tagged as `HOPR`
     * Output logs for this step is available at `./logs/hopr-results.log`
     * Plus a list of current stakers is available at `./logs/season3-stakers.log`
     * After running the script, data should look like this:
   
```jsx
  '0xD1B30d224a385dBb14FEbaBb3d24dBA784421Ef5': { isSybil: true, isHOPR: false, choice: 4 },
  '0xE6388E11B9B27e9A0D48e7dE6ed8314fbF14074f': { isSybil: false, isHOPR: true, choice: 6 },
  '0xf1a16eBAD9A0Eb9525Af73208AA6304e796a2281': { isSybil: false, isHOPR: true, choice: 2 },
  '0xFfA3D25ff1AFb39283bb303Ca4ea5EA9803ac907': { isSybil: true, isHOPR: false, choice: 1 },
  '0x3a70F03D6EDE4cE6dD2E482B45D56A82b15a96F6': { isSybil: false, isHOPR: false, choice: 2 },
  '0x852926150De3854D61319021BD88F239C1Cc4C38': { isSybil: false, isHOPR: true, choice: 1 },
  '0x6FB3071447c444E51F7b282a76f06F811e21D3EC': { isSybil: false, isHOPR: true, choice: 3 },
```


4. Addresses that are neither Sybil nor HOPR will be considered new community members.

5. Votes are separated and labeled
    * Votes are separated in buckets using the `./utils/votes-aggroupment.js`
    * Votes are assigned to its respective meme number and labeled by `sybilVote`, `hoprVote` or `newParticipantVote`
    * Output logs for this step is available at `./logs/votes-labeled.log`
    * Data now looks like the example:

```jsx
{
  '1': {
    sybilVotes: 132,
    hoprVotes: 49,
    newParticipantVotes: 10,
    totalVotes: 191
  },
  '2': {
    sybilVotes: 1,
    hoprVotes: 8,
    newParticipantVotes: 3,
    totalVotes: 11
  },
  '3': {
    sybilVotes: 266,
    hoprVotes: 35,
    newParticipantVotes: 6,
    totalVotes: 307
  },
  '4': {
    sybilVotes: 105,
    hoprVotes: 24,
    newParticipantVotes: 6,
    totalVotes: 135
  },
  '5': {
    sybilVotes: 2,
    hoprVotes: 17,
    newParticipantVotes: 1,
    totalVotes: 20
  },
  ... and so on
}
```

6. Using this grouped data + Plotly we can get insightful information about the Meme Contest.
    * Running `plot-votes-01.js` will plot only total votes from Step 5.
    * To better visualize the data, please visit the [plot on plotly.com](https://chart-studio.plotly.com/~menezesphill/2/total-votes/#/plot)
    * And running `plot-votes.02.js` will plot votes labeled accordingly as in Step 5.
    * To better visualize the data, please visit the [plot on plotly.com](https://chart-studio.plotly.com/~menezesphill/4/hopr-votes-new-participant-votes-sybil-votes/#plot)


# 🚀 Instructions to Re-run the Analysis

To re-run this script, follow the steps:

### 📝 Clone or fork this repo:

```sh
git clone https://github.com/menezesphill/HOPR-meme-contest-analytics.git
```

### 💿 Install all dependencies:

```sh
cd HOPR-meme-contest-analytics
yarn install
```

### ⚡ Setting up Local Variables

To correctly reproduce all steps for this analysis, create a `.env` file in your `HOPR-meme-contest-analytics` folder with the following information:

```csh
INFURA_API_KEY={YOUR_INFURA_API_KEY}
SKIP_SYBIL_RUN=true
SKIP_HOPR_RUN=true
PLOTLY_API_KEY={YOUR_PLOTLY_API_KEY}
PLOTLY_USERNAME={YOUR_PLOTLY_USERNAME}
```

⚠️ Keeping `SKIP_SYBIL_RUN=true` and `SKIP_HOPR_RUN=true` will skip generating new `./logs/sybil-results.log` and `./logs/hopr-results.log` files. If you want to double check the data of these log files, set both SKIP variables to `false`. These checks might take several minutes and results might diverge from the original run since new transactions might have happened since then.

### 🤖 Runing the scripts

Scripts must be runned in the following order:

```sh
node data-labeler.js
```

will generate the following files:

```jsx
'./logs/votes.log'
'./logs/sybil-results.log' // if SKIP_SYBIL_RUN=false
'./logs/hopr-results.log' // if SKIP_HOPR_RUN=false
'./logs/season3-stakers.log'
'./logs/votes-labeled.log'
```

Then running:

```sh
node plot-votes-01.js
node plot-votes-02.js
```

will generate links to plots from data in the `./logs/votes-labeled.log` file.
