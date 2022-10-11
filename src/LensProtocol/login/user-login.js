import { getAddress, signText } from '../services/ethers-service';
import { generateChallenge } from './generate-challenge'
import { authenticate } from './authenticate'
import { toast } from 'react-toastify';

export const loginSS = async () => {
 try { 
   const address = await getAddress(); 
  const challengeResponse = await generateChallenge(address); 
  const signature = await signText(challengeResponse.data.challenge.text) 
  const accessTokens = await authenticate(address, signature); 
 } catch (error) {
   toast.error(error);
 }
}