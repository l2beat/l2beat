// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.20;

import {INoncesKeyed} from 'src/interfaces/INoncesKeyed.sol';

/// @title NoncesKeyed
/// @author Aave Labs
/// @notice Provides tracking nonces for addresses. Supports keyed nonces, where nonces will only increment for each key.
/// @dev Follows the https://eips.ethereum.org/EIPS/eip-4337#semi-abstracted-nonce-support[ERC-4337's semi-abstracted nonce system].
/// @dev Inspired by the OpenZeppelin NoncesKeyed contract.
contract NoncesKeyed is INoncesKeyed {
  /// @custom:storage-location erc7201:aave-v4.storage.NoncesKeyed
  struct NoncesKeyedStorage {
    mapping(address owner => mapping(uint192 key => uint64 nonce)) _nonces;
  }

  /// @dev The storage slot for the NoncesKeyed storage struct.
  bytes32 private constant NAMESPACE_SLOT =
    // keccak256(abi.encode(uint256(keccak256("aave-v4.storage.NoncesKeyed")) - 1)) & ~bytes32(uint256(0xff))
    0x474d4a5585c1bae3dbeb574bb96408c7174aadd8ab635de4ab498e2723195f00;

  /// @inheritdoc INoncesKeyed
  function useNonce(uint192 key) external returns (uint256) {
    return _useNonce(msg.sender, key);
  }

  /// @inheritdoc INoncesKeyed
  function nonces(address owner, uint192 key) public view returns (uint256) {
    return _pack(key, _getNoncesKeyedStorage()._nonces[owner][key]);
  }

  /// @notice Consumes the next unused nonce for an address and key.
  /// @dev Returns the current packed `keyNonce`. Consumed nonce is increased, so calling this function twice
  /// with the same arguments will return different (sequential) results.
  function _useNonce(address owner, uint192 key) internal returns (uint256) {
    // For each account, the nonce has an initial value of 0, can only be incremented by one, and cannot be
    // decremented or reset. This guarantees that the nonce never overflows.
    unchecked {
      // It is important to do x++ and not ++x here.
      return _pack(key, _getNoncesKeyedStorage()._nonces[owner][key]++);
    }
  }

  /// @dev Same as `_useNonce` but checking that `nonce` is the next valid for `owner` for specified packed `keyNonce`.
  function _useCheckedNonce(address owner, uint256 keyNonce) internal {
    (uint192 key, ) = _unpack(keyNonce);
    uint256 current = _useNonce(owner, key);
    require(keyNonce == current, InvalidAccountNonce(owner, current));
  }

  /// @dev Pack key and nonce into a keyNonce.
  function _pack(uint192 key, uint64 nonce) private pure returns (uint256) {
    return (uint256(key) << 64) | nonce;
  }

  /// @dev Unpack a keyNonce into its key and nonce components.
  function _unpack(uint256 keyNonce) private pure returns (uint192 key, uint64 nonce) {
    return (uint192(keyNonce >> 64), uint64(keyNonce));
  }

  /// @dev Loads the NoncesKeyed storage struct.
  function _getNoncesKeyedStorage() private pure returns (NoncesKeyedStorage storage $) {
    assembly ('memory-safe') {
      $.slot := NAMESPACE_SLOT
    }
  }
}
