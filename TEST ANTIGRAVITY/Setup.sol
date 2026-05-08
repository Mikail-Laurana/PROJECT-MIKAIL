// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./k4.sol";

contract Setup {
    k4Proxy public immutable TARGET;
    k4Coin public immutable IMPL;

    constructor() payable {
        require(msg.value == 100 ether, "Need 100 ETH");
        
        IMPL = new k4Coin();
        TARGET = new k4Proxy(address(IMPL));
        
        (bool s,) = address(TARGET).call(abi.encodeWithSelector(k4Coin.initialize.selector, address(this)));
        require(s);

        payable(address(TARGET)).transfer(100 ether);
    }

    function isSolved() external view returns (bool) {
        return address(TARGET).balance == 0;
    }
}