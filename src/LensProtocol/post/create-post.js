

import React from 'react'; 
import { signedTypeData, getAddressFromSigner, splitSignature, getAddress } from '../services/ethers-service';
import { createPostTypedData } from './create-post-type-data';
import { lensHub } from './lens-hub';
import { v4 as uuidv4 } from 'uuid';
import { pollUntilIndexed } from '../Reffresh/has-transaction-been-indexed';
import { BigNumber, utils } from 'ethers';
import uploadIpfs from './ipfs'
import { toast } from 'react-toastify';

export const createPost = async (postData) => { 

    console.log(postData,"postData");

    try {
        const profileId = window.localStorage.getItem("profileId"); 
        // hard coded to make the code example clear
        if (!profileId) {
            toast.error('Please login first!');
            return;
          }
    
        const address = await getAddress();

        console.log(address,"address");
    
        await postData.login(address);
    
        const ipfsData = JSON.stringify({
            version: '1.0.0',
            metadata_id: uuidv4(),
            description: postData.body,
            content:  postData.title,  
            external_url: null,
            image:  null,
            imageMimeType: null,
            name: postData.name,
            attributes: [
                {
                  traitType: 'string',
                  key: 'type',
                  value: 'post'
                }
              ],
            mainContentFocus: 'IMAGE',
            media: [ 
                {
                    item: postData.photo,
                    type: 'image/jpeg'
                }
            ],
            appId: 'Bbuzzer',
            animation_url: null,
        });
      
        const ipfsResult = await uploadIpfs(ipfsData);  
        const createPostRequest = {
            profileId,
            contentURI: `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`,
            // contentURI:' https://ipfs.moralis.io:2053/ipfs/QmSdfobB3pLSEFoFE4GPZT9qtFcPstxCTjt64vUKuHftFR',
            collectModule: {
                freeCollectModule: { followerOnly: true }, 
            },
            referenceModule: {
                followerOnlyReferenceModule: false
            }
        };
    
    
    
        const result = await createPostTypedData(createPostRequest);
        console.log(result,"result");
        const typedData = result.data.createPostTypedData.typedData;
    console.log(typedData,"typedData");
        const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
        console.log(signature,"signature");
        const { v, r, s } = splitSignature(signature);
    
        const tx = await lensHub.postWithSig({
            profileId: typedData.value.profileId,
            contentURI: typedData.value.contentURI,
            collectModule: typedData.value.collectModule,
            collectModuleInitData: typedData.value.collectModuleInitData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline,
            },
        }); 
    
        console.log(tx,"tx");
    
        const indexedResult = await pollUntilIndexed(tx.hash); 

        console.log(indexedResult,"indexedResult");
    
        const logs = indexedResult.txReceipt.logs;  
    console.log(logs,"logs");
        const topicId = utils.id(
            'PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)'
        ); 
    
        const profileCreatedLog = logs.find((l) => l.topics[0] === topicId); 
    
        let profileCreatedEventLog = profileCreatedLog.topics;  
        const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0];  
        console.log(publicationId,"publicationId");
        toast.success("Successfully post is created!")    
        return result.data;

    } catch (error) {
        toast.error(error);
    }
   
}