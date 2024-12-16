// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol";

import {Test, console} from "forge-std/Test.sol";
import {InsurancePool} from "../src/InsurancePool.sol";

contract InsurancePoolTest is Test {
    InsurancePool public insurancePool;

    address usde = 0xb60971942E4528A811D24826768Bc91ad1383D21;
    address stakedUSDe = 0xD185B4846E5fd5419fD4D077dc636084BEfC51C0;
    address serviceManager = 0xD185B4846E5fd5419fD4D077dc636084BEfC51C0;

    address insurer;
    address alice;
    address bob;

    string name;
    string symbol;
    string descriptionUri;
    string url;
    string encryptedCurlSecretKey;
    string encryptedApplicationID;
    string encryptedApplicationSecret;
    string approvedValue;
    string regexExtraction;
    string regexValidation;
    uint256 benefit;
    uint256 startedAt;
    uint256 finishedAt;
    uint256 endOfPurchaseAt;
    uint256 maxPolicies;

    function setUp() public {
        address deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY_2"));

        console.log(deployer);

        console.log(address(deployer).balance);

        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));

        console.log(deployer);

        console.log(address(deployer).balance);

        // vm.createSelectFork("https://eth-mainnet.g.alchemy.com/v2/jBG4sMyhez7V13jNTeQKfVfgNa54nCmF", 21197645);

        // insurer = vm.addr(1);
        // alice = vm.addr(2);
        // bob = vm.addr(3);

        // name = "Ethereum Guarantee";
        // symbol = "ETHG";
        // descriptionUri = "https://ethereum.org/id/";
        // url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
        // encryptedCurlSecretKey = "";
        // encryptedApplicationID = "0x55f4f8C941807a3C317a84Be206Bf31BEA27806F";
        // encryptedApplicationSecret = "0x9683bfb2826d5b2852ce6d5e02ae9667b524481537a429ea5a249c4a7e2d0aef";
        // approvedValue = "30";
        // regexExtraction = "\\{\"ethereum\":\\{\"usd\":(?<price>[\\d\\.]+)\\}\\}";
        // regexValidation = ">";
        // benefit = 3;
        // startedAt = block.timestamp;
        // finishedAt = block.timestamp + 30 days;
        // endOfPurchaseAt = block.timestamp + 28 days;
        // maxPolicies = 5e7;

        // vm.deal(insurer, 1000e18);
        // vm.deal(alice, 1000e18);
        // vm.deal(bob, 1000e18);

        // deal(usde, insurer, 200e18);
        // deal(usde, alice, 40e18);
        // deal(usde, bob, 40e18);

        // vm.startPrank(insurer);

        // insurancePool = new InsurancePool(
        //      name,
        //     symbol,
        //     descriptionUri,
        //     url,
        //     encryptedCurlSecretKey,
        //     encryptedApplicationID,
        //     encryptedApplicationSecret,
        //     approvedValue,
        //     regexExtraction,
        //     regexValidation,
        //     benefit,
        //     startedAt,
        //     finishedAt,
        //     endOfPurchaseAt,
        //     maxPolicies,
        //     usde,
        //     stakedUSDe,
        //     serviceManager
        // );

        // IERC20(usde).approve(address(insurancePool), maxPolicies * benefit * 1e18);
        // insurancePool.initialDeposit();

        // vm.stopPrank();
    }

    function test_UserCanPurchasePolicy() public {
        // vm.startPrank(alice);
        // uint256 shares = 30e18;
        // uint256 assetsInUSDe = insurancePool.previewMintInUSDe(shares);
        // IERC20(usde).approve(address(insurancePool), assetsInUSDe);
        // insurancePool.purchasePolicy(shares, assetsInUSDe, alice);
        // vm.stopPrank();
        // vm.startPrank(bob);
        // shares = 20e18;
        // assetsInUSDe = insurancePool.previewMintInUSDe(shares);
        // IERC20(usde).approve(address(insurancePool), assetsInUSDe);
        // insurancePool.purchasePolicy(shares, assetsInUSDe, bob);
        // vm.stopPrank();
        // console.log("Locked shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(address(insurancePool)));
        // console.log("Insurer shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(insurer));
        // console.log("Alice shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(alice));
        // console.log("Bob shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(bob));
        // console.log("Total supply:");
        // console.log(IERC20(address(insurancePool)).totalSupply());
    }

    function test_UserCanNotPurchasePolicyBecuaseExceedsLimit() public {
        // vm.startPrank(alice);
        // uint256 shares = 30e18;
        // uint256 assetsInUSDe = insurancePool.previewMintInUSDe(shares);
        // IERC20(usde).approve(address(insurancePool), assetsInUSDe);
        // insurancePool.purchasePolicy(shares, assetsInUSDe, alice);
        // vm.stopPrank();
        // vm.startPrank(bob);
        // shares = 40e18;
        // assetsInUSDe = insurancePool.previewMintInUSDe(shares);
        // IERC20(usde).approve(address(insurancePool), assetsInUSDe);
        // vm.expectRevert(bytes("Max supply exceeds the max policy shares"));
        // insurancePool.purchasePolicy(shares, assetsInUSDe, bob);
        // vm.stopPrank();
        // console.log("Locked shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(address(insurancePool)));
        // console.log("Insurer shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(insurer));
        // console.log("Alice shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(alice));
        // console.log("Bob shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(bob));
        // console.log("Total supply:");
        // console.log(IERC20(address(insurancePool)).totalSupply());
    }

    function test_Claim() public {
        // vm.startPrank(alice);
        // uint256 shares = 30e18;
        // uint256 assetsInUSDe = insurancePool.previewMintInUSDe(shares);
        // IERC20(usde).approve(address(insurancePool), assetsInUSDe);
        // insurancePool.purchasePolicy(shares, assetsInUSDe, alice);
        // vm.stopPrank();
        // vm.startPrank(bob);
        // shares = 20e18;
        // assetsInUSDe = insurancePool.previewMintInUSDe(shares);
        // IERC20(usde).approve(address(insurancePool), assetsInUSDe);
        // insurancePool.purchasePolicy(shares, assetsInUSDe, bob);
        // vm.stopPrank();
        // console.log("Initial Condition");
        // console.log("Locked shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(address(insurancePool)));
        // console.log("Insurer shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(insurer));
        // console.log("Alice shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(alice));
        // console.log("Bob shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(bob));
        // console.log("Total supply:");
        // console.log(IERC20(address(insurancePool)).totalSupply());
        // vm.startPrank(alice);
        // IERC20(insurancePool).approve(address(insurancePool), IERC20(insurancePool).balanceOf(alice));
        // insurancePool.submitClaim();
        // vm.stopPrank();
        // console.log("Current Condition");
        // console.log("Locked shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(address(insurancePool)));
        // console.log("Insurer shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(insurer));
        // console.log("Alice shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(alice));
        // console.log("Bob shares:");
        // console.log(IERC20(address(insurancePool)).balanceOf(bob));
        // console.log("Total supply:");
        // console.log(IERC20(address(insurancePool)).totalSupply());
    }
}
