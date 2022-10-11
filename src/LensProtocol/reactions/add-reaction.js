
import { gql } from '@apollo/client'
import { toast } from 'react-toastify';
import { apolloClient } from '../services/Apollo_Client';
import { getAddress } from '../services/ethers-service';

const ADD_REACTION = `
  mutation($request: ReactionRequest!) { 
   addReaction(request: $request)
 }
`; 

const REMOVE_REACTION = `
  mutation($request: ReactionRequest!) { 
   removeReaction(request: $request)
 }
`;

 

const addReactionRequest = (request) => {
    console.log(request,"profileId, reaction, publicationId");
    return apolloClient.mutate({
        mutation: gql(ADD_REACTION),
        variables: {
            request: request,
        },
    });
};
 
export const addReaction = async (data) => {
   try {
    const profileId = data.id;
    if (!profileId) {
        toast.error('Please login first!');
        return;
      }
    const address = getAddress(); 

    await data.login(data.address);

    const request = { profileId: profileId, reaction: "UPVOTE", publicationId: data.publishId }; 

  const rr=  await addReactionRequest(request); 
    toast.success("Like"); 
   } catch (error) {
    toast.error(error);
   }
}

 

const removeReactionRequest = (
    profileId,
    reaction,
    publicationId
) => {
    return apolloClient.mutate({
        mutation: gql(REMOVE_REACTION),
        variables: {
            request: {
                profileId,
                reaction,
                publicationId,
            },
        },
    });
};

export const removeReaction = async (data) => { 
    const profileId = data.id;
    if (!profileId) {
        throw new Error('Must define PROFILE_ID in the .env to run this');
    }

    const address = getAddress(); 

    await data.login(data.address);

   const dd= await removeReactionRequest(profileId, 'UPVOTE', data.publishId);
    toast.success("Success"); 
};
