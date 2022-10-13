// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

contract School {

    struct Student {
        string name;
        uint noteBio;
        uint noteMath;
        uint noteFr;
        bool isRegistered;
    }

    mapping(string => Student) private studentsList;

    address teacherBio = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    address teacherMath = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    address teacherFr = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;

    modifier onlyTeacher {
        require(msg.sender == teacherBio || msg.sender == teacherMath || msg.sender == teacherFr, "You are not a teacher");
        _;
    }

    function addNote (uint _note, string calldata _student, string calldata _subject ) public onlyTeacher{
        if (!studentsList[_student].isRegistered) {
            studentsList[_student].isRegistered = true;
            studentsList[_student].name = _student;
        }
            // studentsList[_student][_subject] = _note;
    }

    function getNote (uint _note, string calldata _student, uint _subject ) public onlyTeacher{
        
    }

    function setNote (uint _note, string calldata _student, uint _subject ) public onlyTeacher{
        
    }



}