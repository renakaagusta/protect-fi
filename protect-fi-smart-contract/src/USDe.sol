// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract USDe is ERC20 {
    address public owner;

    constructor() ERC20("USDe", "USDe") {
        owner = msg.sender;
        _mint(msg.sender, 1_000_000 * 10**decimals());
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner, "Only owner can invoke this function");
        _mint(to, amount);
    }
}