 
import { loginSS } from '../login/user-login';
import { lensHub } from '../post/lens-hub';
import { pollUntilIndexed } from '../Reffresh/has-transaction-been-indexed';
import { getAddress, getAddressFromSigner, signedTypeData, splitSignature } from '../services/ethers-service';
import { createFollowTypedData } from './create-follow-typed-data';
 

export const follow = async (profileId) => {  
    await profileId.login(); 

    const followRequest = [
      { 
          profile: profileId.id, 
      } 
    ];
  
    const result = await createFollowTypedData(followRequest); 
  
    const typedData = result.data.createFollowTypedData.typedData; 
  
    const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value); 
  
    const { v, r, s } = splitSignature(signature);
  
    const tx = await lensHub.followWithSig({
      follower: getAddress(),
      profileIds: typedData.value.profileIds,
      datas: typedData.value.datas,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    });
    
    const indexedResult = await pollUntilIndexed(tx.hash); 
    console.log('follow: indexedResult', indexedResult);
    const logs = indexedResult.txReceipt.logs; 
    return logs;
  };