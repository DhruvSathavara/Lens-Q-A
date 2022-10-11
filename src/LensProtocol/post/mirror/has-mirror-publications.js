import { gql } from '@apollo/client/core'; 
import { apolloClient } from '../../services/Apollo_Client';

const HAS_MIRRORED = `
query Publications($publicationsRequest: PublicationsQueryRequest!, $profileId: ProfileId) {
    publications(request: $publicationsRequest) {
      items {
        __typename 
        ... on Post {
          mirrors(profileId: $profileId)
        }
        ... on Comment {
          mirrors(profileId: $profileId)
        }
        ... on Mirror {
          mirrors(profileId: $profileId)
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;

const hasMirroredRequest = (data) => {
  return apolloClient.query({
    query: gql(HAS_MIRRORED),
    variables: {
        publicationsRequest: {
            "profileId": data.pid ? data.pid : "0x40bf",
            "publicationTypes": ["POST", "COMMENT", "MIRROR"],
        },
        reactionRequest: {
            "profileId": data.pid2 ? data.pid2 : "0x40bf"
        },
    }
  });
};

export const hasMirrored = async (data) => {   
  const result = await hasMirroredRequest(data);   
  return result.data;
};

 