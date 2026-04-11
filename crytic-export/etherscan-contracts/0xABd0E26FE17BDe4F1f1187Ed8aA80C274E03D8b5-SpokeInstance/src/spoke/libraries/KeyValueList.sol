// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.20;

import {Arrays} from 'src/dependencies/openzeppelin/Arrays.sol';

/// @title KeyValueList Library
/// @author Aave Labs
/// @notice Library to pack key-value pairs in a list.
/// @dev The `sortByKey` helper sorts by ascending order of the `key` & in case of collision by descending order of the `value`.
/// @dev This is achieved by sorting the packed `key-value` pair in descending order, but storing the invert of the `key` (ie `MAX_KEY - key`).
/// @dev Uninitialized keys are returned as (key: 0, value: 0) and are placed at the end of the list after sorting.
library KeyValueList {
  using Arrays for uint256[];
  using KeyValueList for *;

  /// @notice Thrown when adding a key which can't be stored in `KEY_BITS` or value in `VALUE_BITS`.
  error MaxDataSizeExceeded();

  /// @notice Container for packed key value dynamic list.
  struct List {
    uint256[] _inner;
  }

  uint256 internal constant KEY_BITS = 32;
  uint256 internal constant VALUE_BITS = 224;
  uint256 internal constant MAX_KEY = (1 << KEY_BITS) - 1;
  uint256 internal constant MAX_VALUE = (1 << VALUE_BITS) - 1;
  uint256 internal constant KEY_SHIFT = 256 - KEY_BITS;

  /// @notice Allocates memory for a KeyValue list of `size` elements.
  function init(uint256 size) internal pure returns (List memory) {
    return List(new uint256[](size));
  }

  /// @notice Returns the length of the list.
  function length(List memory self) internal pure returns (uint256) {
    return self._inner.length;
  }

  /// @notice Inserts packed `key`, `value` at `idx`. Reverts if data exceeds maximum allowed size.
  /// @dev Reverts if `key` equals or exceeds the `MAX_KEY` value and reverts if `value` equals or exceeds the `MAX_VALUE` value.
  function add(List memory self, uint256 idx, uint256 key, uint256 value) internal pure {
    require(key < MAX_KEY && value < MAX_VALUE, MaxDataSizeExceeded());
    self._inner[idx] = pack(key, value);
  }

  /// @notice Returns the key-value pair at the given index.
  /// @dev Uninitialized keys are returned as (key: 0, value: 0).
  function get(List memory self, uint256 idx) internal pure returns (uint256, uint256) {
    return self._inner[idx].unpack();
  }

  /// @notice Returns the key-value pair at the given index without bounds checking.
  /// @dev Uninitialized keys are returned as (key: 0, value: 0).
  function uncheckedAt(List memory self, uint256 idx) internal pure returns (uint256, uint256) {
    return self._inner.unsafeMemoryAccess(idx).unpack();
  }

  /// @notice Sorts the list in-place by ascending order of `key`, and descending order of `value` on collision.
  /// @dev All uninitialized keys are placed at the end of the list after sorting.
  /// @dev Since `key` is in the MSB, we can sort by the key by sorting the array in descending order
  /// (so the keys are in ascending order when unpacking, due to the inversion when packed).
  function sortByKey(List memory self) internal pure {
    self._inner.sort(gtComparator);
  }

  /// @notice Packs a given `key`, `value` pair into a single word.
  /// @dev Bound checks are expected to be done before packing.
  function pack(uint256 key, uint256 value) internal pure returns (uint256) {
    return ((MAX_KEY - key) << KEY_SHIFT) | value;
  }

  /// @notice Unpacks `key` from a previously packed word containing `key` and `value`.
  /// @dev The key is stored in the most significant bits of the word.
  function unpackKey(uint256 data) internal pure returns (uint256) {
    unchecked {
      return MAX_KEY - (data >> KEY_SHIFT);
    }
  }

  /// @notice Unpacks `value` from a previously packed word containing `key` and `value`.
  /// @dev The value is stored in the least significant bits of the word.
  function unpackValue(uint256 data) internal pure returns (uint256) {
    return data & ((1 << KEY_SHIFT) - 1);
  }

  /// @notice Unpacks both `key` and `value` from a previously packed word containing `key` and `value`.
  /// @dev Uninitialized keys are returned as (key: 0, value: 0).
  /// @param data The packed word containing `key` and `value`.
  function unpack(uint256 data) internal pure returns (uint256, uint256) {
    if (data == 0) return (0, 0);
    return (data.unpackKey(), data.unpackValue());
  }

  /// @notice Comparator function performing greater-than comparison.
  /// @return True if `a` is greater than `b`.
  function gtComparator(uint256 a, uint256 b) internal pure returns (bool) {
    return a > b;
  }
}
