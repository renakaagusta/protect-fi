// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {IInsurancePool} from "./../src/IInsurancePool.sol";

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

interface WETH9 {
    function deposit() external payable;
}

contract PurchasePolicyScript is Script {
    address private deployer;

    address usde = 0x0E0d9103eFCa8731621Dbf690e2442782c5b4f6F;
    address stakedUSDe = 0x49D4E03F0b4D641622b331340636b266fedBdda7;
    // address usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    // address weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    // address router = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    address insurancePool = 0xe3Eb4d433e9139C98A73102C1208e7917ee0ecBC;

    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));
    }

    function run() public {        
        vm.startBroadcast(deployer);

        IERC20(usde).approve(stakedUSDe, 1 * 10**18);
        
        IERC4626(stakedUSDe).deposit(1 * 10**18, deployer);

        uint256 usdeBalance = IERC20(usde).balanceOf(deployer);

        console.log("current usde balance");
        console.log(usdeBalance);

        ERC20(usde).transfer(vm.rememberKey(vm.envUint("PRIVATE_KEY_2")), 1 * 10**18);
        
        vm.stopBroadcast();

        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY_2"));

        vm.startBroadcast(deployer);

        // uint256 ethBalance = deployer.balance / 1 ether;

        // console.log("initial eth balance");
        // console.log(ethBalance);

        // uint256 wethBalance = IERC20(weth).balanceOf(deployer);

        // console.log("initial weth balance");
        // console.log(wethBalance);

        // WETH9(weth).deposit{value: 1 ether}();

        // wethBalance = IERC20(weth).balanceOf(deployer);

        // console.log("current weth balance");
        // console.log(wethBalance);
        
        // IERC20(weth).approve(router, wethBalance);

        // uint256 usdcBalance = IERC20(usdc).balanceOf(deployer);

        // console.log("initial usdc balance");
        // console.log(usdcBalance);

        // ISwapRouter.ExactInputSingleParams memory parameter =  ISwapRouter.ExactInputSingleParams ({
        //     tokenIn: weth,
        //     tokenOut: usdc,
        //     fee: 3000,
        //     recipient: deployer,
        //     deadline: block.timestamp * 2,
        //     amountIn: wethBalance,
        //     amountOutMinimum: 0,
        //     sqrtPriceLimitX96: 0
        // });

        // uint256 amountOut = ISwapRouter(router).exactInputSingle(parameter);

        // console.log("amount out usdc balance");
        // console.log(amountOut);

        // usdcBalance = IERC20(usdc).balanceOf(deployer);

        // console.log("current usdc balance");
        // console.log(usdcBalance);

        // IERC20(usdc).approve(router, usdcBalance);

        // uint256 usdeBalance = IERC20(usde).balanceOf(deployer);

        // console.log("initial usde balance");
        // console.log(usdeBalance);

        // parameter =  ISwapRouter.ExactInputSingleParams ({
        //     tokenIn: usdc,
        //     tokenOut: usde,
        //     fee: 100,
        //     recipient: deployer,
        //     deadline: block.timestamp * 2,
        //     amountIn: 1000,
        //     amountOutMinimum: 0,
        //     sqrtPriceLimitX96: 0
        // });

        // amountOut = ISwapRouter(router).exactInputSingle(parameter);

        // console.log("amount out usde balance");
        // console.log(amountOut);

        usdeBalance = IERC20(usde).balanceOf(deployer);

        console.log("current usde balance");
        console.log(usdeBalance);

        uint256 policies = IERC20(insurancePool).balanceOf(deployer);

        console.log("initial policies");
        console.log(policies);

        uint256 shares = 2e7;
        uint256 assetsInUSDe = IInsurancePool(insurancePool).previewMintInUSDe(shares);

        console.log("assetsInUSDe");
        console.log(assetsInUSDe);

        IERC20(usde).approve(insurancePool, assetsInUSDe);

        IInsurancePool(insurancePool).purchasePolicy(shares, assetsInUSDe, deployer);

        policies = IERC20(insurancePool).balanceOf(deployer);

        console.log("current policies");
        console.log(policies);

        vm.stopBroadcast();
    }
}
