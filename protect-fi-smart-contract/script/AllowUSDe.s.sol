// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {USDe} from "./../src/USDe.sol";
import {StakedUSDe} from "./../src/StakedUSDe.sol";

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract AllowUSDeScript is Script {
    USDe public usde;
    StakedUSDe public sUSDe;

    address private deployer;
    
    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));

        usde = USDe(0x7C4E0800cc6ba4cfebcdD357afe8BAF65dE95FF3);
        sUSDe = StakedUSDe(0x1182F3FE115Cf641D87cc9DB6725E6167c15e614);
    }

    function run() public {        
        vm.startBroadcast(deployer);

        usde.approve(0x837700C4401C9b95f89eF81990Aa619a3023d78D, 1000000000e18);

        console.log("allowance");
        console.log(usde.allowance(address(deployer), 0x837700C4401C9b95f89eF81990Aa619a3023d78D));

        vm.stopBroadcast();
    }
}
