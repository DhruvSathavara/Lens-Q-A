
import { signedTypeData, splitSignature } from '../../services/ethers-service';
import uploadIpfs from '../ipfs';
import { lensHub } from '../lens-hub';
import { createCommentTypedData } from './create-comment-typed-data';
import { v4 as uuidv4 } from 'uuid';
import { BigNumber, utils } from 'ethers';
import { pollUntilIndexed } from '../../Reffresh/has-transaction-been-indexed';
import { toast } from 'react-toastify';
import { getComments } from '../get-post';

export const createComment = async (postData) => {
  try {
    const profileId = postData.profileId;
    if (!profileId) {
      toast.error('Please login first!');
      return;
    }


    await postData.login(postData.address);

    const ipfsData = JSON.stringify({
      version: '1.0.0',
      metadata_id: uuidv4(),
      description: postData.comment,
      content: postData.comment,
      external_url: null,
      image: null,
      imageMimeType: null,
      name: `Comment by @ ${postData.user}`,
      attributes: [],
      media: [],
      appId: 'superfun',
      animation_url: null,
    });
    const ipfsResult = await uploadIpfs(ipfsData);

    console.log('create comment: ipfs result', ipfsResult);

    // hard coded to make the code example clear
    const createCommentRequest = {
      profileId,
      // remember it has to be indexed and follow metadata standards to be traceable!
      publicationId: postData.publishId,
      contentURI: `https://superfun.infura-ipfs.io/ipfs/${ipfsResult.path}`,
      collectModule: {
        revertCollectModule: true,
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };

    const result = await createCommentTypedData(createCommentRequest);
    // console.log('create comment: createCommentTypedData', result);

    const typedData = result.data.createCommentTypedData.typedData;
    // console.log('create comment: typedData', typedData);

    const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
    // console.log('create comment: signature', signature);

    const { v, r, s } = splitSignature(signature);

    const tx = await lensHub.commentWithSig({
      profileId: typedData.value.profileId,
      contentURI: typedData.value.contentURI,
      profileIdPointed: typedData.value.profileIdPointed,
      pubIdPointed: typedData.value.pubIdPointed,
      collectModule: typedData.value.collectModule,
      collectModuleInitData: typedData.value.collectModuleInitData,
      referenceModule: typedData.value.referenceModule,
      referenceModuleInitData: typedData.value.referenceModuleInitData,
      referenceModuleData: typedData.value.referenceModuleData,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    });

    console.log(tx, "tx");
    const wait = await tx.wait(); 

    if (wait) {
      // console.log('create comment: tx hash', tx.hash);

      // console.log('create comment: poll until indexed');
      const indexedResult = await pollUntilIndexed(tx.hash);

      // console.log('create comment: profile has been indexed', result);

      const logs = indexedResult.txReceipt.logs;

      // console.log('create comment: logs', logs);

      const topicId = utils.id(
        'CommentCreated(uint256,uint256,string,uint256,uint256,bytes,address,bytes,address,bytes,uint256)'
      );
      // console.log('topicid we care about', topicId);

      const profileCreatedLog = logs.find((l) => l.topics[0] === topicId);
      // console.log('create comment: created log', profileCreatedLog);

      let profileCreatedEventLog = profileCreatedLog.topics;
      // console.log('create comment: created event logs', profileCreatedEventLog);

      const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0];

      // console.log(
      //   'create comment: contract publication id',
      //   BigNumber.from(publicationId).toHexString()
      // );
      
      return result.data;
    }
  } catch (error) {
    toast.error(error);
  }
};