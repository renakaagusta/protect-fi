// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/Test.sol";
import {InsuranceDeploymentLib} from "./utils/InsuranceDeploymentLib.sol";
import {CoreDeploymentLib} from "./utils/CoreDeploymentLib.sol";
import {UpgradeableProxyLib} from "./utils/UpgradeableProxyLib.sol";
import {StrategyBase} from "@eigenlayer/contracts/strategies/StrategyBase.sol";
import {ERC20Mock} from "../test/ERC20Mock.sol";
import {TransparentUpgradeableProxy} from
    "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {StrategyFactory} from "@eigenlayer/contracts/strategies/StrategyFactory.sol";
import {StrategyManager} from "@eigenlayer/contracts/core/StrategyManager.sol";


import {
    Quorum,
    StrategyParams,
    IStrategy
} from "@eigenlayer-middleware/src/interfaces/IECDSAStakeRegistryEventsAndErrors.sol";

contract InsuranceDeployer is Script {
    using CoreDeploymentLib for *;
    using UpgradeableProxyLib for address;

    address private deployer;
    address proxyAdmin;
    IStrategy insuranceStrategy;
    CoreDeploymentLib.DeploymentData coreDeployment;
    InsuranceDeploymentLib.DeploymentData insuranceDeployment;
    Quorum internal quorum;
    ERC20Mock token;
    string operatorPublicKey;

    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));
        vm.label(deployer, "Deployer");
        
        coreDeployment = CoreDeploymentLib.readDeploymentJson("deployments/core/", block.chainid);
       
        token = new ERC20Mock();
        insuranceStrategy = IStrategy(StrategyFactory(coreDeployment.strategyFactory).deployNewStrategy(token));

        quorum.strategies.push(
            StrategyParams({strategy: insuranceStrategy, multiplier: 10_000})
        );
    }

    function run() external {
        vm.startBroadcast(0x45d37ea082249aa1349f24663fbcfdc325b4bce530527e929c4356fc925f4f47);
        proxyAdmin = UpgradeableProxyLib.deployProxyAdmin();

        insuranceDeployment =
            InsuranceDeploymentLib.deployContracts(proxyAdmin, coreDeployment, quorum);

        insuranceDeployment.strategy = address(insuranceStrategy);
        insuranceDeployment.token = address(token);
        vm.stopBroadcast();

        verifyDeployment();
        InsuranceDeploymentLib.writeDeploymentJson(insuranceDeployment);
    }

    function verifyDeployment() internal view {
        require(
            insuranceDeployment.stakeRegistry != address(0), "StakeRegistry address cannot be zero"
        );
        require(
            insuranceDeployment.insuranceServiceManager != address(0),
            "InsuranceServiceManager address cannot be zero"
        );
        require(insuranceDeployment.strategy != address(0), "Strategy address cannot be zero");
        require(proxyAdmin != address(0), "ProxyAdmin address cannot be zero");
        require(
            coreDeployment.delegationManager != address(0),
            "DelegationManager address cannot be zero"
        );
        require(coreDeployment.avsDirectory != address(0), "AVSDirectory address cannot be zero");
    }
}
