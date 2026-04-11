// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.20;

import {ReserveFlags} from 'src/spoke/interfaces/ISpoke.sol';

/// @title ReserveFlags Library
/// @author Aave Labs
/// @notice Implements the bitmap logic to handle the Reserve flags configuration.
library ReserveFlagsMap {
  /// @dev Mask for the `paused` flag.
  uint8 internal constant PAUSED_MASK = 0x01;
  /// @dev Mask for the `frozen` flag.
  uint8 internal constant FROZEN_MASK = 0x02;
  /// @dev Mask for the `borrowable` flag.
  uint8 internal constant BORROWABLE_MASK = 0x04;
  /// @dev Mask for the `receiveSharesEnabled` flag.
  uint8 internal constant RECEIVE_SHARES_ENABLED_MASK = 0x08;

  /// @notice Initializes the ReserveFlags with the given values.
  /// @param initPaused The initial `paused` flag status.
  /// @param initFrozen The initial `frozen` flag status.
  /// @param initBorrowable The initial `borrowable` flag status.
  /// @param initReceiveSharesEnabled The initial `receiveSharesEnabled` flag status.
  /// @return The initialized ReserveFlags.
  function create(
    bool initPaused,
    bool initFrozen,
    bool initBorrowable,
    bool initReceiveSharesEnabled
  ) internal pure returns (ReserveFlags) {
    uint8 flags = 0;
    flags = _setStatus(flags, PAUSED_MASK, initPaused);
    flags = _setStatus(flags, FROZEN_MASK, initFrozen);
    flags = _setStatus(flags, BORROWABLE_MASK, initBorrowable);
    flags = _setStatus(flags, RECEIVE_SHARES_ENABLED_MASK, initReceiveSharesEnabled);
    return ReserveFlags.wrap(flags);
  }

  /// @notice Sets the new status for the `paused` flag.
  /// @param flags The current ReserveFlags.
  /// @param status The new status for the `paused` flag.
  /// @return The updated ReserveFlags.
  function setPaused(ReserveFlags flags, bool status) internal pure returns (ReserveFlags) {
    return ReserveFlags.wrap(_setStatus(ReserveFlags.unwrap(flags), PAUSED_MASK, status));
  }

  /// @notice Sets the new status for the `frozen` flag.
  /// @param flags The current ReserveFlags.
  /// @param status The new status for the `frozen` flag.
  /// @return The updated ReserveFlags.
  function setFrozen(ReserveFlags flags, bool status) internal pure returns (ReserveFlags) {
    return ReserveFlags.wrap(_setStatus(ReserveFlags.unwrap(flags), FROZEN_MASK, status));
  }

  /// @notice Sets the new status for the `borrowable` flag.
  /// @param flags The current ReserveFlags.
  /// @param status The new status for the `borrowable` flag.
  /// @return The updated ReserveFlags.
  function setBorrowable(ReserveFlags flags, bool status) internal pure returns (ReserveFlags) {
    return ReserveFlags.wrap(_setStatus(ReserveFlags.unwrap(flags), BORROWABLE_MASK, status));
  }

  /// @notice Sets the new status for the `receiveSharesEnabled` flag.
  /// @param flags The current ReserveFlags.
  /// @param status The new status for the `receiveSharesEnabled` flag.
  /// @return The updated ReserveFlags.
  function setReceiveSharesEnabled(
    ReserveFlags flags,
    bool status
  ) internal pure returns (ReserveFlags) {
    return
      ReserveFlags.wrap(
        _setStatus(ReserveFlags.unwrap(flags), RECEIVE_SHARES_ENABLED_MASK, status)
      );
  }

  /// @notice Returns the `paused` flag status.
  /// @param flags The current ReserveFlags.
  /// @return True if the flag is set.
  function paused(ReserveFlags flags) internal pure returns (bool) {
    return (ReserveFlags.unwrap(flags) & PAUSED_MASK) != 0;
  }

  /// @notice Returns the `frozen` flag status.
  /// @param flags The current ReserveFlags.
  /// @return True if the flag is set.
  function frozen(ReserveFlags flags) internal pure returns (bool) {
    return (ReserveFlags.unwrap(flags) & FROZEN_MASK) != 0;
  }

  /// @notice Returns the `borrowable` flag status.
  /// @param flags The current ReserveFlags.
  /// @return True if the flag is set.
  function borrowable(ReserveFlags flags) internal pure returns (bool) {
    return (ReserveFlags.unwrap(flags) & BORROWABLE_MASK) != 0;
  }

  /// @notice Returns the `receiveSharesEnabled` flag status.
  /// @param flags The current ReserveFlags.
  /// @return True if the flag is set.
  function receiveSharesEnabled(ReserveFlags flags) internal pure returns (bool) {
    return (ReserveFlags.unwrap(flags) & RECEIVE_SHARES_ENABLED_MASK) != 0;
  }

  /// @notice Sets the new status for the given flag.
  function _setStatus(uint8 flags, uint8 mask, bool status) private pure returns (uint8) {
    return status ? flags | mask : flags & ~mask;
  }
}
