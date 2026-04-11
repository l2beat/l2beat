// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.0;

import {IExtSload} from 'src/interfaces/IExtSload.sol';

/// @title ExtSload
/// @author Aave Labs
/// @notice This allows the source contract to make its state available to external contracts.
abstract contract ExtSload is IExtSload {
  /// @inheritdoc IExtSload
  function extSload(bytes32 slot) external view returns (bytes32 ret) {
    assembly ('memory-safe') {
      ret := sload(slot)
    }
  }

  /// @inheritdoc IExtSload
  function extSloads(bytes32[] calldata slots) external view returns (bytes32[] memory) {
    // @dev we disregard solidity memory conventions since we take control of entire execution
    assembly {
      mstore(0x00, 0x20) // to abi-encode response, the array will be found at the next word
      mstore(0x20, slots.length) // set the length of dynamic array
      let start := 0x40 // start of the array
      let end := add(start, shl(5, slots.length))
      for {
        let input := slots.offset
      } lt(start, end) {
        start := add(start, 0x20)
      } {
        mstore(start, sload(calldataload(input)))
        input := add(input, 0x20)
      }
      return(0x00, end) // return abi-encoded dynamic array
    }
  }
}
