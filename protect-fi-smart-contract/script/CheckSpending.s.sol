// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {IInsurancePool} from "./../src/IInsurancePool.sol";

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract CheckSpendingScript is Script {
    address private deployer;

    address usde = 0xb60971942E4528A811D24826768Bc91ad1383D21;
    address stakedUSDe = 0xD185B4846E5fd5419fD4D077dc636084BEfC51C0;
    address serviceManager = 0x1D7509613056c3d6D319C599aBaB85A57E731FB3;
    address insurancePool = 0x455c5719Cc7c39420c3dA84a5E26de2c859DD3a4;

    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY_2"));
    }

    function run() public {        
        vm.startBroadcast(deployer);

        uint256 allowance = IERC20(stakedUSDe).allowance(insurancePool, serviceManager);

        console.log("allowance service manager");
        console.log(allowance);

        vm.stopBroadcast();
    }
}
