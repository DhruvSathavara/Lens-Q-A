 
import { gql } from '@apollo/client'
import { apolloClient } from '../../services/Apollo_Client'

const CREATE_COLLECT_TYPED_DATA = `
mutation($request: CreateCollectRequest!) { 
    createCollectTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
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
        pubId
        data
      }
     }
   }
 }
`

export const createCollectTypedData = (createCollectTypedDataRequest) => {
   return apolloClient.mutate({
    mutation: gql(CREATE_COLLECT_TYPED_DATA),
    variables: {
      request: createCollectTypedDataRequest
    },
  })
}