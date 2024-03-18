// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract HotelBooking {
    address public owner;
    mapping(uint => mapping(address=> bool)) public bookedRooms;
    mapping(uint => bool) public availableRooms;
    uint public constant numRooms = 10;
    uint public constant roomPrice = 0.0005 ether;

    event RoomBooked(uint roomNumber, address guest);

    error invalidRoom();
    error insufficientFunds();

    constructor() {
        owner = msg.sender;
    }

    function bookRoom(uint roomNumber,address customer) public payable {
        if(roomNumber < 1 || roomNumber >= numRooms) {
            revert invalidRoom();
        }
        if(msg.value < roomPrice) {
            revert insufficientFunds();
        }

        require(!bookedRooms[roomNumber][customer], "Room already booked");

        bookedRooms[roomNumber][customer] = true;
        availableRooms[roomNumber] = true;
        emit RoomBooked(roomNumber, customer);
    }

    function cancelBooking(uint roomNumber,address customer) public {
        require(bookedRooms[roomNumber][customer], "Room not booked");

        require(msg.sender == owner || msg.sender == address(this), "Only owner or contract can cancel bookings");

        bookedRooms[roomNumber][customer] = false;
        availableRooms[roomNumber] = false;
        payable(customer).transfer(roomPrice);
    }


    function withdrawFunds() public {
        assert(msg.sender == owner);

        payable(owner).transfer(address(this).balance);
    }

    function getAvailableRooms() public view returns (uint[10] memory) {
        uint[10] memory currentAvailableRooms;
        for(uint i = 0; i < 10 ; i++){
            if(availableRooms[i+1] == false){
                currentAvailableRooms[i] = i+1;
            }
        }
        return currentAvailableRooms;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    // Fallback function to receive ether
    receive() external payable {}
}
