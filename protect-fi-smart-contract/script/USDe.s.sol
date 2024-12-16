// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {USDe} from "./../src/USDe.sol";
import {StakedUSDe} from "./../src/StakedUSDe.sol";

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract USDeScript is Script {
    USDe public usde;
    StakedUSDe public sUSDe;

    address private deployer;
    
    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));
    }

    function run() public {        
        vm.startBroadcast(deployer);

        usde = new USDe();
        sUSDe = new StakedUSDe(usde);

        console.log("Deployed insurance usde at:", address(usde));
        console.log("Deployed insurance sUSDe at:", address(sUSDe));

        vm.stopBroadcast();
    }
}
