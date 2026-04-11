// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.20;

import {IMulticall} from 'src/interfaces/IMulticall.sol';

/// @title Multicall
/// @author Aave Labs
/// @notice This contract allows for batching multiple calls into a single call.
/// @dev Inspired by the OpenZeppelin Multicall contract.
abstract contract Multicall is IMulticall {
  /// @inheritdoc IMulticall
  function multicall(bytes[] calldata data) public virtual returns (bytes[] memory) {
    bytes[] memory results = new bytes[](data.length);
    for (uint256 i; i < data.length; ++i) {
      (bool ok, bytes memory res) = address(this).delegatecall(data[i]);

      assembly ('memory-safe') {
        if iszero(ok) {
          revert(add(res, 32), mload(res)) // bubble up first revert
        }
      }

      results[i] = res;
    }
    return results;
  }
}
