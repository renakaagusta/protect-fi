
## PROTECTFI Smart Contracts

This repository contains the Protectfi smart contracts including the 

- Insurance Factory
- Insurance Pool 
- Mock USDe
- Mock sUSDe

### Deployed Factory Contracts

https://sepolia.arbiscan.io/address/0xe28D3e3AF267477232D003c8ca36e85477b3A431

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

### Scripts

Useful scripts to interact or test the smart contract:
1. Deploy the USDe and Staked USDe
forge script script/USDe.s.sol:USDeScript --private-key $PRIVATE_KEY --rpc-url $RPC_URL -vvvv --broadcast  --via-ir
forge script script/InsuranceFactory.s.sol:InsuranceFactoryScript --private-key $PRIVATE_KEY --rpc-url $RPC_URL -vvvv --broadcast  --via-ir
2. Deploy the insurance pool
forge script script/InsurancePool.s.sol:InsurancePoolScript --private-key $PRIVATE_KEY --rpc-url $RPC_URL -vvvv --broadcast  --via-ir
3. Simulate purchse policy
forge script script/PurchasePolicy.s.sol:PurchasePolicyScript --private-key $PRIVATE_KEY_2 --rpc-url $RPC_URL -vvvv --broadcast  --via-ir
3. Simulate the submit claim process
forge script script/SubmitClaimComplete.s.sol:SubmitClaimCompleteScript --private-key $PRIVATE_KEY_2 --rpc-url $RPC_URL -vvvv --broadcast  --via-ir  --etherscan-api-key $ETHERSCAN_API_KEY \
    --verifier-url "https://api-sepolia.arbiscan.io/api"
