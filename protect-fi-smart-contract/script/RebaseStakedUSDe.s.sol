// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {USDe} from "./../src/USDe.sol";
import {StakedUSDe} from "./../src/StakedUSDe.sol";

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract RebaseStakedUSDeScript is Script {
    USDe public usde;
    StakedUSDe public sUSDe;

    address private deployer;
    
    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));

        usde = USDe(0xC83af6561Ad7b6f395B0d827F950308BdaeFf6b3);
        sUSDe = StakedUSDe(0x1cEF01bb6844254Eea3701f026D6e873007711Ce);
    }

    function run() public {        
        vm.startBroadcast(deployer);

        uint256 currentStakedUSDePrice = sUSDe.convertToAssets(1e18);

        console.log("current staked usde price / asset price");
        console.log(currentStakedUSDePrice);

        uint256 totalStakedUSDePriceSupply = usde.balanceOf(address(sUSDe));

        console.log("current staked usde / asset");
        console.log(totalStakedUSDePriceSupply);

        usde.transfer(address(sUSDe), 1000e18);
        sUSDe.rebase();

        currentStakedUSDePrice = sUSDe.convertToAssets(1e18);

        console.log("current staked usde price / asset price");
        console.log(currentStakedUSDePrice);

        totalStakedUSDePriceSupply = usde.balanceOf(address(sUSDe));

        console.log("current staked usde / asset");
        console.log(totalStakedUSDePriceSupply);

        vm.stopBroadcast();
    }
}
