
import { toast } from 'react-toastify';
import { pollUntilIndexed } from '../../Reffresh/has-transaction-been-indexed';
import { getAddress, signedTypeData, splitSignature } from '../../services/ethers-service';
import { lensHub } from '../lens-hub';
import { createCollectTypedData } from './create-collect-typed-data';

export const collect = async (data) => {
    const collectRequest = {
        publicationId: data.id
    };

    if (!data.address) {
        toast.error('Please login first!');
        return;
      }

    const lg = await data.login(data.address); 
    try {
        const result = await createCollectTypedData(collectRequest); 
        const typedData = result.data.createCollectTypedData.typedData; 
        const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
        const { v, r, s } = splitSignature(signature);

        const tx = await lensHub.collectWithSig({
            collector: getAddress(),
            profileId: typedData.value.profileId,
            pubId: typedData.value.pubId,
            data: typedData.value.data,
            sig: {
                v,
                r,
                s,
                deadline: typedData.value.deadline,
            },
        }); 
        const indexedResult = await pollUntilIndexed(tx.hash); 
        toast.success("Successfully meme collected!");
    } catch (error) {
        toast.error("Must follow the profile to collect", error);
    } 
}