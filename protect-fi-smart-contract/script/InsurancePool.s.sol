// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {IInsuranceFactory} from "./../src/IInsuranceFactory.sol";
import {IInsurancePool} from "./../src/IInsurancePool.sol";

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract InsurancePoolScript is Script {
    address private deployer;

    address usde = 0x0E0d9103eFCa8731621Dbf690e2442782c5b4f6F;
    address stakedUSDe = 0x49D4E03F0b4D641622b331340636b266fedBdda7;
    address serviceManager = 0x68E88641112278fACeB6A0e3c679A300951EB928;
    address insuranceFactory = 0x4AA497D8d45ED779113F22BD07b63bf8Cfb6Eb27;
    address insurancePool;

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

        name = "Indodax Insurance";
        symbol = "IDXI";
        descriptionUri = "https://github.com/btcid/indodax-official-api-docs/blob/master/README.md";
        exampleResponseUri = "https://res.cloudinary.com/renakaagusta/raw/upload/v1732642264/indodax.json";
        curl = "curl --location --globoff 'https://api.npoint.io/c9aa3e8003aceb1b9b52' --header 'content-type: application/json' --header 'x-api-key: SECRET_KEY'";
        encryptedCurlSecretKey = "04278d1a2ff5452c89e714699a77f81627a9a5875104c0809cf9e0f6dacf5a2c0dd840586a64cfa89b2d104107b5cfd8569f965e6f75cc4eac59955f28d7f1cc70570e667caf233e4eacbc8ebf952fa581e53dae7153515992c681d9df58acfb42";
        encryptedApplicationID = "04fab08cf72b5eac277e68f04b45e288d2ee68c4f1696e442e8c03ec7274c7d9da83c0dc614b840e518a4d4fd255a7ee8c9cdb04ceba84eea621ac41265c5a5ac80eacdfe3dd294d813774c1a1ccaedf95e967cbaf554b6c577555e4f64fbd265d4dbf5365c722956afe93d7ad66ca2a87090ddc38e504d6388e6a919b347d2655588e6a11231d2406ddce";
        encryptedApplicationSecret = "04927edf4654b8f312250ff8fd6c03cc4fbfdcbfc2d5a27985942bf3921131fac7073d4e9ad43a5c679c3f172e487405aa149b04a6ed907bbbcd33ed2d60cb46720e027bdf21c27ec15469e5f63b1228a75fa641a55b5bcb3feb37dfa050fa987a14c27dca48b92eea19181c325e76d9d3f751018e8743c45fa66fea07f5f0151aab335a14fe29a7ecc2a28c01910fbe5f541ce1f3a1eb4625fbcd824a35503a4d002b";
        regexExtraction = '\\{"data":\\{"rekts":\\[(?<extractedValue>.*?)\\]\\}\\}';
        regexValidation = '"projectName":\\s*"Indodax"';
        claimFee = 5e9;
        benefit = 3;
        startedAt = block.timestamp;
        finishedAt = block.timestamp + 30 days;
        endOfPurchaseAt = block.timestamp + 28 days;
        maxPolicies = 5e7;
    }

    function run() public {        
        vm.startBroadcast(deployer);
        
        // insurancePool = IInsuranceFactory(insuranceFactory).createInsurancePool(
        //     name,
        //     symbol,
        //     descriptionUri,
        //     exampleResponseUri,
        //     curl,
        //     encryptedCurlSecretKey,
        //     encryptedApplicationID,
        //     encryptedApplicationSecret,
        //     regexExtraction,
        //     regexValidation,
        //     claimFee,
        //     benefit,
        //     startedAt,
        //     finishedAt,
        //     endOfPurchaseAt,
        //     maxPolicies,
        //     usde,
        //     stakedUSDe,
        //     serviceManager
        // );

        // IERC20(usde).approve(insurancePool, 15e7);

        // IInsurancePool(insurancePool).initialDeposit();

        // console.log("Deployed insurance pool at:", insurancePool);

        vm.stopBroadcast();
    }
}
