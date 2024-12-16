// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "lib/openzeppelin-contracts/contracts/utils/math/Math.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol";

contract StakedUSDe is ERC4626 {
    using Math for uint256;
    
    uint256 private _totalAssets;
    
    constructor(
        IERC20 asset_
    ) ERC4626(asset_) ERC20("Staked USDe", "sUSDe") {
        _totalAssets = 0;
    }

    function totalAssets() public view virtual override returns (uint256) {
        return _totalAssets;
    }

    function _deposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) internal virtual override {
        super._deposit(caller, receiver, assets, shares);
        _totalAssets += assets;       
    }

    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal virtual override {
        super._withdraw(caller, receiver, owner, assets, shares);
        _totalAssets -= assets;        
    }

    function rebase() external {
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        require(currentBalance > _totalAssets, "No yield to add");
        
        uint256 yieldAmount = currentBalance - _totalAssets;
        _totalAssets = currentBalance;
        
        emit Rebased(yieldAmount);
    }

    function getCurrentSharePrice() public view returns (uint256) {
        return _convertToAssets(1e18, Math.Rounding.Floor);
    }
    
    event Rebased(uint256 yieldAmount);
}
