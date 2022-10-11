import { gql } from '@apollo/client/core';
import { apolloClient } from '../../services/Apollo_Client';

const HAS_COLLECTED = `
  query($request: HasCollectedRequest!) {
    hasCollected(request: $request) {
      walletAddress
      results {
        collected
        publicationId
        collectedTimes
      }
    }
  }
`;

const hasCollectedRequest = (collectRequests) => {
    return apolloClient.query({
        query: gql(HAS_COLLECTED),
        variables: {
            request: {
                collectRequests,
            },
        },
    });
};

export const hasCollected = async () => {
    const res = {
        walletAddress: '0x109eCbC12836F7Dd63255254fa973d21425819aE',
        publicationIds: ['0x0f-0x01'],
    }
    const result = await hasCollectedRequest(res); 

    return result.data;
}; 