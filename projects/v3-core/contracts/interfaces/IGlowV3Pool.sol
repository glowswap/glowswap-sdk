// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.5.0;

import './pool/IGlowV3PoolImmutables.sol';
import './pool/IGlowV3PoolState.sol';
import './pool/IGlowV3PoolDerivedState.sol';
import './pool/IGlowV3PoolActions.sol';
import './pool/IGlowV3PoolOwnerActions.sol';
import './pool/IGlowV3PoolEvents.sol';

/// @title The interface for a GlowSwap V3 Pool
/// @notice A GlowSwap pool facilitates swapping and automated market making between any two assets that strictly conform
/// to the ERC20 specification
/// @dev The pool interface is broken up into many smaller pieces
interface IGlowV3Pool is
    IGlowV3PoolImmutables,
    IGlowV3PoolState,
    IGlowV3PoolDerivedState,
    IGlowV3PoolActions,
    IGlowV3PoolOwnerActions,
    IGlowV3PoolEvents
{

}
