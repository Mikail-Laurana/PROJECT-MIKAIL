// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract k4Coin {
    uint256 public version; 
    address private _guardImplementation; 
    address public governance;
    mapping(address => uint256) public balances;

    function initialize(address _governance) external {
        require(governance == address(0), "Already initialized");
        governance = _governance;
        version = 1;
    }

    function setProtocolVersion(uint256 _newVersion) external {
        version = _newVersion;
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }
}

contract k4Proxy {
    address public admin;
    address public implementation;

    constructor(address _impl) {
        implementation = _impl;
        admin = msg.sender;
    }

    function upgradeTo(address _newImpl) external {
        require(msg.sender == admin, "Admin only");
        implementation = _newImpl;
    }

    fallback() external payable {
        address _impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), _impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
    
    receive() external payable {}
}