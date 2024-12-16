// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {InsuranceFactory} from "./../src/InsuranceFactory.sol";
import {IInsuranceServiceManager} from "./../src/IInsuranceServiceManager.sol";

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract InsuranceFactoryScript is Script {
    InsuranceFactory public insuranceFactory;
    
    address serviceManager = 0x68E88641112278fACeB6A0e3c679A300951EB928;
    string publicKey;

    address private deployer;
    
    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));
        publicKey = vm.envString("PUBLIC_KEY");
    }

    function run() public {        
        vm.startBroadcast(deployer);

        // insuranceFactory = new InsuranceFactory(serviceManager);

        // IInsuranceServiceManager(serviceManager).initialize(address(insuranceFactory), publicKey);

        // console.log("Deployed insurance factory at:", address(insuranceFactory));

        vm.stopBroadcast();
    }
}
