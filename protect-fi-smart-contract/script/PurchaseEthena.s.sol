// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {InsurancePool} from "./../src/InsurancePool.sol";

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

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

contract PurchaseEthenaScript is Script {
    address private deployer;

    address usde = 0xb60971942E4528A811D24826768Bc91ad1383D21;
    address stakedUSDe = 0xD185B4846E5fd5419fD4D077dc636084BEfC51C0;
    address usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address router = 0xE592427A0AEce92De3Edee1F18E0157C05861564;

    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));
    }

    function run() public {        
        vm.startBroadcast(deployer);
        
        uint256 ethBalance = deployer.balance / 1 ether;

        console.log("initial eth balance");
        console.log(ethBalance);

        uint256 wethBalance = IERC20(weth).balanceOf(deployer);

        console.log("initial weth balance");
        console.log(wethBalance);

        WETH9(weth).deposit{value: 1 ether}();

        wethBalance = IERC20(weth).balanceOf(deployer);

        console.log("current weth balance");
        console.log(wethBalance);
        
        IERC20(weth).approve(router, wethBalance);

        uint256 usdcBalance = IERC20(usdc).balanceOf(deployer);

        console.log("initial usdc balance");
        console.log(usdcBalance);

        ISwapRouter.ExactInputSingleParams memory parameter =  ISwapRouter.ExactInputSingleParams ({
            tokenIn: weth,
            tokenOut: usdc,
            fee: 3000,
            recipient: deployer,
            deadline: block.timestamp * 2,
            amountIn: wethBalance,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });

        uint256 amountOut = ISwapRouter(router).exactInputSingle(parameter);

        console.log("amount out usdc balance");
        console.log(amountOut);

        usdcBalance = IERC20(usdc).balanceOf(deployer);

        console.log("current usdc balance");
        console.log(usdcBalance);

        IERC20(usdc).approve(router, usdcBalance);

        uint256 usdeBalance = IERC20(usde).balanceOf(deployer);

        console.log("initial usde balance");
        console.log(usdeBalance);

        parameter =  ISwapRouter.ExactInputSingleParams ({
            tokenIn: usdc,
            tokenOut: usde,
            fee: 100,
            recipient: deployer,
            deadline: block.timestamp * 2,
            amountIn: 1000,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });

        amountOut = ISwapRouter(router).exactInputSingle(parameter);

        console.log("amount out usde balance");
        console.log(amountOut);

        usdeBalance = IERC20(usde).balanceOf(deployer);

        console.log("current usde balance");
        console.log(usdeBalance);

        vm.stopBroadcast();
    }
}
