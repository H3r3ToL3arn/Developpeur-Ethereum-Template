// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Whitelist {

    mapping(address => bool) public  whitelist;

    event Whitelisted(address _address);

    modifier check() {
        require(whitelist[msg.sender], "Not whitelisted");
    _;
    }


    // Fonction authorize
    function addWhitelist(address _address) public check {
        whitelist[_address] = true;
        emit Whitelisted(_address);
    }

    function removeWhitelist(address _address) public {
         whitelist[_address] = false;
    }

    // Exercice 4/5, fonction "check"
    function isWhitelisted(address _address) private view returns (bool) {
        return whitelist[_address];
    }


    function isNotWhitelisted(address _address) public view returns (bool) {
        return !whitelist[_address];
    }
}


