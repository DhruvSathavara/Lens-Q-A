import { signedTypeData, getAddressFromSigner, splitSignature, getSigner } from './ethers.service';
import { createSetProfileMetadataTypedData } from './create-set-profile-metadata-typed-data';
import { lensPeriphery } from '../abi/Lens-hub';

export const setProfileMetadata = async () => {
  const createProfileMetadataRequest = {
    profileId: "0x1d",
    url: "ipfs://QmSfyMcnh1wnJHrAWCBjZHapTS859oNSsuDFiAPPdAHgHP",
  };
  
  const result = await createSetProfileMetadataTypedData(
    createProfileMetadataRequest.profileId,
    createProfileMetadataRequest.metadata
  );
  const typedData = result.data.createSetProfileMetadataTypedData.typedData;
  
  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
  const { v, r, s } = splitSignature(signature);
  
  const tx = await lensPeriphery.setProfileMetadataURIWithSig({
    profileId: createProfileMetadataRequest.profileId,
    metadata: createProfileMetadataRequest.metadata,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  }); 
  // 0x64464dc0de5aac614a82dfd946fc0e17105ff6ed177b7d677ddb88ec772c52d3
  // you can look at how to know when its been indexed here: 
  //   - https://docs.lens.dev/docs/has-transaction-been-indexed
}