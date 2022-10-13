// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Bank {
    mapping(address => uint) private _balances;

    function deposit(uint _amount) public {
        _balances[msg.sender] += _amount;
    }

    function transfer(address _recipient, uint _amount) public {
        require(_recipient != address(0), "You cannot transfer to the address 0");
        require(_balances[msg.sender] >= _amount, "You have not enough balance");
        _balances[msg.sender] -= _amount;
        _balances[_recipient] += _amount;
    }

    function balanceOf(address _address) public view returns(uint) {
        return _balances[_address];
    }



}