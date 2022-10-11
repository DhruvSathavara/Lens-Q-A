import { apolloClient } from '../services/Apollo_Client';
// this is showing you how you use it with react for example
// if your using node or something else you can import using
// @apollo/client/core!
import { gql } from '@apollo/client'

const VERIFY = `
  query($request: VerifyRequest!) {
    verify(request: $request)
  }
`

export const verify = (accessToken) => {
   return apolloClient.query({
    query: gql(VERIFY),
    variables: {
      request: {
         accessToken,
      },
    },
  })
}