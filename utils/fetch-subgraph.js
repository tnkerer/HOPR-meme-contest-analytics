const fetch = require('cross-fetch');
const { ApolloClient, InMemoryCache } = require('@apollo/client');
const gql = require('graphql-tag');
const HttpLink = require('apollo-link-http').HttpLink;

// Setting up Apollo Client to fetch for the snapshot subgraph
// Snapshot subgraph is a graphql schema that is used to store the snapshot data
// Snapshot graphql is served at https://hub.snapshot.org/graphql

snapshotGrapgqlUrl = 'https://hub.snapshot.org/graphql';

const getClient = (snapshotGrapgqlUrl) => {
  return new ApolloClient({
    uri: snapshotGrapgqlUrl,
    credentials: '',
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: snapshotGrapgqlUrl, fetch })
  });
};

const client = getClient(snapshotGrapgqlUrl);

// HOPR_VOTES is the query schema that is used to fetch the votes data
// HOPR Meme Contest Vote has 964 votes, so we are fetching the first 1000 votes
// HOPR Meme Contest Proposal hash is "0xeee139906a330be9e1c2fc8a244166d9998a29fc6a172bb519b72bb40abf5e08"

const HOPR_VOTES = gql`
query Votes {
    votes (
      first: 1000
      where: {
        proposal: "0xeee139906a330be9e1c2fc8a244166d9998a29fc6a172bb519b72bb40abf5e08"
      }
    ) {
      id
      voter
      created
      choice
      space {
        id
      }
    }
  }
`;

const getVotes = async () => {
  const { data } = await client.query({ query: HOPR_VOTES });
  return data.votes;
}

module.exports = { getVotes };