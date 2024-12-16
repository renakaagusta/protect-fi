// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the ERC20 interface if not already included
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IInsurancePool is IERC20 {
    // Struct Definitions
    struct Claim {
        address insured;
        uint256 amount;
        uint256 index;
        string proofUri;
        bool isApproved;
    }

    // Getter Functions for Public Variables
    function insurer() external view returns (address);
    function descriptionUri() external view returns (string memory);
    function url() external view returns (string memory);
    function encryptedUrlToken() external view returns (string memory);
    function encryptedApplicationID() external view returns (string memory);
    function encryptedApplicationSecret() external view returns (string memory);
    function regexValidation() external view returns (string memory);
    function pathToValue() external view returns (string memory);
    function approvedValue() external view returns (string memory);
    function coverageAmount() external view returns (uint256);
    function startedAt() external view returns (uint256);
    function finishedAt() external view returns (uint256);
    function endOfPurchaseAt() external view returns (uint256);
    function maxPolicies() external view returns (uint256);
    function totalMintPolicies() external view returns (uint256);
    function latestClaimNum() external view returns (uint32);

    // External/Public Function Signatures
    function getSubmittedClaimsLength() external view returns(uint256);
    function getSubmittedClaim(uint256 claimIndex) external view returns(Claim memory);
    function purchasePolicy(uint256 shares, uint256 assetsInUSDe, address insured) external;
    function submitClaim() external;
    function approveClaimSpending(Claim calldata claim) external;
    function respondToClaim(Claim calldata claim) external;
    function withdraw() external;
    function transferInsurer(address _insurer) external;
    function initialDeposit() external;
    function previewDepositInUSDe(uint256 assetsInUSDe) external view returns (uint256);
    function previewMintInUSDe(uint256 shares) external view returns (uint256);
    function updateYield() external;

    // Events
    event PolicyPurchased(address indexed insured, uint256 shares);
    event ClaimSubmitted(uint32 claimNum, Claim claim);
    event ClaimApproved(uint256 indexed claimIndex, Claim claim);
    event ClaimRejected(uint256 indexed claimIndex, Claim claim);
    event Withdraw(uint256 withdrawAmount);
    event TransferInsurer(address indexed oldInsurer, address indexed newInsurer);
    event Deposit(address indexed from, uint256 amount);
    event Stake(uint256 amount);
    event YieldUpdated(uint256 totalAssetInUSDe, uint256 yield);
}