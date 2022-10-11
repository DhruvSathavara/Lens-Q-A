 
import { gql } from '@apollo/client'
import { apolloClient } from '../../services/Apollo_Client'

const CREATE_COMMENT_TYPED_DATA = `
  mutation($request: CreatePublicCommentRequest!) { 
    createCommentTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
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
        referenceModuleData
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
      }
     }
   }
 }
`

export const createCommentTypedData = (createCommentTypedDataRequest) => {
   return apolloClient.mutate({
    mutation: gql(CREATE_COMMENT_TYPED_DATA),
    variables: {
      request: createCommentTypedDataRequest
    },
  })
}