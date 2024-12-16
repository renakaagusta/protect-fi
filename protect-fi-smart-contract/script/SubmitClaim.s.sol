// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {IInsurancePool} from "./../src/IInsurancePool.sol";

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract SubmitClaimScript is Script {
    address private deployer;

    address usde = 0xb92f2429cc0a87dB45163efaC38Db15679cd3336;
    address stakedUSDe = 0xf86D37BaFFa5B4c7974994Dd1eA25949fF18d0E1;
    address insurancePool = 0x612e4b2Db6EAc59CC1C114490f993de2706f4Fc2;

    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY_2"));
    }

    function run() public {        
        vm.startBroadcast(deployer);

        uint256 policies = IERC20(insurancePool).balanceOf(deployer);

        console.log("initial policies");
        console.log(policies);

        IInsurancePool(insurancePool).submitClaim();

        policies = IERC20(insurancePool).balanceOf(deployer);

        console.log("current policies");
        console.log(policies);

        vm.stopBroadcast();
    }
}
