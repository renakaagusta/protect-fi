// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IInsuranceFactory {
    // Event emitted when a new insurance pool is created
    event InsurancePoolCreated(address indexed insurer, address insurancePoolAddress);

    // State variables (public getters are automatically generated)
    function allInsurancePools(uint256) external view returns (address);
    function insurerToPools(address, uint256) external view returns (address);
    function registeredPools(address) external view returns (bool);
    function serviceManager() external view returns (address);

    // Functions to retrieve insurance pools
    function getAllInsurancePools() external view returns (address[] memory);
    function getPoolsByInsurer(address _insurer) external view returns (address[] memory);
}