// SPDX-License-Identifier: LicenseRef-BUSL
pragma solidity ^0.8.0;

import {INoncesKeyed} from 'src/interfaces/INoncesKeyed.sol';

/// @title IIntentConsumer
/// @author Aave Labs
/// @notice Minimal interface for IntentConsumer.
interface IIntentConsumer is INoncesKeyed {
  /// @notice Thrown when given signature is invalid.
  error InvalidSignature();

  /// @notice Returns the EIP-712 domain separator.
  function DOMAIN_SEPARATOR() external view returns (bytes32);
}
