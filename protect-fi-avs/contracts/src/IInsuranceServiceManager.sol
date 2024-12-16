// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IInsuranceServiceManager {
    struct Claim {
        address pool;
        address insured;
        uint256 amount;
        uint256 index;
        string proofUri;
        uint32 claimCreatedBlock;
        bool isApproved;
    }

    event Initialize(
        address factory,
        string operatorPublicKey
    );

    event NewClaimCreated(
        uint32 indexed claimIndex, 
        Claim claim
    );

    event ClaimResponded(
        uint32 indexed claimIndex, 
        Claim claim, 
        address operator
    );

    /**
     * @notice Creates a new insurance claim
     * @param pool Address of the insurance pool
     * @param insured Address of the insured party
     * @param amount Claim amount
     * @param index Claim index
     */
    function createNewClaim(
        address pool, 
        address insured,
        uint256 amount,
        uint256 index
    ) external;

    /**
     * @notice Initializes the service manager with a factory and operator public key
     * @param _factory Address of the insurance factory
     * @param _operatorPublicKey Public key of the operator
     */
    function initialize(
        address _factory, 
        string calldata _operatorPublicKey
    ) external;

    /**
     * @notice Approves claim spending by an operator
     * @param claim Claim details
     * @param referenceClaimIndex Index of the referenced claim
     * @param signature Operator's signature
     */
    function approveClaimSpending(
        Claim calldata claim,
        uint32 referenceClaimIndex,
        bytes memory signature
    ) external;

    /**
     * @notice Responds to a claim
     * @param claim Claim details
     * @param referenceClaimIndex Index of the referenced claim
     * @param signature Operator's signature
     */
    function respondToClaim(
        Claim calldata claim,
        uint32 referenceClaimIndex,
        bytes memory signature
    ) external;

    /**
     * @notice Retrieves the latest claim number
     * @return Latest claim number
     */
    function latestClaimNum() external view returns (uint32);

    /**
     * @notice Retrieves the operator's public key
     * @return Operator's public key as a string
     */
    function operatorPublicKey() external view returns (string memory);

    /**
     * @notice Retrieves the factory address
     * @return Address of the insurance factory
     */
    function factory() external view returns (address);

    /**
     * @notice Retrieves the claim hash for a specific claim index
     * @param claimIndex Index of the claim
     * @return Claim hash
     */
    function allClaimHashes(uint32 claimIndex) external view returns (bytes32);

    /**
     * @notice Retrieves the claim response for a specific operator and claim index
     * @param operator Address of the operator
     * @param claimIndex Index of the claim
     * @return Claim response bytes
     */
    function allClaimResponses(address operator, uint32 claimIndex) external view returns (bytes memory);
}