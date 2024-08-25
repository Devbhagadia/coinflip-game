"use client"; // This makes sure the component is treated as a client component

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function CoinFlipGame() {
    const [connectedAccount, setConnectedAccount] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [side, setSide] = useState<string>('Heads');
    const [result, setResult] = useState<string>('');

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
                if (accounts.length > 0) {
                    setConnectedAccount(accounts[0]);
                }
            });
        }
    }, []);



    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setConnectedAccount(accounts[0]);
                console.log('Connected Account:', accounts[0]);
            } catch (error) {
                console.error('Failed to connect wallet:', error);
                setResult('Failed to connect wallet.');
            }
        } else {
            alert('MetaMask is not installed. Please install it to continue.');
        }
    };

    const flipCoin = async () => {
        try {
            await switchNetwork(); // Ensure we're on Sepolia

            if (!connectedAccount) {
                alert('Please connect your wallet first.');
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const contractAddress = '0x858527E11281aAC4eA1C0ef338054089b0443721';
            const contractABI = [
                'function flipCoin(string memory choice) public payable returns (bool)',
            ];

            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            const tx = await contract.flipCoin(side, {
                value: ethers.parseEther(amount),
                gasLimit: 300000,
            });

            await tx.wait();
            setResult('Coin flip successful!');
        } catch (error: any) {
            console.error('Transaction failed:', error);
            setResult(`Coin flip failed: ${error.message}`);
        }
    };
    

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-xl rounded-lg p-8 max-w-lg w-full">
                <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">Coin Flip Game</h1>
                <button
                    onClick={connectWallet}
                    className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg mb-6 hover:from-green-500 hover:to-blue-600 transition duration-300"
                >
                    {connectedAccount ? 'Connected' : 'Connect Wallet'}
                </button>
                <div className="mb-6">
                    <p className="text-lg font-semibold text-gray-700 mb-2">Connected Account:</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{connectedAccount || 'Not connected'}</p>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Amount (ETH):</label>
                    <input
                        type="number"
                        step="0.0000000001"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter amount in ETH"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Choose Side:</label>
                    <select
                        value={side}
                        onChange={(e) => setSide(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Heads">Heads</option>
                        <option value="Tails">Tails</option>
                    </select>
                </div>
                <button
                    onClick={flipCoin}
                    className="w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-500 hover:to-purple-600 transition duration-300"
                >
                    Flip Coin
                </button>
                {result && (
                    <p className={`mt-6 text-lg font-semibold ${result.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                        {result}
                    </p>
                )}
            </div>
        </div>
    );
}
function switchNetwork() {
    throw new Error('Function not implemented.');
}

