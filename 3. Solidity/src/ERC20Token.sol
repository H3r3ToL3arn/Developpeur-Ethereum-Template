// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {
    constructor(uint256 initialSupply) ERC20("AlYRA", "ALY") {
        _mint(msg.sender, initialSupply);
    }

}