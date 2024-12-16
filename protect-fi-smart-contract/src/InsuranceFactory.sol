// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

import "./IInsuranceFactory.sol";
import "./InsurancePool.sol"; 

contract InsuranceFactory is IInsuranceFactory {
    address[] public allInsurancePools;
    mapping(address => address[]) public insurerToPools;
    mapping(address => bool) public registeredPools;

    address public owner;
    address public serviceManager;
    address public usde;
    address public stakedUSDe;
    string public operatorPublicKey;

    uint256 public storageFee;
    uint256 public withdrawFee;

    /**
     * @param _storageFee Storage fee
     **/
    function updateStorageFee(
        uint256 _storageFee
    ) external {
        require(msg.sender == owner, "Only owner can invoke this function");

        storageFee = _storageFee;
    }

    /**
     * @param _withdrawFee Withdraw fee
     **/
    function updateWithdrawFee(
        uint256 _withdrawFee
    ) external {
        require(msg.sender == owner, "Only owner can invoke this function");

        withdrawFee = _withdrawFee;
    }

    constructor(
        address _usde,
        address _stakedUSDe,
        address _serviceManager,
        uint256 _storageFee,
        uint256 _withdrawFee
    ) {
        usde = _usde;
        stakedUSDe = _stakedUSDe;
        owner = msg.sender;
        serviceManager = _serviceManager;
        storageFee = _storageFee;
        withdrawFee = _withdrawFee;
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can invoke this function");

        ERC20(usde).transfer(owner, ERC20(usde).balanceOf(address(this)));
    }

    /**
     * @dev Deploys a new InsurancePool contract with the specified parameters.
     * @param _name Name of the ERC20 token.
     * @param _symbol Symbol of the ERC20 token.
     * @param _descriptionUri Description URI.
     * @param _exampleResponseUri Response URI.
     * @param _curl URL of the insurance pool.
     * @param _encryptedCurlSecretKey Encrypted URL token.
     * @param _encryptedApplicationID Encrypted Application ID.
     * @param _encryptedApplicationSecret Encrypted Application Secret.
     * @param _regexExtraction Path to value.
     * @param _regexValidation Checking logic.
     * @param _claimFee Checking logic.
     * @param _benefit Benefit.
     * @param _startedAt Start timestamp.
     * @param _finishedAt Finish timestamp.
     * @param _endOfPurchaseAt End of purchase timestamp.
     * @param _maxPolicies Maximum number of policies.
     * @return poolAddress Address of the newly deployed InsurancePool.
     */
    function createInsurancePool(
        string memory _name,
        string memory _symbol,
        string memory _descriptionUri,
        string memory _exampleResponseUri,
        string memory _curl,
        string memory _encryptedCurlSecretKey,
        string memory _encryptedApplicationID,
        string memory _encryptedApplicationSecret,
        string memory _regexExtraction,
        string memory _regexValidation,
        uint256 _claimFee,
        uint256 _benefit,
        uint256 _startedAt,
        uint256 _finishedAt,
        uint256 _endOfPurchaseAt,
        uint256 _maxPolicies
    ) external returns (address poolAddress) {
        InsurancePool insurancePool = new InsurancePool(
            _name,
            _symbol,
            _descriptionUri,
            _exampleResponseUri,
            _curl,
            _encryptedCurlSecretKey,
            _encryptedApplicationID,
            _encryptedApplicationSecret,
            _regexExtraction,
            _regexValidation,
            _claimFee,
            _benefit,
            _startedAt,
            _finishedAt,
            _endOfPurchaseAt,
            _maxPolicies,
            msg.sender
        );

        poolAddress = address(insurancePool);

        // Store the deployed pool
        allInsurancePools.push(poolAddress);
        insurerToPools[msg.sender].push(poolAddress);
        registeredPools[poolAddress] = true;

        // Emit event
        emit InsurancePoolCreated(
            msg.sender, 
            poolAddress,    
            _name,
            _symbol,
            _descriptionUri,
            _exampleResponseUri,
            _curl,
            _encryptedCurlSecretKey,
            _encryptedApplicationID,
            _encryptedApplicationSecret,
            _regexExtraction,
            _regexValidation,
            _claimFee,
            _benefit,
            _startedAt,
            _finishedAt,
            _endOfPurchaseAt,
            _maxPolicies);
    }

    function getAllInsurancePools() external view returns (address[] memory) {
        return allInsurancePools;
    }

    function getPoolsByInsurer(address _insurer) external view returns (address[] memory) {
        return insurerToPools[_insurer];
    }
}