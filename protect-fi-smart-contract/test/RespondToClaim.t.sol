// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Test, console} from "forge-std/Test.sol";
import {IInsuranceFactory} from "./../src/IInsuranceFactory.sol";
import {IInsurancePool} from "./../src/IInsurancePool.sol";
import {IInsuranceServiceManager} from "./../src/IInsuranceServiceManager.sol";

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

contract RespondToClaimTest is Test {
    using Strings for uint256;

    address private deployer;

    address usde = 0x94BAa979F569eDb2F33903D9cCec66b31c9620F5;
    address stakedUSDe = 0x654837fE31838Bd0391188182a3Ecdd402846D3a;
    address serviceManager = 0xB8F7e142B1F8a715013fa8B6c2A1d999E2721E3D;
    address insurancePool = 0x0CB801436790EeB677fB4f5fDFFEa657de65b755;
    address operator = 0x34728aF7D0FC03CbbdFF82b6d52AeDA8C999E2B2;
    address insured = 0x94c83a5137751C4E6acc0cFdB09819B0B83582D1;
    uint256 amount = 20000000;
    uint256 index = 0;

    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));
    }

    function test_RespondToClaim() public {        
        // vm.startPrank(serviceManager);

        // uint256 claimIndex = IInsurancePool(insurancePool).getSubmittedClaimsLength() - 1;
        // IInsurancePool.Claim memory claim = IInsurancePool(insurancePool).getSubmittedClaim(claimIndex);
        // claim.isApproved = true;

        // uint256 allowance = IERC20(stakedUSDe).allowance(insurancePool, serviceManager);

        // console.log("allowance service manager");
        // console.log(allowance);

        // IInsurancePool(insurancePool).respondToClaim(claim);

        vm.startPrank(operator);

        address serviceManager = IInsuranceFactory(0x2370113332CCfec15c0B3D89d136B0BFBb3134e2).serviceManager();

        console.log("service manager");
        console.log(serviceManager);

        address stakedUSDe = IInsuranceFactory(0x2370113332CCfec15c0B3D89d136B0BFBb3134e2).stakedUSDe();

        console.log("staked usde");
        console.log(stakedUSDe);

        uint256 claimIndex = IInsurancePool(insurancePool).getSubmittedClaimsLength() - 1;
        IInsurancePool.Claim memory claim = IInsurancePool(insurancePool).getSubmittedClaim(claimIndex);
        claim.isApproved = true;

        uint256 allowance = IERC20(stakedUSDe).allowance(insurancePool, serviceManager);

        console.log("allowance service manager");
        console.log(allowance);

        IInsuranceServiceManager.Claim memory serviceClaim = IInsuranceServiceManager.Claim(insurancePool, claim.insured, claim.amount, claim.index, "https://peach-elegant-hornet-957.mypinata.cloud/ipfs/bafkreieba7q7wyigbgf3rgpr57qy3xokgc5ifrfuocqvqrnrdngsx2aale", 0, true);

        IInsuranceServiceManager(serviceManager).approveClaimSpending(serviceClaim, uint32(claimIndex), "");

        IInsuranceServiceManager(serviceManager).respondToClaim(serviceClaim, uint32(claimIndex), "");
    }
}
