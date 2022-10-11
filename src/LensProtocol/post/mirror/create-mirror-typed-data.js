 
import { gql } from '@apollo/client'
import { apolloClient } from '../../services/Apollo_Client'

const CREATE_MIRROR_TYPED_DATA = `
  mutation($request: CreateMirrorRequest!) { 
    createMirrorTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          MirrorWithSig {
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
        profileIdPointed
        pubIdPointed
                referenceModule
        referenceModuleData
        referenceModuleInitData
      }
     }
   }
 }
`

export const createMirrorTypedData = (createMirrorTypedDataRequest) => {
   return apolloClient.mutate({
    mutation: gql(CREATE_MIRROR_TYPED_DATA),
    variables: {
      request: createMirrorTypedDataRequest
    },
  })
}