// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// trimmed https://github.com/Vectorized/solady/blob/ba711c9fa6a2dc7b2b7707f7fe136b5133379c03/src/utils/LibBit.sol

/// @notice Library for bit twiddling and boolean operations.
/// @author Solady (https://github.com/vectorized/solady/blob/main/src/utils/LibBit.sol)
/// @author Inspired by (https://graphics.stanford.edu/~seander/bithacks.html)
library LibBit {
  /// @dev Returns the number of set bits in `x`.
  function popCount(uint256 x) internal pure returns (uint256 c) {
    /// @solidity memory-safe-assembly
    assembly {
      let max := not(0)
      let isMax := eq(x, max)
      x := sub(x, and(shr(1, x), div(max, 3)))
      x := add(and(x, div(max, 5)), and(shr(2, x), div(max, 5)))
      x := and(add(x, shr(4, x)), div(max, 17))
      c := or(shl(8, isMax), shr(248, mul(x, div(max, 255))))
    }
  }

  /// @dev Find last set.
  /// Returns the index of the most significant bit of `x`,
  /// counting from the least significant bit position.
  /// If `x` is zero, returns 256.
  function fls(uint256 x) internal pure returns (uint256 r) {
    /// @solidity memory-safe-assembly
    assembly {
      r := or(shl(8, iszero(x)), shl(7, lt(0xffffffffffffffffffffffffffffffff, x)))
      r := or(r, shl(6, lt(0xffffffffffffffff, shr(r, x))))
      r := or(r, shl(5, lt(0xffffffff, shr(r, x))))
      r := or(r, shl(4, lt(0xffff, shr(r, x))))
      r := or(r, shl(3, lt(0xff, shr(r, x))))
      // forgefmt: disable-next-item
      r := or(
        r,
        byte(
          and(0x1f, shr(shr(r, x), 0x8421084210842108cc6318c6db6d54be)),
          0x0706060506020504060203020504030106050205030304010505030400000000
        )
      )
    }
  }
}
