// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IInsuranceFactory {
    // Event emitted when a new insurance pool is created
    event InsurancePoolCreated(
        address indexed insurer, 
        address indexed poolAddress, 
        string poolName,
        string symbol,
        string descriptionUri,
        string exampleResponseUri,
        string curl,
        string encryptedCurlSecretKey,
        string encryptedApplicationID,
        string encryptedApplicationSecret,
        string regexExtraction,
        string regexValidation,
        uint256 claimFee,
        uint256 benefit,
        uint256 startedAt,
        uint256 finishedAt,
        uint256 endOfPurchaseAt,
        uint256 maxPolicies);

    // State variables (public getters are automatically generated)
    function allInsurancePools(uint256) external view returns (address);
    function insurerToPools(address, uint256) external view returns (address);
    function registeredPools(address) external view returns (bool);
    function serviceManager() external view returns (address);
    function updateStorageFee(uint256 _storageFee) external;

    // Functions to retrieve insurance pools
    function getAllInsurancePools() external view returns (address[] memory);
    function getPoolsByInsurer(address _insurer) external view returns (address[] memory);
    
    function storageFee() external view returns(uint256);
    function withdrawFee() external view returns(uint256);

    function owner() external view returns(address);
    function usde() external view returns(address);
    function stakedUSDe() external view returns(address);

    // Function to deploy a new pool
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
    ) external returns (address poolAddress);
}