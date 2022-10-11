import { apolloClient } from '../services/Apollo_Client';
// this is showing you how you use it with react for example
// if your using node or something else you can import using
// @apollo/client/core!
import { gql } from '@apollo/client'

const CREATE_SET_PROFILE_METADATA_TYPED_DATA = `
  mutation($request: CreatePublicSetProfileMetadataURIRequest!) { 
    createSetProfileMetadataTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetProfileMetadataURIWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          metadata
        }
      }
    }
  }
`;

const createSetProfileMetadataTypedData = (profileId, metadata) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_SET_PROFILE_METADATA_TYPED_DATA),
    variables: {
      request: {
        profileId,
        metadata,
      },
    },
  });
};