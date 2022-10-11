import { ethers } from 'ethers';
import { LENS_HUB_ABI, LENS_HUB_CONTRACT_ADDRESS, LENS_PERIPHERY_ABI, LENS_PERIPHERY_CONTRACT } from '../abi/abi';
import { getSigner } from '../services/ethers-service'; 

export const lensHub = new ethers.Contract(
  LENS_HUB_CONTRACT_ADDRESS,
  LENS_HUB_ABI,
  getSigner()
)

export const lensPeriphery = new ethers.Contract(
  LENS_PERIPHERY_CONTRACT,
  LENS_PERIPHERY_ABI,
  getSigner()
);