// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.20;

/// @title WadRayMath library
/// @author Aave Labs
/// @notice Provides utility functions to work with WAD and RAY units with explicit rounding.
library WadRayMath {
  uint256 internal constant WAD_DECIMALS = 18;
  uint256 internal constant WAD = 1e18;
  uint256 internal constant RAY = 1e27;
  uint256 internal constant PERCENTAGE_FACTOR = 1e4;

  /// @notice Multiplies two WAD numbers, rounding down.
  /// @dev Reverts if intermediate multiplication overflows.
  /// @return c = floor(a * b / WAD), expressed in WAD.
  function wadMulDown(uint256 a, uint256 b) internal pure returns (uint256 c) {
    assembly ('memory-safe') {
      // to avoid overflow, a <= type(uint256).max / b
      if iszero(or(iszero(b), iszero(gt(a, div(not(0), b))))) {
        revert(0, 0)
      }

      c := div(mul(a, b), WAD)
    }
  }

  /// @notice Multiplies two WAD numbers, rounding up.
  /// @dev Reverts if intermediate multiplication overflows.
  /// @return c = ceil(a * b / WAD), expressed in WAD.
  function wadMulUp(uint256 a, uint256 b) internal pure returns (uint256 c) {
    assembly ('memory-safe') {
      // to avoid overflow, a <= type(uint256).max / b
      if iszero(or(iszero(b), iszero(gt(a, div(not(0), b))))) {
        revert(0, 0)
      }
      c := mul(a, b)
      // Add 1 if (a * b) % WAD > 0 to round up the division of (a * b) by WAD
      c := add(div(c, WAD), gt(mod(c, WAD), 0))
    }
  }

  /// @notice Divides two WAD numbers, rounding down.
  /// @dev Reverts if division by zero or intermediate multiplication overflows.
  /// @return c = floor(a * WAD / b), expressed in WAD.
  function wadDivDown(uint256 a, uint256 b) internal pure returns (uint256 c) {
    assembly ('memory-safe') {
      // to avoid overflow, a <= type(uint256).max / WAD
      if or(iszero(b), iszero(iszero(gt(a, div(not(0), WAD))))) {
        revert(0, 0)
      }

      c := div(mul(a, WAD), b)
    }
  }

  /// @notice Divides two WAD numbers, rounding up.
  /// @dev Reverts if division by zero or intermediate multiplication overflows.
  /// @return c = ceil(a * WAD / b), expressed in WAD.
  function wadDivUp(uint256 a, uint256 b) internal pure returns (uint256 c) {
    assembly ('memory-safe') {
      // to avoid overflow, a <= type(uint256).max / WAD
      if or(iszero(b), iszero(iszero(gt(a, div(not(0), WAD))))) {
        revert(0, 0)
      }
      c := mul(a, WAD)
      // Add 1 if (a * WAD) % b > 0 to round up the division of (a * WAD) by b
      c := add(div(c, b), gt(mod(c, b), 0))
    }
  }

  /// @notice Multiplies two RAY numbers, rounding down.
  /// @dev Reverts if intermediate multiplication overflows.
  /// @return c = floor(a * b / RAY), expressed in RAY.
  function rayMulDown(uint256 a, uint256 b) internal pure returns (uint256 c) {
    assembly ('memory-safe') {
      // to avoid overflow, a <= type(uint256).max / b
      if iszero(or(iszero(b), iszero(gt(a, div(not(0), b))))) {
        revert(0, 0)
      }

      c := div(mul(a, b), RAY)
    }
  }

  /// @notice Multiplies two RAY numbers, rounding up.
  /// @dev Reverts if intermediate multiplication overflows.
  /// @return c = ceil(a * b / RAY), expressed in RAY.
  function rayMulUp(uint256 a, uint256 b) internal pure returns (uint256 c) {
    assembly ('memory-safe') {
      // to avoid overflow, a <= type(uint256).max / b
      if iszero(or(iszero(b), iszero(gt(a, div(not(0), b))))) {
        revert(0, 0)
      }
      c := mul(a, b)
      // Add 1 if (a * b) % RAY > 0 to round up the division of (a * b) by RAY
      c := add(div(c, RAY), gt(mod(c, RAY), 0))
    }
  }

  /// @notice Divides two RAY numbers, rounding down.
  /// @dev Reverts if division by zero or intermediate multiplication overflows.
  /// @return c = floor(a * RAY / b), expressed in RAY.
  function rayDivDown(uint256 a, uint256 b) internal pure returns (uint256 c) {
    assembly ('memory-safe') {
      // to avoid overflow, a <= type(uint256).max / RAY
      if or(iszero(b), iszero(iszero(gt(a, div(not(0), RAY))))) {
        revert(0, 0)
      }

      c := div(mul(a, RAY), b)
    }
  }

  /// @notice Divides two RAY numbers, rounding up.
  /// @dev Reverts if division by zero or intermediate multiplication overflows.
  /// @return c = ceil(a * RAY / b), expressed in RAY.
  function rayDivUp(uint256 a, uint256 b) internal pure returns (uint256 c) {
    assembly ('memory-safe') {
      // to avoid overflow, a <= type(uint256).max / RAY
      if or(iszero(b), iszero(iszero(gt(a, div(not(0), RAY))))) {
        revert(0, 0)
      }
      c := mul(a, RAY)
      // Add 1 if (a * RAY) % b > 0 to round up the division of (a * RAY) by b
      c := add(div(c, b), gt(mod(c, b), 0))
    }
  }

  /// @notice Casts value to WAD, adding 18 digits of precision.
  /// @dev Reverts if intermediate multiplication overflows.
  /// @return b = a * WAD, expressed in WAD.
  function toWad(uint256 a) internal pure returns (uint256 b) {
    assembly ('memory-safe') {
      b := mul(a, WAD)

      // to avoid overflow, b/WAD == a
      if iszero(eq(div(b, WAD), a)) {
        revert(0, 0)
      }
    }
  }

  /// @notice Casts value to RAY, adding 27 digits of precision.
  /// @dev Reverts if intermediate multiplication overflows.
  /// @return b = a * RAY, expressed in RAY.
  function toRay(uint256 a) internal pure returns (uint256 b) {
    assembly ('memory-safe') {
      b := mul(a, RAY)

      // to avoid overflow, b/RAY == a
      if iszero(eq(div(b, RAY), a)) {
        revert(0, 0)
      }
    }
  }

  /// @notice Removes WAD precision from a given value, rounding down.
  /// @return b = a / WAD.
  function fromWadDown(uint256 a) internal pure returns (uint256 b) {
    assembly ('memory-safe') {
      b := div(a, WAD)
    }
  }

  /// @notice Removes RAY precision from a given value, rounding up.
  /// @return b = ceil(a / RAY).
  function fromRayUp(uint256 a) internal pure returns (uint256 b) {
    assembly ('memory-safe') {
      // add 1 if (a % RAY) > 0 to round up the division of a by RAY
      b := add(div(a, RAY), gt(mod(a, RAY), 0))
    }
  }

  /// @notice Converts value from basis points to WAD.
  /// @dev Reverts if result overflows.
  /// @return b = a * (WAD / PERCENTAGE_FACTOR), expressed in WAD.
  function bpsToWad(uint256 a) internal pure returns (uint256 b) {
    assembly ('memory-safe') {
      let factor := div(WAD, PERCENTAGE_FACTOR)
      b := mul(a, factor)
      // to avoid overflow, b/factor == a
      if iszero(eq(div(b, factor), a)) {
        revert(0, 0)
      }
    }
  }

  /// @notice Converts value from basis points to RAY.
  /// @dev Reverts if result overflows.
  /// @return b = a * (RAY / PERCENTAGE_FACTOR), expressed in RAY.
  function bpsToRay(uint256 a) internal pure returns (uint256 b) {
    assembly ('memory-safe') {
      let factor := div(RAY, PERCENTAGE_FACTOR)
      b := mul(a, factor)
      // to avoid overflow, b/factor == a
      if iszero(eq(div(b, factor), a)) {
        revert(0, 0)
      }
    }
  }

  /// @notice Rounds up a RAY value to the nearest RAY.
  /// @dev Reverts if result overflows.
  /// @return b = ceil(a / RAY) * RAY.
  function roundRayUp(uint256 a) internal pure returns (uint256 b) {
    assembly ('memory-safe') {
      // add 1 if (a % RAY) > 0 to round up the division of a by RAY
      let c := add(div(a, RAY), gt(mod(a, RAY), 0))
      b := mul(c, RAY)
      // to avoid overflow, b/RAY == c
      if iszero(eq(div(b, RAY), c)) {
        revert(0, 0)
      }
    }
  }
}
