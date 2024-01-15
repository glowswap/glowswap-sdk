// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./IGlowV3Pool.sol";
import "./ILMPool.sol";

interface ILMPoolDeployer {
    function deploy(IGlowV3Pool pool) external returns (ILMPool lmPool);
}
