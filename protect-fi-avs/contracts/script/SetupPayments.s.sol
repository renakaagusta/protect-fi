// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {InsuranceDeploymentLib} from "./utils/InsuranceDeploymentLib.sol";
import {CoreDeploymentLib} from "./utils/CoreDeploymentLib.sol";
import {SetupPaymentsLib} from "./utils/SetupPaymentsLib.sol";
import {IRewardsCoordinator} from "@eigenlayer/contracts/interfaces/IRewardsCoordinator.sol";

contract SetupPayments is Script {
    struct PaymentInfo {
        address[] earners;
        bytes32[] earnerTokenRoots;
        address recipient;
        uint256 numPayments;
        uint256 amountPerPayment;
        uint32 duration;
        uint32 startTimestamp;
        uint32 endTimestamp;
        uint256 indexToProve;
    }

    address private deployer;
    CoreDeploymentLib.DeploymentData coreDeployment;
    InsuranceDeploymentLib.DeploymentData insuranceDeployment;
    string internal constant filePath = "test/mockData/scratch/payments.json";

    uint256 constant NUM_TOKEN_EARNINGS = 1;
    uint256 constant DURATION = 1 weeks;

    function setUp() public {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));
        vm.label(deployer, "Deployer");

        coreDeployment = CoreDeploymentLib.readDeploymentJson("deployments/core/", block.chainid);
        insuranceDeployment = InsuranceDeploymentLib.readDeploymentJson("deployments/insurance/", block.chainid);

        // TODO: Get the filePath from config
    }

    function run() external {
        vm.startBroadcast(0x45d37ea082249aa1349f24663fbcfdc325b4bce530527e929c4356fc925f4f47);
        IRewardsCoordinator(coreDeployment.rewardsCoordinator).setRewardsUpdater(deployer);
        PaymentInfo memory info = abi.decode(vm.parseJson(vm.readFile(filePath)), (PaymentInfo));

        createAVSRewardsSubmissions(info.numPayments, info.amountPerPayment, info.duration, info.startTimestamp);
        submitPaymentRoot(info.earners, info.endTimestamp, uint32(info.numPayments), uint32(info.amountPerPayment));

        IRewardsCoordinator.EarnerTreeMerkleLeaf memory earnerLeaf = IRewardsCoordinator.EarnerTreeMerkleLeaf({
            earner: info.earners[info.indexToProve],
            earnerTokenRoot: info.earnerTokenRoots[info.indexToProve]
        });

        processClaim(filePath, info.indexToProve, info.recipient, earnerLeaf);

        vm.stopBroadcast();
    }


    function createAVSRewardsSubmissions(uint256 numPayments, uint256 amountPerPayment, uint32 duration, uint32 startTimestamp) public {
        SetupPaymentsLib.createAVSRewardsSubmissions(
            IRewardsCoordinator(coreDeployment.rewardsCoordinator),
            insuranceDeployment.strategy,
            numPayments,
            amountPerPayment,
            duration,
            startTimestamp
        );
    }

    function processClaim(string memory filePath, uint256 indexToProve, address recipient, IRewardsCoordinator.EarnerTreeMerkleLeaf memory earnerLeaf) public {
        SetupPaymentsLib.processClaim(
            IRewardsCoordinator(coreDeployment.rewardsCoordinator),
            filePath,
            indexToProve,
            recipient,
            earnerLeaf,
            NUM_TOKEN_EARNINGS,
            insuranceDeployment.strategy
        );
    }

    function submitPaymentRoot(address[] memory earners, uint32 endTimestamp, uint32 numPayments, uint32 amountPerPayment) public {
        bytes32[] memory tokenLeaves = SetupPaymentsLib.createTokenLeaves(
            IRewardsCoordinator(coreDeployment.rewardsCoordinator), 
            NUM_TOKEN_EARNINGS, 
            amountPerPayment, 
            insuranceDeployment.strategy
        );
        IRewardsCoordinator.EarnerTreeMerkleLeaf[] memory earnerLeaves = SetupPaymentsLib.createEarnerLeaves(earners, tokenLeaves);

        SetupPaymentsLib.submitRoot(
            IRewardsCoordinator(coreDeployment.rewardsCoordinator),
            tokenLeaves,
            earnerLeaves,
            insuranceDeployment.strategy,
            endTimestamp,
            numPayments, 
            NUM_TOKEN_EARNINGS,
            filePath
        );
    }
}