import { apolloClient } from '../services/Apollo_Client';
import { gql } from '@apollo/client'

const CREATE_SET_DISPATCHER_TYPED_DATA = `
  mutation($request: SetDispatcherRequest!) { 
    createSetDispatcherTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetDispatcherWithSig {
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
          dispatcher
        }
      }
    }
 }
`

export const enableDispatcherWithTypedData = (profileId, dispatcher) => {
   return apolloClient.mutate({
    mutation: gql(CREATE_SET_DISPATCHER_TYPED_DATA),
    variables: {
      request: {
        profileId,
        dispatcher
      }
    },
  })
}

export const disableDispatcherWithTypedData = (profileId) => {
   return apolloClient.mutate({
    mutation: gql(CREATE_SET_DISPATCHER_TYPED_DATA),
    variables: {
      request: {
        profileId,
        enabled: false
      }
    },
  })
}