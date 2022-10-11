import { signedTypeData, getAddressFromSigner, splitSignature } from '../services/ethers-service';
import { enableDispatcherWithTypedData } from './create-set-dispatcher-typed-data';
import { lensHub } from './lens-hub';

export const setDispatcher = async () => {
  // hard coded to make the code example clear
  const setDispatcherRequest = {
    profileId: "0x1d",
    dispatcher: "0xdfd7D26fd33473F475b57556118F8251464a24eb"
  }
  
  const result = await enableDispatcherWithTypedData(setDispatcherRequest.profileId, setDispatcherRequest.dispatcher);
  const typedData = result.data.createSetDispatcherTypedData.typedData;
  
  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
  const { v, r, s } = splitSignature(signature);
  
  const tx = await lensHub.setDispatcherWithSig({
    profileId: typedData.value.profileId,
    dispatcher: typedData.value.dispatcher,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  });
  console.log(tx.hash);
  // 0x64464dc0de5aac614a82dfd946fc0e17105ff6ed177b7d677ddb88ec772c52d3
  // you can look at how to know when its been indexed here: 
  //   - https://docs.lens.dev/docs/has-transaction-been-indexed
}