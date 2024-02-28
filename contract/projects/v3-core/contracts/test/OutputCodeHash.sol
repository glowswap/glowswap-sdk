// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;
pragma abicoder v2;

import '../GlowV3Pool.sol';

contract OutputCodeHash {
    function getInitCodeHash() public pure returns (bytes32) {
        bytes memory bytecode = type(GlowV3Pool).creationCode;
        return keccak256(abi.encodePacked(bytecode));
    }
}