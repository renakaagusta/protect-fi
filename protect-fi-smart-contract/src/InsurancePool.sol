// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "lib/openzeppelin-contracts/contracts/utils/math/Math.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol";

import "./IInsuranceFactory.sol";
import "./IInsurancePool.sol";
import "./IInsuranceServiceManager.sol";

contract InsurancePool is IInsurancePool, ERC20 {
    using Math for uint256;

    address public factory;

    uint256 public totalAssetInUSDe;
    uint256 public initialStakedUSDePrice;

    address public insurer;
    string public descriptionUri;
    string public exampleResponseUri;
    string public curl;
    string public encryptedCurlSecretKey;
    string public encryptedApplicationID;
    string public encryptedApplicationSecret;
    string public regexValidation;
    string public regexExtraction;
    string public approvedValue;
    uint256 public claimFee;
    uint256 public benefit;
    uint256 public startedAt;
    uint256 public finishedAt;
    uint256 public endOfPurchaseAt;
    uint256 public maxPolicies;
    uint256 public totalMintPolicies;

    uint32 public latestClaimNum;
    Claim[] public submittedClaims;

    constructor(
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
        uint256 _maxPolicies,
        address _insurer
    ) ERC20(_name, _symbol) {
        descriptionUri = _descriptionUri;
        exampleResponseUri = _exampleResponseUri;
        curl = _curl;
        encryptedCurlSecretKey = _encryptedCurlSecretKey;
        encryptedApplicationID = _encryptedApplicationID;
        encryptedApplicationSecret = _encryptedApplicationSecret;
        regexExtraction = _regexExtraction;
        regexValidation = _regexValidation;
        claimFee = _claimFee;
        benefit = _benefit;
        startedAt = _startedAt;
        finishedAt = _finishedAt;
        endOfPurchaseAt = _endOfPurchaseAt;
        maxPolicies = _maxPolicies;
        insurer = _insurer;
        factory = msg.sender;
    }

    function getSubmittedClaimsLength() external view returns (uint256) {
        return submittedClaims.length;
    }

    function getSubmittedClaim(
        uint256 claimIndex
    ) external view returns (Claim memory) {
        require(
            claimIndex <= submittedClaims.length,
            "Claim index is out of range"
        );

        return submittedClaims[claimIndex];
    }

    function purchasePolicy(
        uint256 shares,
        uint256 assetsInUSDe,
        address insured
    ) external {
        require(
            block.timestamp < endOfPurchaseAt,
            "Policy can't be purchase anymore"
        );
        require(shares > 0, "Amount must be greater than zero");
        require(insured != address(0), "Insured must be a valid address");
        require(
            block.timestamp < endOfPurchaseAt,
            "You have reached the end of policy purchase period"
        );
        require(
            maxPolicies >= shares + totalMintPolicies,
            "Max supply exceeds the max policy shares"
        );

        address usde = IInsuranceFactory(factory).usde();

        require(
            IERC20(usde).balanceOf(msg.sender) >= assetsInUSDe,
            "You don't have enough balance"
        );
        require(
            previewDepositInUSDe(assetsInUSDe) == shares,
            "Sent assets isn't enough"
        );

        _depositUSDe(assetsInUSDe);

        totalMintPolicies += shares;

        emit PolicyPurchased(insured, shares);
    }

    function submitClaim() external {
        require(balanceOf(msg.sender) != 0, "You don't have policies");

        address usde = IInsuranceFactory(factory).usde();

        require(
            ERC20(usde).balanceOf(msg.sender) >= claimFee,
            "Your balance isn't enough to pay the claim fee"
        );
        require(
            ERC20(usde).allowance(msg.sender, address(this)) >= claimFee,
            "Your allowed balance isn't enough to pay the claim fee"
        );

        uint256 storageFee = IInsuranceFactory(factory).storageFee();

        require(
            ERC20(usde).balanceOf(msg.sender) >= storageFee,
            "Your balance isn't enough to pay the storage fee"
        );
        require(
            ERC20(usde).allowance(msg.sender, address(this)) >= storageFee,
            "Your allowed balance isn't enough to pay the storage fee"
        );

        bool success = IERC20(usde).transferFrom(msg.sender, insurer, claimFee);
        require(success, "Failed to pay claim fee");

        success = IERC20(usde).transferFrom(msg.sender, factory, storageFee);
        require(success, "Failed to pay storage fee");

        bool claimHasSubmitted = false;

        for (uint256 i = 0; i < submittedClaims.length; i++) {
            if (submittedClaims[i].insured == msg.sender) {
                claimHasSubmitted = true;
            }
        }

        require(!claimHasSubmitted, "Claim has been submitted");

        uint256 balance = balanceOf(msg.sender);

        Claim memory claim = Claim(
            msg.sender,
            balance,
            submittedClaims.length,
            "",
            false
        );

        submittedClaims.push(claim);

        _burn(msg.sender, balance);
        _mint(address(this), balance);

        address serviceManager = IInsuranceFactory(factory).serviceManager();

        IInsuranceServiceManager(serviceManager).createNewClaim(
            address(this),
            msg.sender,
            balance,
            latestClaimNum
        );

        emit ClaimSubmitted(latestClaimNum, claim);

        latestClaimNum = latestClaimNum + 1;
    }

    function approveClaimSpending(Claim calldata claim) external {
        address serviceManager = IInsuranceFactory(factory).serviceManager();

        require(
            msg.sender == serviceManager,
            "Only service manager can invoke this function"
        );

        address stakedUSDe = IInsuranceFactory(factory).stakedUSDe();

        uint256 sUSDeReceivedAmount = (IERC20(stakedUSDe).balanceOf(
            address(this)
        ) * (submittedClaims[claim.index].amount * benefit)) / totalSupply();

        bool success = IERC20(stakedUSDe).approve(
            serviceManager,
            sUSDeReceivedAmount * 1000
        );
        require(success, "Failed to approve service manager");

        success = IERC20(stakedUSDe).approve(
            msg.sender,
            sUSDeReceivedAmount * 1000
        );
        require(success, "Failed to approve msg.sender");

        success = IERC20(stakedUSDe).approve(
            tx.origin,
            sUSDeReceivedAmount * 1000
        );
        require(success, "Failed to approve tx.origin");
    }

    function respondToClaim(Claim calldata claim) external {
        address serviceManager = IInsuranceFactory(factory).serviceManager();

        require(msg.sender == serviceManager, "Only service manager can invoke this function");

        address stakedUSDe = IInsuranceFactory(factory).stakedUSDe();

        submittedClaims[claim.index].isApproved = claim.isApproved;

        if (claim.isApproved == true) {
            uint256 sUSDeReceivedAmount = (IERC20(stakedUSDe).balanceOf(
                address(this)
            ) * (submittedClaims[claim.index].amount * benefit)) /
                totalSupply();

            IERC20(stakedUSDe).transfer(
                submittedClaims[claim.index].insured,
                sUSDeReceivedAmount
            );

            _burn(address(this), submittedClaims[claim.index].amount);

            emit ClaimApproved(claim.index, claim);
        } else {
            _burn(address(this), submittedClaims[claim.index].amount);
            _mint(claim.insured, submittedClaims[claim.index].amount);

            emit ClaimRejected(claim.index, claim);
        }
    }

    function withdraw() external {
        require(
            block.timestamp > finishedAt,
            "Please wait until the period is end"
        );
        require(msg.sender == insurer, "Only insurer can invoke this function");

        address stakedUSDe = IInsuranceFactory(factory).stakedUSDe();

        uint256 yieldUSDeAmount = ERC4626(stakedUSDe).convertToAssets(1e18) - initialStakedUSDePrice;
        uint256 withdrawFee = (yieldUSDeAmount *
            IInsuranceFactory(factory).withdrawFee()) / 100;

        uint256 withdrawAmount = ERC4626(stakedUSDe).withdraw(
            ERC4626(stakedUSDe).balanceOf(address(this)),
            address(this),
            address(this)
        );

        address usde = IInsuranceFactory(factory).usde();

        IERC20(usde).transfer(factory, withdrawFee);
        IERC20(usde).transfer(insurer, IERC20(usde).balanceOf(address(this)));

        emit Withdraw(withdrawAmount);
    }

    function transferInsurer(address _insurer) external {
        require(msg.sender == insurer, "Only insurer can invoke this function");

        emit TransferInsurer(insurer, _insurer);

        insurer = _insurer;
    }

    function initialDeposit() external {
        require(msg.sender == insurer, "Only insurer can invoke this function");
        require(totalSupply() == 0, "Initial deposit has been sent");

        address usde = IInsuranceFactory(factory).usde();
        address stakedUSDe = IInsuranceFactory(factory).stakedUSDe();

        require(
            IERC20(usde).balanceOf(msg.sender) >= maxPolicies * benefit,
            "Not enough balance"
        );

        _depositUSDe(maxPolicies * benefit);

        initialStakedUSDePrice = ERC4626(stakedUSDe).convertToAssets(1e18);
    }

    function _depositUSDe(uint256 assetsInUSDe) internal {
        address usde = IInsuranceFactory(factory).usde();

        IERC20(usde).transferFrom(msg.sender, address(this), assetsInUSDe);

        uint256 shares = previewDepositInUSDe(assetsInUSDe);

        if (totalSupply() == 0) {
            _mint(address(this), shares);
        } else {
            _mint(msg.sender, shares);
        }

        _stake(assetsInUSDe);

        totalAssetInUSDe += assetsInUSDe;

        emit Deposit(msg.sender, assetsInUSDe);
    }

    function previewDepositInUSDe(
        uint256 assetsInUSDe
    ) public view virtual returns (uint256) {
        return _convertAssetUSDeToShares(assetsInUSDe, Math.Rounding.Floor);
    }

    function previewMintInUSDe(
        uint256 shares
    ) public view virtual returns (uint256) {
        return _convertToAssetsInUSDe(shares, Math.Rounding.Ceil);
    }

    function _convertAssetUSDeToShares(
        uint256 assetsInUSDe,
        Math.Rounding rounding
    ) internal view virtual returns (uint256) {
        return
            assetsInUSDe.mulDiv(
                totalSupply() + 10 ** _decimalsOffset(),
                totalAssetInUSDe + 1,
                rounding
            );
    }

    function _convertToAssetsInUSDe(
        uint256 shares,
        Math.Rounding rounding
    ) internal view virtual returns (uint256) {
        return
            shares.mulDiv(
                totalAssetInUSDe + 1,
                totalSupply() + 10 ** _decimalsOffset(),
                rounding
            );
    }

    function _decimalsOffset() internal view virtual returns (uint8) {
        return 0;
    }

    function _stake(uint256 amount) internal {
        address usde = IInsuranceFactory(factory).usde();
        address stakedUSDe = IInsuranceFactory(factory).stakedUSDe();

        IERC20(usde).approve(address(stakedUSDe), amount);
        ERC4626(stakedUSDe).deposit(amount, address(this));
        emit Stake(amount);
    }
}
