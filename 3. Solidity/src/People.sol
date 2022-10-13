// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract People {
    struct Person {
        string name;
        uint age;
    }

    Person[] public personArray;

    function addPerson (string calldata _name, uint _age) public {
        personArray.push(Person(_name, _age));
    }

    function removeLastPerson() public {
        personArray.pop();
    }

    // function modifyPerson(string calldata _name, uint _age) public {
    //     moi.age = _age;
    //     moi.name = _name;
    // }

    // Person public moi;

}