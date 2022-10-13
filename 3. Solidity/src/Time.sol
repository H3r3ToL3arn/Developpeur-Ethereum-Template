// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Time {

    function getTime() public view returns(uint) {
        return block.timestamp;
    }




}