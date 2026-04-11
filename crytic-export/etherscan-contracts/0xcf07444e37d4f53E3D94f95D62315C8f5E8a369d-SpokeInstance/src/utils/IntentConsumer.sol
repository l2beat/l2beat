// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity 0.8.28;

import {EIP712} from 'src/dependencies/solady/EIP712.sol';
import {SignatureChecker} from 'src/dependencies/openzeppelin/SignatureChecker.sol';
import {NoncesKeyed} from 'src/utils/NoncesKeyed.sol';
import {IIntentConsumer} from 'src/interfaces/IIntentConsumer.sol';

/// @title IntentConsumer
/// @author Aave Labs
/// @notice Base contract to consume EIP712-signed intents with keyed-nonces.
/// @dev The `_domainNameAndVersion()` function must be implemented to specify the EIP712 domain name and version.
/// @dev Implements ERC-5267 with `address(this)` as verifyingContract and no custom extensions or optional EIP-712 salt.
abstract contract IntentConsumer is IIntentConsumer, NoncesKeyed, EIP712 {
  /// @inheritdoc IIntentConsumer
  function DOMAIN_SEPARATOR() external view virtual returns (bytes32) {
    return _domainSeparator();
  }

  /// @dev Verifies the signature of an EIP712-typed intent and consumes its associated keyed-nonce.
  /// @param signer The address of the user.
  /// @param intentHash The hash of the intent struct.
  /// @param nonce The keyed-nonce for the intent.
  /// @param deadline The deadline timestamp for the intent.
  /// @param signature The signature bytes.
  function _verifyAndConsumeIntent(
    address signer,
    bytes32 intentHash,
    uint256 nonce,
    uint256 deadline,
    bytes calldata signature
  ) internal {
    require(block.timestamp <= deadline, InvalidSignature());
    bytes32 digest = _hashTypedData(intentHash);
    require(
      SignatureChecker.isValidSignatureNowCalldata(signer, digest, signature),
      InvalidSignature()
    );
    _useCheckedNonce(signer, nonce);
  }
}
