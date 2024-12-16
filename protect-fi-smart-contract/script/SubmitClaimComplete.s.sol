// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {IInsurancePool} from "./../src/IInsurancePool.sol";
import {IInsuranceFactory} from "./../src/IInsuranceFactory.sol";
import {InsuranceFactory} from "./../src/InsuranceFactory.sol";
import {IInsuranceServiceManager} from "./../src/IInsuranceServiceManager.sol";
import {USDe} from "./../src/USDe.sol";

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

contract SubmitClaimCompleteScript is Script {
    address private deployer;

    uint256 storageFee = 5;
    uint256 withdrawFee = 10;

    address usde = 0xb92f2429cc0a87dB45163efaC38Db15679cd3336;
    address stakedUSDe = 0xf86D37BaFFa5B4c7974994Dd1eA25949fF18d0E1;

    address serviceManager = 0x0A16A47E43F6f3644F3f024BDA121120390373f6;
    InsuranceFactory insuranceFactory;
    address insurancePool;
    
    string publicKey;

    address insurer;

    string name;
    string symbol;
    string descriptionUri;
    string exampleResponseUri;
    string curl;
    string encryptedCurlSecretKey;
    string encryptedApplicationID;
    string encryptedApplicationSecret;
    string regexExtraction;
    string regexValidation;
    uint256 claimFee;
    uint256 benefit;
    uint256 startedAt;
    uint256 finishedAt;
    uint256 endOfPurchaseAt;
    uint256 maxPolicies;

    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));
        publicKey = vm.envString("PUBLIC_KEY");

        name = "Indodax Insurance";
        symbol = "IDXI";
        descriptionUri = "http://res.cloudinary.com/renakaagusta/raw/upload/v1732642263/indodax.md";
        exampleResponseUri = "https://res.cloudinary.com/renakaagusta/raw/upload/v1732642264/indodax.json";
        curl = "curl -X GET 'https://api.npoint.io/c9aa3e8003aceb1b9b52' --header 'content-type: application/json' --header 'x-api-key: SECRET_KEY'";
        encryptedCurlSecretKey = "04278d1a2ff5452c89e714699a77f81627a9a5875104c0809cf9e0f6dacf5a2c0dd840586a64cfa89b2d104107b5cfd8569f965e6f75cc4eac59955f28d7f1cc70570e667caf233e4eacbc8ebf952fa581e53dae7153515992c681d9df58acfb42";
        encryptedApplicationID = "04fab08cf72b5eac277e68f04b45e288d2ee68c4f1696e442e8c03ec7274c7d9da83c0dc614b840e518a4d4fd255a7ee8c9cdb04ceba84eea621ac41265c5a5ac80eacdfe3dd294d813774c1a1ccaedf95e967cbaf554b6c577555e4f64fbd265d4dbf5365c722956afe93d7ad66ca2a87090ddc38e504d6388e6a919b347d2655588e6a11231d2406ddce";
        encryptedApplicationSecret = "04927edf4654b8f312250ff8fd6c03cc4fbfdcbfc2d5a27985942bf3921131fac7073d4e9ad43a5c679c3f172e487405aa149b04a6ed907bbbcd33ed2d60cb46720e027bdf21c27ec15469e5f63b1228a75fa641a55b5bcb3feb37dfa050fa987a14c27dca48b92eea19181c325e76d9d3f751018e8743c45fa66fea07f5f0151aab335a14fe29a7ecc2a28c01910fbe5f541ce1f3a1eb4625fbcd824a35503a4d002b";
        regexExtraction = '\\{"data":\\{"rekts":\\[(?<extractedValue>.*?)\\]\\}\\}';
        regexValidation = '"projectName"\\s*:\\s*"Indodax",\\s*"fundsLost"\\s*:\\s*"([0-9]{5,})"';
        claimFee = 5e9;
        benefit = 3;
        startedAt = block.timestamp;
        finishedAt = block.timestamp + 30 days;
        endOfPurchaseAt = block.timestamp + 28 days;
        maxPolicies = 5e18;

        // name = "USDT Price Stability Insurance";
        // symbol = "USDTI";
        // descriptionUri = "http://res.cloudinary.com/renakaagusta/raw/upload/v1732642263/usdt.md";
        // exampleResponseUri = "https://res.cloudinary.com/renakaagusta/raw/upload/v1732642264/indodax.json";
        // curl = "curl -X GET 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd' --header 'content-type: application/json'";
        // encryptedCurlSecretKey = "04278d1a2ff5452c89e714699a77f81627a9a5875104c0809cf9e0f6dacf5a2c0dd840586a64cfa89b2d104107b5cfd8569f965e6f75cc4eac59955f28d7f1cc70570e667caf233e4eacbc8ebf952fa581e53dae7153515992c681d9df58acfb42";
        // encryptedApplicationID = "04fab08cf72b5eac277e68f04b45e288d2ee68c4f1696e442e8c03ec7274c7d9da83c0dc614b840e518a4d4fd255a7ee8c9cdb04ceba84eea621ac41265c5a5ac80eacdfe3dd294d813774c1a1ccaedf95e967cbaf554b6c577555e4f64fbd265d4dbf5365c722956afe93d7ad66ca2a87090ddc38e504d6388e6a919b347d2655588e6a11231d2406ddce";
        // encryptedApplicationSecret = "04927edf4654b8f312250ff8fd6c03cc4fbfdcbfc2d5a27985942bf3921131fac7073d4e9ad43a5c679c3f172e487405aa149b04a6ed907bbbcd33ed2d60cb46720e027bdf21c27ec15469e5f63b1228a75fa641a55b5bcb3feb37dfa050fa987a14c27dca48b92eea19181c325e76d9d3f751018e8743c45fa66fea07f5f0151aab335a14fe29a7ecc2a28c01910fbe5f541ce1f3a1eb4625fbcd824a35503a4d002b";
        // regexExtraction = '\\{"tether":\\{"usd":(?<price>[\\d.]+)\\}\\}';
        // regexValidation = '^(?:0\\.(?:9[5-9]|9\\d)|1\\.(?:0[0-5]|00))$';
        // claimFee = 4e9;
        // benefit = 4;
        // startedAt = block.timestamp;
        // finishedAt = block.timestamp + 20 days;
        // endOfPurchaseAt = block.timestamp + 15 days;
        // maxPolicies = 2e18;

        // name = "Rice Price Protection Insurance";
        // symbol = "RICEI";
        // descriptionUri = "http://res.cloudinary.com/renakaagusta/raw/upload/v1732642263/indodax.md";
        // exampleResponseUri = "https://res.cloudinary.com/renakaagusta/raw/upload/v1732642264/indodax.json";
        // curl = "curl -X GET 'https://api.npoint.io/c9aa3e8003aceb1b9b52' --header 'content-type: application/json' --header 'x-api-key: SECRET_KEY'";
        // encryptedCurlSecretKey = "04278d1a2ff5452c89e714699a77f81627a9a5875104c0809cf9e0f6dacf5a2c0dd840586a64cfa89b2d104107b5cfd8569f965e6f75cc4eac59955f28d7f1cc70570e667caf233e4eacbc8ebf952fa581e53dae7153515992c681d9df58acfb42";
        // encryptedApplicationID = "04fab08cf72b5eac277e68f04b45e288d2ee68c4f1696e442e8c03ec7274c7d9da83c0dc614b840e518a4d4fd255a7ee8c9cdb04ceba84eea621ac41265c5a5ac80eacdfe3dd294d813774c1a1ccaedf95e967cbaf554b6c577555e4f64fbd265d4dbf5365c722956afe93d7ad66ca2a87090ddc38e504d6388e6a919b347d2655588e6a11231d2406ddce";
        // encryptedApplicationSecret = "04927edf4654b8f312250ff8fd6c03cc4fbfdcbfc2d5a27985942bf3921131fac7073d4e9ad43a5c679c3f172e487405aa149b04a6ed907bbbcd33ed2d60cb46720e027bdf21c27ec15469e5f63b1228a75fa641a55b5bcb3feb37dfa050fa987a14c27dca48b92eea19181c325e76d9d3f751018e8743c45fa66fea07f5f0151aab335a14fe29a7ecc2a28c01910fbe5f541ce1f3a1eb4625fbcd824a35503a4d002b";
        // regexExtraction = '\\{"data":\\{"rekts":\\[(?<extractedValue>.*?)\\]\\}\\}';
        // regexValidation = '"projectName"\\s*:\\s*"Indodax",\\s*"fundsLost"\\s*:\\s*"([0-9]{8,})"';
        // claimFee = 4e9;
        // benefit = 4;
        // startedAt = block.timestamp;
        // finishedAt = block.timestamp + 20 days;
        // endOfPurchaseAt = block.timestamp + 15 days;
        // maxPolicies = 2e18;

        // name = "San Francisco Earthquake Insurance";
        // symbol = "EARTHI";
        // descriptionUri = "http://res.cloudinary.com/renakaagusta/raw/upload/v1732642263/indodax.md";
        // exampleResponseUri = "https://res.cloudinary.com/renakaagusta/raw/upload/v1732642264/indodax.json";
        // curl = "curl -X GET 'https://api.npoint.io/c9aa3e8003aceb1b9b52' --header 'content-type: application/json' --header 'x-api-key: SECRET_KEY'";
        // encryptedCurlSecretKey = "04278d1a2ff5452c89e714699a77f81627a9a5875104c0809cf9e0f6dacf5a2c0dd840586a64cfa89b2d104107b5cfd8569f965e6f75cc4eac59955f28d7f1cc70570e667caf233e4eacbc8ebf952fa581e53dae7153515992c681d9df58acfb42";
        // encryptedApplicationID = "04fab08cf72b5eac277e68f04b45e288d2ee68c4f1696e442e8c03ec7274c7d9da83c0dc614b840e518a4d4fd255a7ee8c9cdb04ceba84eea621ac41265c5a5ac80eacdfe3dd294d813774c1a1ccaedf95e967cbaf554b6c577555e4f64fbd265d4dbf5365c722956afe93d7ad66ca2a87090ddc38e504d6388e6a919b347d2655588e6a11231d2406ddce";
        // encryptedApplicationSecret = "04927edf4654b8f312250ff8fd6c03cc4fbfdcbfc2d5a27985942bf3921131fac7073d4e9ad43a5c679c3f172e487405aa149b04a6ed907bbbcd33ed2d60cb46720e027bdf21c27ec15469e5f63b1228a75fa641a55b5bcb3feb37dfa050fa987a14c27dca48b92eea19181c325e76d9d3f751018e8743c45fa66fea07f5f0151aab335a14fe29a7ecc2a28c01910fbe5f541ce1f3a1eb4625fbcd824a35503a4d002b";
        // regexExtraction = '\\{"data":\\{"rekts":\\[(?<extractedValue>.*?)\\]\\}\\}';
        // regexValidation = '"projectName"\\s*:\\s*"Indodax",\\s*"fundsLost"\\s*:\\s*"([0-9]{8,})"';
        // claimFee = 4e9;
        // benefit = 4;
        // startedAt = block.timestamp;
        // finishedAt = block.timestamp + 20 days;
        // endOfPurchaseAt = block.timestamp + 15 days;
        // maxPolicies = 2e18;
    }

    function run() public {        
        vm.startBroadcast(deployer);

        USDe(usde).mint(address(deployer), 1000 * 10**18);
        USDe(usde).mint(vm.rememberKey(vm.envUint("PRIVATE_KEY_2")), 100 * 10**18);

        IERC20(usde).approve(stakedUSDe, 10 * 10**18);
        
        IERC4626(stakedUSDe).deposit(10 * 10**18, deployer);

        uint256 usdeBalance = IERC20(usde).balanceOf(deployer);

        console.log("current usde balance");
        console.log(usdeBalance);

        insuranceFactory = new InsuranceFactory(usde, stakedUSDe, serviceManager, storageFee, withdrawFee);

        IInsuranceServiceManager(serviceManager).initialize(address(insuranceFactory), publicKey);

        console.log("Deployed insurance factory at:", address(insuranceFactory));

        vm.stopBroadcast();

        vm.startBroadcast(deployer);

        uint256 balance = IERC20(usde).balanceOf(deployer);
        
        insurancePool = IInsuranceFactory(address(insuranceFactory)).createInsurancePool(
            name,
            symbol,
            descriptionUri,
            exampleResponseUri,
            curl,
            encryptedCurlSecretKey,
            encryptedApplicationID,
            encryptedApplicationSecret,
            regexExtraction,
            regexValidation,
            claimFee,
            benefit,
            startedAt,
            finishedAt,
            endOfPurchaseAt,
            maxPolicies
        );

        IERC20(usde).approve(insurancePool, maxPolicies * benefit);

        IInsurancePool(insurancePool).initialDeposit();

        console.log("Deployed insurance pool at:", insurancePool);

        vm.stopBroadcast();

        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY_2"));

        vm.startBroadcast(deployer);
        
        usdeBalance = IERC20(usde).balanceOf(deployer);

        console.log("current usde buyer balance");
        console.log(usdeBalance);

        uint256 policies = IERC20(insurancePool).balanceOf(deployer);

        console.log("initial policies");
        console.log(policies);

        uint256 shares = 2e18;
        uint256 assetsInUSDe = IInsurancePool(insurancePool).previewMintInUSDe(shares);

        console.log("assetsInUSDe");
        console.log(assetsInUSDe);

        IERC20(usde).approve(insurancePool, assetsInUSDe);

        IInsurancePool(insurancePool).purchasePolicy(shares, assetsInUSDe, deployer);

        policies = IERC20(insurancePool).balanceOf(deployer);

        console.log("current policies");
        console.log(policies);

        policies = IERC20(insurancePool).balanceOf(deployer);

        console.log("usde balance");
        console.log(IERC20(usde).balanceOf(address(deployer)));
        console.log(claimFee);

        IERC20(usde).approve(insurancePool, claimFee + storageFee);

        IInsurancePool(insurancePool).submitClaim();

        policies = IERC20(insurancePool).balanceOf(deployer);

        console.log("current policies");
        console.log(policies);

        vm.stopBroadcast();
    }
}
