// import { signedTypeData, getAddressFromSigner, splitSignature, getSigner } from './ethers.service';
import uploadIpfs from '../../post/ipfs';
import { lensPeriphery } from '../../post/lens-hub';
import { getAddressFromSigner, signedTypeData, splitSignature } from '../../services/ethers-service';
import { createSetProfileMetadataTypedData } from './create-set-profile-metadata-typed-data';
import { v4 as uuidv4 } from 'uuid';
import { pollUntilIndexed } from '../../Reffresh/has-transaction-been-indexed';
import { toast } from 'react-toastify';


export const setProfileMetadata = async (data) => { 
  try {
    const profileId = data.profileId;
    if (!profileId) {
      toast.error('Please login first!');
      return;
    }
  
     
    await data.login(data.address);

    const ipfsData = JSON.stringify({
        name: data.name,
      bio: data.bio,
      cover_picture:  data.photo,
      attributes: [
        {
          traitType: 'string',
          value: 'yes this is custom',
          key: 'custom_field',
        },
      ],
      version: '1.0.0',
      metadata_id: uuidv4(),
    });

  
    const ipfsResult = await uploadIpfs(ipfsData); 
  
    // hard coded to make the code example clear
    const createProfileMetadataRequest = {
      profileId,
      metadata:`https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`,
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
    const indexedResult = await pollUntilIndexed(tx.hash); 
  
    const logs = indexedResult.txReceipt.logs; 
  
    return result.data;
  } catch (error) {
    toast.error(error);
  }
  };
  
 

// export const setProfileMetadata = async () => {
//   const createProfileMetadataRequest = {
//     profileId: "0x1d",
//     url: "ipfs://QmSfyMcnh1wnJHrAWCBjZHapTS859oNSsuDFiAPPdAHgHP",
//   };
  
//   const result = await createSetProfileMetadataTypedData(
//     createProfileMetadataRequest.profileId,
//     createProfileMetadataRequest.metadata
//   );
//   const typedData = result.data.createSetProfileMetadataTypedData.typedData;
  
//   const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
//   const { v, r, s } = splitSignature(signature);
  
//   const tx = await lensPeriphery.setProfileMetadataURIWithSig({
//     profileId: createProfileMetadataRequest.profileId,
//     metadata: createProfileMetadataRequest.metadata,
//     sig: {
//       v,
//       r,
//       s,
//       deadline: typedData.value.deadline,
//     },
//   });
//   console.log(tx.hash);
//   // 0x64464dc0de5aac614a82dfd946fc0e17105ff6ed177b7d677ddb88ec772c52d3
//   // you can look at how to know when its been indexed here: 
//   //   - https://docs.lens.dev/docs/has-transaction-been-indexed
// }