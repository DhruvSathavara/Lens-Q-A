import { apolloClient } from '../services/Apollo_Client';
// this is showing you how you use it with react for example
// if your using node or something else you can import using
// @apollo/client/core!
import { gql } from '@apollo/client'

const REFRESH_AUTHENTICATION = `
  mutation($request: RefreshRequest!) { 
    refresh(request: $request) {
      accessToken
      refreshToken
    }
 }
`

export const refreshAuth = (refreshToken) => {
   return apolloClient.mutate({
    mutation: gql(REFRESH_AUTHENTICATION),
    variables: {
      request: {
        refreshToken,
      },
    },
  })
}