// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GasTest {
    function calldataBytes(bytes calldata data) external {
        // do nothing
    }

    function calldataAddresses(address[] calldata addresses) external {
        // do nothing
    }

    function calldataAddressesAndSendingWei(address[] calldata addresses) external payable {
        for (uint i = 0; i < addresses.length; i++) {
            payable(addresses[i]).transfer(1);
        }
    }
}
