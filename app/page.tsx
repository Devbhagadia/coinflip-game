"use client"; // This makes sure the component is treated as a client component

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function CoinFlipGame() {
    const [connectedAccount, setConnectedAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [side, setSide] = useState('Heads');
    const [result, setResult] = useState('');

    useEffect(() => {
        // Check if wallet is connected on component mount
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
                if (accounts.length > 0) {
                    setConnectedAccount(accounts[0]);
                }
            });
        }
    }, []);

    // Define the switchNetwork function


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
        <div>
            <h1>Coin Flip Game</h1>
            <button onClick={connectWallet}>Connect Wallet</button>
            <p>Connected Account: {connectedAccount}</p>

            <div>
                <label>
                    Amount (ETH):
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </label>
            </div>

            <div>
                <label>
                    Choose Side:
                    <select value={side} onChange={(e) => setSide(e.target.value)}>
                        <option value="Heads">Heads</option>
                        <option value="Tails">Tails</option>
                    </select>
                </label>
            </div>

            <button onClick={flipCoin}>Flip Coin</button>

            {result && <p>{result}</p>}
        </div>
    );
}
