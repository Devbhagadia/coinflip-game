import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_API_URL);

const CONTRACT_ADDRESS = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'; // Update with your actual address

const CONTRACT_ABI = [
  // Ensure this matches the ABI of your deployed contract
  "function flipCoin(string choice) public payable returns (bool)",
  "event FlipResult(bool win, uint256 amountWon)"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

export default contract;
