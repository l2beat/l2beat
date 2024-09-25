// SPDX-License-Identifier: Unknown
pragma solidity 0.8.24;

library CallWithExactGas {
  error NoContract();
  error NoGasForCallExactCheck();
  error NotEnoughGasForCall();

  bytes4 internal constant NO_CONTRACT_SIG = 0x0c3b563c;
  bytes4 internal constant NO_GAS_FOR_CALL_EXACT_CHECK_SIG = 0xafa32a2c;
  bytes4 internal constant NOT_ENOUGH_GAS_FOR_CALL_SIG = 0x37c3be29;

  /// @notice calls target address with exactly gasAmount gas and payload as calldata.
  /// Accounts for gasForCallExactCheck gas that will be used by this function. Will revert
  /// if the target is not a contact. Will revert when there is not enough gas to call the
  /// target with gasAmount gas.
  /// @dev Ignores the return data, which makes it immune to gas bomb attacks.
  /// @return success whether the call succeeded
  function _callWithExactGas(
    bytes memory payload,
    address target,
    uint256 gasLimit,
    uint16 gasForCallExactCheck
  ) internal returns (bool success) {
    assembly {
      // solidity calls check that a contract actually exists at the destination, so we do the same
      // Note we do this check prior to measuring gas so gasForCallExactCheck (our "cushion")
      // doesn't need to account for it.
      if iszero(extcodesize(target)) {
        mstore(0x0, NO_CONTRACT_SIG)
        revert(0x0, 0x4)
      }

      let g := gas()
      // Compute g -= gasForCallExactCheck and check for underflow
      // The gas actually passed to the callee is _min(gasAmount, 63//64*gas available).
      // We want to ensure that we revert if gasAmount >  63//64*gas available
      // as we do not want to provide them with less, however that check itself costs
      // gas. gasForCallExactCheck ensures we have at least enough gas to be able
      // to revert if gasAmount >  63//64*gas available.
      if lt(g, gasForCallExactCheck) {
        mstore(0x0, NO_GAS_FOR_CALL_EXACT_CHECK_SIG)
        revert(0x0, 0x4)
      }
      g := sub(g, gasForCallExactCheck)
      // if g - g//64 <= gasAmount, revert. We subtract g//64 because of EIP-150
      if iszero(gt(sub(g, div(g, 64)), gasLimit)) {
        mstore(0x0, NOT_ENOUGH_GAS_FOR_CALL_SIG)
        revert(0x0, 0x4)
      }

      // call and return whether we succeeded. ignore return data
      // call(gas,addr,value,argsOffset,argsLength,retOffset,retLength)
      success := call(gasLimit, target, 0, add(payload, 0x20), mload(payload), 0x0, 0x0)
    }
    return success;
  }

  /// @notice calls target address with exactly gasAmount gas and payload as calldata.
  /// Account for gasForCallExactCheck gas that will be used by this function. Will revert
  /// if the target is not a contact. Will revert when there is not enough gas to call the
  /// target with gasAmount gas.
  /// @dev Caps the return data length, which makes it immune to gas bomb attacks.
  /// @dev Return data cap logic borrowed from
  /// https://github.com/nomad-xyz/ExcessivelySafeCall/blob/main/src/ExcessivelySafeCall.sol.
  /// @return success whether the call succeeded
  /// @return retData the return data from the call, capped at maxReturnBytes bytes
  /// @return gasUsed the gas used by the external call. Does not include the overhead of this function.
  function _callWithExactGasSafeReturnData(
    bytes memory payload,
    address target,
    uint256 gasLimit,
    uint16 gasForCallExactCheck,
    uint16 maxReturnBytes
  ) internal returns (bool success, bytes memory retData, uint256 gasUsed) {
    // allocate retData memory ahead of time
    retData = new bytes(maxReturnBytes);

    assembly {
      // solidity calls check that a contract actually exists at the destination, so we do the same
      // Note we do this check prior to measuring gas so gasForCallExactCheck (our "cushion")
      // doesn't need to account for it.
      if iszero(extcodesize(target)) {
        mstore(0x0, NO_CONTRACT_SIG)
        revert(0x0, 0x4)
      }

      let g := gas()
      // Compute g -= gasForCallExactCheck and check for underflow
      // The gas actually passed to the callee is _min(gasAmount, 63//64*gas available).
      // We want to ensure that we revert if gasAmount >  63//64*gas available
      // as we do not want to provide them with less, however that check itself costs
      // gas. gasForCallExactCheck ensures we have at least enough gas to be able
      // to revert if gasAmount >  63//64*gas available.
      if lt(g, gasForCallExactCheck) {
        mstore(0x0, NO_GAS_FOR_CALL_EXACT_CHECK_SIG)
        revert(0x0, 0x4)
      }
      g := sub(g, gasForCallExactCheck)
      // if g - g//64 <= gasAmount, revert. We subtract g//64 because of EIP-150
      if iszero(gt(sub(g, div(g, 64)), gasLimit)) {
        mstore(0x0, NOT_ENOUGH_GAS_FOR_CALL_SIG)
        revert(0x0, 0x4)
      }

      // We save the gas before the call so we can calculate how much gas the call used
      let gasBeforeCall := gas()
      // call and return whether we succeeded. ignore return data
      // call(gas,addr,value,argsOffset,argsLength,retOffset,retLength)
      success := call(gasLimit, target, 0, add(payload, 0x20), mload(payload), 0x0, 0x0)
      gasUsed := sub(gasBeforeCall, gas())

      // limit our copy to maxReturnBytes bytes
      let toCopy := returndatasize()
      if gt(toCopy, maxReturnBytes) {
        toCopy := maxReturnBytes
      }
      // Store the length of the copied bytes
      mstore(retData, toCopy)
      // copy the bytes from retData[0:_toCopy]
      returndatacopy(add(retData, 0x20), 0x0, toCopy)
    }
    return (success, retData, gasUsed);
  }

  /// @notice Calls target address with exactly gasAmount gas and payload as calldata
  /// or reverts if at least gasLimit gas is not available.
  /// @dev Does not check if target is a contract. If it is not a contract, the low-level
  /// call will still be made and it will succeed.
  /// @dev Ignores the return data, which makes it immune to gas bomb attacks.
  /// @return success whether the call succeeded
  /// @return sufficientGas Whether there was enough gas to make the call
  function _callWithExactGasEvenIfTargetIsNoContract(
    bytes memory payload,
    address target,
    uint256 gasLimit,
    uint16 gasForCallExactCheck
  ) internal returns (bool success, bool sufficientGas) {
    assembly {
      let g := gas()
      // Compute g -= CALL_WITH_EXACT_GAS_CUSHION and check for underflow. We
      // need the cushion since the logic following the above call to gas also
      // costs gas which we cannot account for exactly. So cushion is a
      // conservative upper bound for the cost of this logic.
      if iszero(lt(g, gasForCallExactCheck)) {
        g := sub(g, gasForCallExactCheck)
        // If g - g//64 <= gasAmount, we don't have enough gas. We subtract g//64 because of EIP-150.
        if gt(sub(g, div(g, 64)), gasLimit) {
          // Call and ignore success/return data. Note that we did not check
          // whether a contract actually exists at the target address.
          success := call(gasLimit, target, 0, add(payload, 0x20), mload(payload), 0x0, 0x0)
          sufficientGas := true
        }
      }
    }
    return (success, sufficientGas);
  }
}

library Pool {
  // The tag used to signal support for the pool v1 standard
  // bytes4(keccak256("CCIP_POOL_V1"))
  bytes4 public constant CCIP_POOL_V1 = 0xaff2afbf;

  // The number of bytes in the return data for a pool v1 releaseOrMint call.
  // This should match the size of the ReleaseOrMintOutV1 struct.
  uint16 public constant CCIP_POOL_V1_RET_BYTES = 32;

  // The default max number of bytes in the return data for a pool v1 lockOrBurn call.
  // This data can be used to send information to the destination chain token pool. Can be overwritten
  // in the TokenTransferFeeConfig.destBytesOverhead if more data is required.
  uint32 public constant CCIP_LOCK_OR_BURN_V1_RET_BYTES = 32;

  struct LockOrBurnInV1 {
    bytes receiver; //  The recipient of the tokens on the destination chain, abi encoded
    uint64 remoteChainSelector; // ─╮ The chain ID of the destination chain
    address originalSender; // ─────╯ The original sender of the tx on the source chain
    uint256 amount; //  The amount of tokens to lock or burn, denominated in the source token's decimals
    address localToken; //  The address on this chain of the token to lock or burn
  }

  struct LockOrBurnOutV1 {
    // The address of the destination token, abi encoded in the case of EVM chains
    // This value is UNTRUSTED as any pool owner can return whatever value they want.
    bytes destTokenAddress;
    // Optional pool data to be transferred to the destination chain. Be default this is capped at
    // CCIP_LOCK_OR_BURN_V1_RET_BYTES bytes. If more data is required, the TokenTransferFeeConfig.destBytesOverhead
    // has to be set for the specific token.
    bytes destPoolData;
  }

  struct ReleaseOrMintInV1 {
    bytes originalSender; //          The original sender of the tx on the source chain
    uint64 remoteChainSelector; // ─╮ The chain ID of the source chain
    address receiver; // ───────────╯ The recipient of the tokens on the destination chain.
    uint256 amount; //                The amount of tokens to release or mint, denominated in the source token's decimals
    address localToken; //            The address on this chain of the token to release or mint
    /// @dev WARNING: sourcePoolAddress should be checked prior to any processing of funds. Make sure it matches the
    /// expected pool address for the given remoteChainSelector.
    bytes sourcePoolAddress; //       The address of the source pool, abi encoded in the case of EVM chains
    bytes sourcePoolData; //          The data received from the source pool to process the release or mint
    /// @dev WARNING: offchainTokenData is untrusted data.
    bytes offchainTokenData; //       The offchain data to process the release or mint
  }

  struct ReleaseOrMintOutV1 {
    // The number of tokens released or minted on the destination chain, denominated in the local token's decimals.
    // This value is expected to be equal to the ReleaseOrMintInV1.amount in the case where the source and destination
    // chain have the same number of decimals.
    uint256 destinationAmount;
  }
}

library MerkleMultiProof {
  /// @notice Leaf domain separator, should be used as the first 32 bytes of a leaf's preimage.
  bytes32 internal constant LEAF_DOMAIN_SEPARATOR = 0x0000000000000000000000000000000000000000000000000000000000000000;
  /// @notice Internal domain separator, should be used as the first 32 bytes of an internal node's preiimage.
  bytes32 internal constant INTERNAL_DOMAIN_SEPARATOR =
    0x0000000000000000000000000000000000000000000000000000000000000001;

  uint256 internal constant MAX_NUM_HASHES = 256;

  error InvalidProof();
  error LeavesCannotBeEmpty();

  /// @notice Computes the root based on provided pre-hashed leaf nodes in
  /// leaves, internal nodes in proofs, and using proofFlagBits' i-th bit to
  /// determine if an element of proofs or one of the previously computed leafs
  /// or internal nodes will be used for the i-th hash.
  /// @param leaves Should be pre-hashed and the first 32 bytes of a leaf's
  /// preimage should match LEAF_DOMAIN_SEPARATOR.
  /// @param proofs The hashes to be used instead of a leaf hash when the proofFlagBits
  ///  indicates a proof should be used.
  /// @param proofFlagBits A single uint256 of which each bit indicates whether a leaf or
  ///  a proof needs to be used in a hash operation.
  /// @dev the maximum number of hash operations it set to 256. Any input that would require
  ///  more than 256 hashes to get to a root will revert.
  /// @dev For given input `leaves` = [a,b,c] `proofs` = [D] and `proofFlagBits` = 5
  ///     totalHashes = 3 + 1 - 1 = 3
  ///  ** round 1 **
  ///    proofFlagBits = (5 >> 0) & 1 = true
  ///    hashes[0] = hashPair(a, b)
  ///    (leafPos, hashPos, proofPos) = (2, 0, 0);
  ///
  ///  ** round 2 **
  ///    proofFlagBits = (5 >> 1) & 1 = false
  ///    hashes[1] = hashPair(D, c)
  ///    (leafPos, hashPos, proofPos) = (3, 0, 1);
  ///
  ///  ** round 3 **
  ///    proofFlagBits = (5 >> 2) & 1 = true
  ///    hashes[2] = hashPair(hashes[0], hashes[1])
  ///    (leafPos, hashPos, proofPos) = (3, 2, 1);
  ///
  ///    i = 3 and no longer < totalHashes. The algorithm is done
  ///    return hashes[totalHashes - 1] = hashes[2]; the last hash we computed.
  // We mark this function as internal to force it to be inlined in contracts
  // that use it, but semantically it is public.
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function merkleRoot(
    bytes32[] memory leaves,
    bytes32[] memory proofs,
    uint256 proofFlagBits
  ) internal pure returns (bytes32) {
    unchecked {
      uint256 leavesLen = leaves.length;
      uint256 proofsLen = proofs.length;
      if (leavesLen == 0) revert LeavesCannotBeEmpty();
      if (!(leavesLen <= MAX_NUM_HASHES + 1 && proofsLen <= MAX_NUM_HASHES + 1)) revert InvalidProof();
      uint256 totalHashes = leavesLen + proofsLen - 1;
      if (!(totalHashes <= MAX_NUM_HASHES)) revert InvalidProof();
      if (totalHashes == 0) {
        return leaves[0];
      }
      bytes32[] memory hashes = new bytes32[](totalHashes);
      (uint256 leafPos, uint256 hashPos, uint256 proofPos) = (0, 0, 0);

      for (uint256 i = 0; i < totalHashes; ++i) {
        // Checks if the bit flag signals the use of a supplied proof or a leaf/previous hash.
        bytes32 a;
        if (proofFlagBits & (1 << i) == (1 << i)) {
          // Use a leaf or a previously computed hash.
          if (leafPos < leavesLen) {
            a = leaves[leafPos++];
          } else {
            a = hashes[hashPos++];
          }
        } else {
          // Use a supplied proof.
          a = proofs[proofPos++];
        }

        // The second part of the hashed pair is never a proof as hashing two proofs would result in a
        // hash that can already be computed offchain.
        bytes32 b;
        if (leafPos < leavesLen) {
          b = leaves[leafPos++];
        } else {
          b = hashes[hashPos++];
        }

        if (!(hashPos <= i)) revert InvalidProof();

        hashes[i] = _hashPair(a, b);
      }
      if (!(hashPos == totalHashes - 1 && leafPos == leavesLen && proofPos == proofsLen)) revert InvalidProof();
      // Return the last hash.
      return hashes[totalHashes - 1];
    }
  }

  /// @notice Hashes two bytes32 objects in their given order, prepended by the
  /// INTERNAL_DOMAIN_SEPARATOR.
  function _hashInternalNode(bytes32 left, bytes32 right) private pure returns (bytes32 hash) {
    return keccak256(abi.encode(INTERNAL_DOMAIN_SEPARATOR, left, right));
  }

  /// @notice Hashes two bytes32 objects. The order is taken into account,
  /// using the lower value first.
  function _hashPair(bytes32 a, bytes32 b) private pure returns (bytes32) {
    return a < b ? _hashInternalNode(a, b) : _hashInternalNode(b, a);
  }
}

library Internal {
  error InvalidEVMAddress(bytes encodedAddress);

  /// @dev The minimum amount of gas to perform the call with exact gas.
  /// We include this in the offramp so that we can redeploy to adjust it
  /// should a hardfork change the gas costs of relevant opcodes in callWithExactGas.
  uint16 internal constant GAS_FOR_CALL_EXACT_CHECK = 5_000;
  // @dev We limit return data to a selector plus 4 words. This is to avoid
  // malicious contracts from returning large amounts of data and causing
  // repeated out-of-gas scenarios.
  uint16 internal constant MAX_RET_BYTES = 4 + 4 * 32;
  /// @dev The expected number of bytes returned by the balanceOf function.
  uint256 internal constant MAX_BALANCE_OF_RET_BYTES = 32;

  /// @notice A collection of token price and gas price updates.
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct PriceUpdates {
    TokenPriceUpdate[] tokenPriceUpdates;
    GasPriceUpdate[] gasPriceUpdates;
  }

  /// @notice Token price in USD.
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct TokenPriceUpdate {
    address sourceToken; // Source token
    uint224 usdPerToken; // 1e18 USD per 1e18 of the smallest token denomination.
  }

  /// @notice Gas price for a given chain in USD, its value may contain tightly packed fields.
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct GasPriceUpdate {
    uint64 destChainSelector; // Destination chain selector
    uint224 usdPerUnitGas; // 1e18 USD per smallest unit (e.g. wei) of destination chain gas
  }

  /// @notice A timestamped uint224 value that can contain several tightly packed fields.
  struct TimestampedPackedUint224 {
    uint224 value; // ───────╮ Value in uint224, packed.
    uint32 timestamp; // ────╯ Timestamp of the most recent price update.
  }

  /// @dev Gas price is stored in 112-bit unsigned int. uint224 can pack 2 prices.
  /// When packing L1 and L2 gas prices, L1 gas price is left-shifted to the higher-order bits.
  /// Using uint8 type, which cannot be higher than other bit shift operands, to avoid shift operand type warning.
  uint8 public constant GAS_PRICE_BITS = 112;

  struct PoolUpdate {
    address token; // The IERC20 token address
    address pool; // The token pool address
  }

  struct SourceTokenData {
    // The source pool address, abi encoded. This value is trusted as it was obtained through the onRamp. It can be
    // relied upon by the destination pool to validate the source pool.
    bytes sourcePoolAddress;
    // The address of the destination token, abi encoded in the case of EVM chains
    // This value is UNTRUSTED as any pool owner can return whatever value they want.
    bytes destTokenAddress;
    // Optional pool data to be transferred to the destination chain. Be default this is capped at
    // CCIP_LOCK_OR_BURN_V1_RET_BYTES bytes. If more data is required, the TokenTransferFeeConfig.destBytesOverhead
    // has to be set for the specific token.
    bytes extraData;
    uint32 destGasAmount; // The amount of gas available for the releaseOrMint and balanceOf calls on the offRamp
  }

  /// @notice Report that is submitted by the execution DON at the execution phase. (including chain selector data)
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct ExecutionReportSingleChain {
    uint64 sourceChainSelector; // Source chain selector for which the report is submitted
    Any2EVMRampMessage[] messages;
    // Contains a bytes array for each message, each inner bytes array contains bytes per transferred token
    bytes[][] offchainTokenData;
    bytes32[] proofs;
    uint256 proofFlagBits;
  }

  /// @notice Report that is submitted by the execution DON at the execution phase.
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct ExecutionReport {
    EVM2EVMMessage[] messages;
    // Contains a bytes array for each message, each inner bytes array contains bytes per transferred token
    bytes[][] offchainTokenData;
    bytes32[] proofs;
    uint256 proofFlagBits;
  }

  /// @notice The cross chain message that gets committed to EVM chains.
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct EVM2EVMMessage {
    uint64 sourceChainSelector; // ────────╮ the chain selector of the source chain, note: not chainId
    address sender; // ────────────────────╯ sender address on the source chain
    address receiver; // ──────────────────╮ receiver address on the destination chain
    uint64 sequenceNumber; // ─────────────╯ sequence number, not unique across lanes
    uint256 gasLimit; //                     user supplied maximum gas amount available for dest chain execution
    bool strict; // ───────────────────────╮ DEPRECATED
    uint64 nonce; //                       │ nonce for this lane for this sender, not unique across senders/lanes
    address feeToken; // ──────────────────╯ fee token
    uint256 feeTokenAmount; //               fee token amount
    bytes data; //                           arbitrary data payload supplied by the message sender
    Client.EVMTokenAmount[] tokenAmounts; // array of tokens and amounts to transfer
    bytes[] sourceTokenData; //              array of token data, one per token
    bytes32 messageId; //                    a hash of the message data
  }

  /// @dev EVM2EVMMessage struct has 13 fields, including 3 variable arrays.
  /// Each variable array takes 1 more slot to store its length.
  /// When abi encoded, excluding array contents,
  /// EVM2EVMMessage takes up a fixed number of 16 lots, 32 bytes each.
  /// For structs that contain arrays, 1 more slot is added to the front, reaching a total of 17.
  uint256 public constant MESSAGE_FIXED_BYTES = 32 * 17;

  /// @dev Each token transfer adds 1 EVMTokenAmount and 3 bytes at 3 slots each and one slot for the destGasAmount.
  /// When abi encoded, each EVMTokenAmount takes 2 slots, each bytes takes 1 slot for length, one slot of data and one
  /// slot for the offset. This results in effectively 3*3 slots per SourceTokenData.
  /// 0x20
  /// destGasAmount
  /// sourcePoolAddress_offset
  /// destTokenAddress_offset
  /// extraData_offset
  /// sourcePoolAddress_length
  /// sourcePoolAddress_content // assume 1 slot
  /// destTokenAddress_length
  /// destTokenAddress_content // assume 1 slot
  /// extraData_length // contents billed separately
  uint256 public constant MESSAGE_FIXED_BYTES_PER_TOKEN = 32 * ((1 + 3 * 3) + 2);

  /// @dev Any2EVMRampMessage struct has 10 fields, including 3 variable unnested arrays (data, receiver and tokenAmounts).
  /// Each variable array takes 1 more slot to store its length.
  /// When abi encoded, excluding array contents,
  /// Any2EVMMessage takes up a fixed number of 13 slots, 32 bytes each.
  /// For structs that contain arrays, 1 more slot is added to the front, reaching a total of 14.
  /// The fixed bytes does not cover struct data (this is represented by ANY_2_EVM_MESSAGE_FIXED_BYTES_PER_TOKEN)
  uint256 public constant ANY_2_EVM_MESSAGE_FIXED_BYTES = 32 * 14;

  /// @dev Each token transfer adds 1 RampTokenAmount
  /// RampTokenAmount has 4 fields, including 3 bytes.
  /// Each bytes takes 1 more slot to store its length, and one slot to store the offset.
  /// When abi encoded, each token transfer takes up 10 slots, excl bytes contents.
  uint256 public constant ANY_2_EVM_MESSAGE_FIXED_BYTES_PER_TOKEN = 32 * 10;

  bytes32 internal constant EVM_2_EVM_MESSAGE_HASH = keccak256("EVM2EVMMessageHashV2");

  /// @dev Used to hash messages for single-lane ramps.
  /// OnRamp hash(EVM2EVMMessage) = OffRamp hash(EVM2EVMMessage)
  /// The EVM2EVMMessage's messageId is expected to be the output of this hash function
  /// @param original Message to hash
  /// @param metadataHash Immutable metadata hash representing a lane with a fixed OnRamp
  /// @return hashedMessage hashed message as a keccak256
  function _hash(EVM2EVMMessage memory original, bytes32 metadataHash) internal pure returns (bytes32) {
    // Fixed-size message fields are included in nested hash to reduce stack pressure.
    // This hashing scheme is also used by RMN. If changing it, please notify the RMN maintainers.
    return keccak256(
      abi.encode(
        MerkleMultiProof.LEAF_DOMAIN_SEPARATOR,
        metadataHash,
        keccak256(
          abi.encode(
            original.sender,
            original.receiver,
            original.sequenceNumber,
            original.gasLimit,
            original.strict,
            original.nonce,
            original.feeToken,
            original.feeTokenAmount
          )
        ),
        keccak256(original.data),
        keccak256(abi.encode(original.tokenAmounts)),
        keccak256(abi.encode(original.sourceTokenData))
      )
    );
  }

  bytes32 internal constant ANY_2_EVM_MESSAGE_HASH = keccak256("Any2EVMMessageHashV1");
  bytes32 internal constant EVM_2_ANY_MESSAGE_HASH = keccak256("EVM2AnyMessageHashV1");

  /// @dev Used to hash messages for multi-lane family-agnostic OffRamps.
  /// OnRamp hash(EVM2AnyMessage) != Any2EVMRampMessage.messageId
  /// OnRamp hash(EVM2AnyMessage) != OffRamp hash(Any2EVMRampMessage)
  /// @param original OffRamp message to hash
  /// @param onRamp OnRamp to hash the message with - used to compute the metadataHash
  /// @return hashedMessage hashed message as a keccak256
  function _hash(Any2EVMRampMessage memory original, bytes memory onRamp) internal pure returns (bytes32) {
    // Fixed-size message fields are included in nested hash to reduce stack pressure.
    // This hashing scheme is also used by RMN. If changing it, please notify the RMN maintainers.
    return keccak256(
      abi.encode(
        MerkleMultiProof.LEAF_DOMAIN_SEPARATOR,
        // Implicit metadata hash
        keccak256(
          abi.encode(
            ANY_2_EVM_MESSAGE_HASH, original.header.sourceChainSelector, original.header.destChainSelector, onRamp
          )
        ),
        keccak256(
          abi.encode(
            original.header.messageId,
            original.sender,
            original.receiver,
            original.header.sequenceNumber,
            original.gasLimit,
            original.header.nonce
          )
        ),
        keccak256(original.data),
        keccak256(abi.encode(original.tokenAmounts))
      )
    );
  }

  function _hash(EVM2AnyRampMessage memory original, bytes32 metadataHash) internal pure returns (bytes32) {
    // Fixed-size message fields are included in nested hash to reduce stack pressure.
    // This hashing scheme is also used by RMN. If changing it, please notify the RMN maintainers.
    return keccak256(
      abi.encode(
        MerkleMultiProof.LEAF_DOMAIN_SEPARATOR,
        metadataHash,
        keccak256(
          abi.encode(
            original.sender,
            original.receiver,
            original.header.sequenceNumber,
            original.header.nonce,
            original.feeToken,
            original.feeTokenAmount
          )
        ),
        keccak256(original.data),
        keccak256(abi.encode(original.tokenAmounts)),
        keccak256(original.extraArgs)
      )
    );
  }

  /// @dev We disallow the first 1024 addresses to avoid calling into a range known for hosting precompiles. Calling
  /// into precompiles probably won't cause any issues, but to be safe we can disallow this range. It is extremely
  /// unlikely that anyone would ever be able to generate an address in this range. There is no official range of
  /// precompiles, but EIP-7587 proposes to reserve the range 0x100 to 0x1ff. Our range is more conservative, even
  /// though it might not be exhaustive for all chains, which is OK. We also disallow the zero address, which is a
  /// common practice.
  uint256 public constant PRECOMPILE_SPACE = 1024;

  /// @notice This methods provides validation for parsing abi encoded addresses by ensuring the
  /// address is within the EVM address space. If it isn't it will revert with an InvalidEVMAddress error, which
  /// we can catch and handle more gracefully than a revert from abi.decode.
  /// @return The address if it is valid, the function will revert otherwise.
  function _validateEVMAddress(bytes memory encodedAddress) internal pure returns (address) {
    if (encodedAddress.length != 32) revert InvalidEVMAddress(encodedAddress);
    uint256 encodedAddressUint = abi.decode(encodedAddress, (uint256));
    if (encodedAddressUint > type(uint160).max || encodedAddressUint < PRECOMPILE_SPACE) {
      revert InvalidEVMAddress(encodedAddress);
    }
    return address(uint160(encodedAddressUint));
  }

  /// @notice Enum listing the possible message execution states within
  /// the offRamp contract.
  /// UNTOUCHED never executed
  /// IN_PROGRESS currently being executed, used a replay protection
  /// SUCCESS successfully executed. End state
  /// FAILURE unsuccessfully executed, manual execution is now enabled.
  /// @dev RMN depends on this enum, if changing, please notify the RMN maintainers.
  enum MessageExecutionState {
    UNTOUCHED,
    IN_PROGRESS,
    SUCCESS,
    FAILURE
  }

  /// @notice CCIP OCR plugin type, used to separate execution & commit transmissions and configs
  enum OCRPluginType {
    Commit,
    Execution
  }

  /// @notice Family-agnostic token amounts used for both OnRamp & OffRamp messages
  struct RampTokenAmount {
    // The source pool address, abi encoded. This value is trusted as it was obtained through the onRamp. It can be
    // relied upon by the destination pool to validate the source pool.
    bytes sourcePoolAddress;
    // The address of the destination token, abi encoded in the case of EVM chains
    // This value is UNTRUSTED as any pool owner can return whatever value they want.
    bytes destTokenAddress;
    // Optional pool data to be transferred to the destination chain. Be default this is capped at
    // CCIP_LOCK_OR_BURN_V1_RET_BYTES bytes. If more data is required, the TokenTransferFeeConfig.destBytesOverhead
    // has to be set for the specific token.
    bytes extraData;
    uint256 amount; // Amount of tokens.
  }

  /// @notice Family-agnostic header for OnRamp & OffRamp messages.
  /// The messageId is not expected to match hash(message), since it may originate from another ramp family
  struct RampMessageHeader {
    bytes32 messageId; // Unique identifier for the message, generated with the source chain's encoding scheme (i.e. not necessarily abi.encoded)
    uint64 sourceChainSelector; // ──╮ the chain selector of the source chain, note: not chainId
    uint64 destChainSelector; //     | the chain selector of the destination chain, note: not chainId
    uint64 sequenceNumber; //        │ sequence number, not unique across lanes
    uint64 nonce; // ────────────────╯ nonce for this lane for this sender, not unique across senders/lanes
  }

  /// @notice Family-agnostic message routed to an OffRamp
  /// Note: hash(Any2EVMRampMessage) != hash(EVM2AnyRampMessage), hash(Any2EVMRampMessage) != messageId
  /// due to encoding & parameter differences
  struct Any2EVMRampMessage {
    RampMessageHeader header; // Message header
    bytes sender; // sender address on the source chain
    bytes data; // arbitrary data payload supplied by the message sender
    address receiver; // receiver address on the destination chain
    uint256 gasLimit; // user supplied maximum gas amount available for dest chain execution
    RampTokenAmount[] tokenAmounts; // array of tokens and amounts to transfer
  }

  /// @notice Family-agnostic message emitted from the OnRamp
  /// Note: hash(Any2EVMRampMessage) != hash(EVM2AnyRampMessage) due to encoding & parameter differences
  /// messageId = hash(EVM2AnyRampMessage) using the source EVM chain's encoding format
  struct EVM2AnyRampMessage {
    RampMessageHeader header; // Message header
    address sender; // sender address on the source chain
    bytes data; // arbitrary data payload supplied by the message sender
    bytes receiver; // receiver address on the destination chain
    bytes extraArgs; // destination-chain specific extra args, such as the gasLimit for EVM chains
    address feeToken; // fee token
    uint256 feeTokenAmount; // fee token amount
    RampTokenAmount[] tokenAmounts; // array of tokens and amounts to transfer
  }

  // bytes4(keccak256("CCIP ChainFamilySelector EVM"))
  bytes4 public constant CHAIN_FAMILY_SELECTOR_EVM = 0x2812d52c;
}

library EnumerableMap {
    using EnumerableSet for EnumerableSet.Bytes32Set;

    // To implement this library for multiple types with as little code
    // repetition as possible, we write it in terms of a generic Map type with
    // bytes32 keys and values.
    // The Map implementation uses private functions, and user-facing
    // implementations (such as Uint256ToAddressMap) are just wrappers around
    // the underlying Map.
    // This means that we can only create new EnumerableMaps for types that fit
    // in bytes32.

    struct Bytes32ToBytes32Map {
        // Storage of keys
        EnumerableSet.Bytes32Set _keys;
        mapping(bytes32 => bytes32) _values;
    }

    /**
     * @dev Adds a key-value pair to a map, or updates the value for an existing
     * key. O(1).
     *
     * Returns true if the key was added to the map, that is if it was not
     * already present.
     */
    function set(
        Bytes32ToBytes32Map storage map,
        bytes32 key,
        bytes32 value
    ) internal returns (bool) {
        map._values[key] = value;
        return map._keys.add(key);
    }

    /**
     * @dev Removes a key-value pair from a map. O(1).
     *
     * Returns true if the key was removed from the map, that is if it was present.
     */
    function remove(Bytes32ToBytes32Map storage map, bytes32 key) internal returns (bool) {
        delete map._values[key];
        return map._keys.remove(key);
    }

    /**
     * @dev Returns true if the key is in the map. O(1).
     */
    function contains(Bytes32ToBytes32Map storage map, bytes32 key) internal view returns (bool) {
        return map._keys.contains(key);
    }

    /**
     * @dev Returns the number of key-value pairs in the map. O(1).
     */
    function length(Bytes32ToBytes32Map storage map) internal view returns (uint256) {
        return map._keys.length();
    }

    /**
     * @dev Returns the key-value pair stored at position `index` in the map. O(1).
     *
     * Note that there are no guarantees on the ordering of entries inside the
     * array, and it may change when more entries are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(Bytes32ToBytes32Map storage map, uint256 index) internal view returns (bytes32, bytes32) {
        bytes32 key = map._keys.at(index);
        return (key, map._values[key]);
    }

    /**
     * @dev Tries to returns the value associated with `key`. O(1).
     * Does not revert if `key` is not in the map.
     */
    function tryGet(Bytes32ToBytes32Map storage map, bytes32 key) internal view returns (bool, bytes32) {
        bytes32 value = map._values[key];
        if (value == bytes32(0)) {
            return (contains(map, key), bytes32(0));
        } else {
            return (true, value);
        }
    }

    /**
     * @dev Returns the value associated with `key`. O(1).
     *
     * Requirements:
     *
     * - `key` must be in the map.
     */
    function get(Bytes32ToBytes32Map storage map, bytes32 key) internal view returns (bytes32) {
        bytes32 value = map._values[key];
        require(value != 0 || contains(map, key), "EnumerableMap: nonexistent key");
        return value;
    }

    /**
     * @dev Same as {get}, with a custom error message when `key` is not in the map.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryGet}.
     */
    function get(
        Bytes32ToBytes32Map storage map,
        bytes32 key,
        string memory errorMessage
    ) internal view returns (bytes32) {
        bytes32 value = map._values[key];
        require(value != 0 || contains(map, key), errorMessage);
        return value;
    }

    // UintToUintMap

    struct UintToUintMap {
        Bytes32ToBytes32Map _inner;
    }

    /**
     * @dev Adds a key-value pair to a map, or updates the value for an existing
     * key. O(1).
     *
     * Returns true if the key was added to the map, that is if it was not
     * already present.
     */
    function set(
        UintToUintMap storage map,
        uint256 key,
        uint256 value
    ) internal returns (bool) {
        return set(map._inner, bytes32(key), bytes32(value));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the key was removed from the map, that is if it was present.
     */
    function remove(UintToUintMap storage map, uint256 key) internal returns (bool) {
        return remove(map._inner, bytes32(key));
    }

    /**
     * @dev Returns true if the key is in the map. O(1).
     */
    function contains(UintToUintMap storage map, uint256 key) internal view returns (bool) {
        return contains(map._inner, bytes32(key));
    }

    /**
     * @dev Returns the number of elements in the map. O(1).
     */
    function length(UintToUintMap storage map) internal view returns (uint256) {
        return length(map._inner);
    }

    /**
     * @dev Returns the element stored at position `index` in the set. O(1).
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(UintToUintMap storage map, uint256 index) internal view returns (uint256, uint256) {
        (bytes32 key, bytes32 value) = at(map._inner, index);
        return (uint256(key), uint256(value));
    }

    /**
     * @dev Tries to returns the value associated with `key`. O(1).
     * Does not revert if `key` is not in the map.
     */
    function tryGet(UintToUintMap storage map, uint256 key) internal view returns (bool, uint256) {
        (bool success, bytes32 value) = tryGet(map._inner, bytes32(key));
        return (success, uint256(value));
    }

    /**
     * @dev Returns the value associated with `key`. O(1).
     *
     * Requirements:
     *
     * - `key` must be in the map.
     */
    function get(UintToUintMap storage map, uint256 key) internal view returns (uint256) {
        return uint256(get(map._inner, bytes32(key)));
    }

    /**
     * @dev Same as {get}, with a custom error message when `key` is not in the map.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryGet}.
     */
    function get(
        UintToUintMap storage map,
        uint256 key,
        string memory errorMessage
    ) internal view returns (uint256) {
        return uint256(get(map._inner, bytes32(key), errorMessage));
    }

    // UintToAddressMap

    struct UintToAddressMap {
        Bytes32ToBytes32Map _inner;
    }

    /**
     * @dev Adds a key-value pair to a map, or updates the value for an existing
     * key. O(1).
     *
     * Returns true if the key was added to the map, that is if it was not
     * already present.
     */
    function set(
        UintToAddressMap storage map,
        uint256 key,
        address value
    ) internal returns (bool) {
        return set(map._inner, bytes32(key), bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the key was removed from the map, that is if it was present.
     */
    function remove(UintToAddressMap storage map, uint256 key) internal returns (bool) {
        return remove(map._inner, bytes32(key));
    }

    /**
     * @dev Returns true if the key is in the map. O(1).
     */
    function contains(UintToAddressMap storage map, uint256 key) internal view returns (bool) {
        return contains(map._inner, bytes32(key));
    }

    /**
     * @dev Returns the number of elements in the map. O(1).
     */
    function length(UintToAddressMap storage map) internal view returns (uint256) {
        return length(map._inner);
    }

    /**
     * @dev Returns the element stored at position `index` in the set. O(1).
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(UintToAddressMap storage map, uint256 index) internal view returns (uint256, address) {
        (bytes32 key, bytes32 value) = at(map._inner, index);
        return (uint256(key), address(uint160(uint256(value))));
    }

    /**
     * @dev Tries to returns the value associated with `key`. O(1).
     * Does not revert if `key` is not in the map.
     */
    function tryGet(UintToAddressMap storage map, uint256 key) internal view returns (bool, address) {
        (bool success, bytes32 value) = tryGet(map._inner, bytes32(key));
        return (success, address(uint160(uint256(value))));
    }

    /**
     * @dev Returns the value associated with `key`. O(1).
     *
     * Requirements:
     *
     * - `key` must be in the map.
     */
    function get(UintToAddressMap storage map, uint256 key) internal view returns (address) {
        return address(uint160(uint256(get(map._inner, bytes32(key)))));
    }

    /**
     * @dev Same as {get}, with a custom error message when `key` is not in the map.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryGet}.
     */
    function get(
        UintToAddressMap storage map,
        uint256 key,
        string memory errorMessage
    ) internal view returns (address) {
        return address(uint160(uint256(get(map._inner, bytes32(key), errorMessage))));
    }

    // AddressToUintMap

    struct AddressToUintMap {
        Bytes32ToBytes32Map _inner;
    }

    /**
     * @dev Adds a key-value pair to a map, or updates the value for an existing
     * key. O(1).
     *
     * Returns true if the key was added to the map, that is if it was not
     * already present.
     */
    function set(
        AddressToUintMap storage map,
        address key,
        uint256 value
    ) internal returns (bool) {
        return set(map._inner, bytes32(uint256(uint160(key))), bytes32(value));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the key was removed from the map, that is if it was present.
     */
    function remove(AddressToUintMap storage map, address key) internal returns (bool) {
        return remove(map._inner, bytes32(uint256(uint160(key))));
    }

    /**
     * @dev Returns true if the key is in the map. O(1).
     */
    function contains(AddressToUintMap storage map, address key) internal view returns (bool) {
        return contains(map._inner, bytes32(uint256(uint160(key))));
    }

    /**
     * @dev Returns the number of elements in the map. O(1).
     */
    function length(AddressToUintMap storage map) internal view returns (uint256) {
        return length(map._inner);
    }

    /**
     * @dev Returns the element stored at position `index` in the set. O(1).
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(AddressToUintMap storage map, uint256 index) internal view returns (address, uint256) {
        (bytes32 key, bytes32 value) = at(map._inner, index);
        return (address(uint160(uint256(key))), uint256(value));
    }

    /**
     * @dev Tries to returns the value associated with `key`. O(1).
     * Does not revert if `key` is not in the map.
     */
    function tryGet(AddressToUintMap storage map, address key) internal view returns (bool, uint256) {
        (bool success, bytes32 value) = tryGet(map._inner, bytes32(uint256(uint160(key))));
        return (success, uint256(value));
    }

    /**
     * @dev Returns the value associated with `key`. O(1).
     *
     * Requirements:
     *
     * - `key` must be in the map.
     */
    function get(AddressToUintMap storage map, address key) internal view returns (uint256) {
        return uint256(get(map._inner, bytes32(uint256(uint160(key)))));
    }

    /**
     * @dev Same as {get}, with a custom error message when `key` is not in the map.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryGet}.
     */
    function get(
        AddressToUintMap storage map,
        address key,
        string memory errorMessage
    ) internal view returns (uint256) {
        return uint256(get(map._inner, bytes32(uint256(uint160(key))), errorMessage));
    }

    // Bytes32ToUintMap

    struct Bytes32ToUintMap {
        Bytes32ToBytes32Map _inner;
    }

    /**
     * @dev Adds a key-value pair to a map, or updates the value for an existing
     * key. O(1).
     *
     * Returns true if the key was added to the map, that is if it was not
     * already present.
     */
    function set(
        Bytes32ToUintMap storage map,
        bytes32 key,
        uint256 value
    ) internal returns (bool) {
        return set(map._inner, key, bytes32(value));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the key was removed from the map, that is if it was present.
     */
    function remove(Bytes32ToUintMap storage map, bytes32 key) internal returns (bool) {
        return remove(map._inner, key);
    }

    /**
     * @dev Returns true if the key is in the map. O(1).
     */
    function contains(Bytes32ToUintMap storage map, bytes32 key) internal view returns (bool) {
        return contains(map._inner, key);
    }

    /**
     * @dev Returns the number of elements in the map. O(1).
     */
    function length(Bytes32ToUintMap storage map) internal view returns (uint256) {
        return length(map._inner);
    }

    /**
     * @dev Returns the element stored at position `index` in the set. O(1).
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.
     *
     * Requirements:
     *
     * - `index` must be strictly less than {length}.
     */
    function at(Bytes32ToUintMap storage map, uint256 index) internal view returns (bytes32, uint256) {
        (bytes32 key, bytes32 value) = at(map._inner, index);
        return (key, uint256(value));
    }

    /**
     * @dev Tries to returns the value associated with `key`. O(1).
     * Does not revert if `key` is not in the map.
     */
    function tryGet(Bytes32ToUintMap storage map, bytes32 key) internal view returns (bool, uint256) {
        (bool success, bytes32 value) = tryGet(map._inner, key);
        return (success, uint256(value));
    }

    /**
     * @dev Returns the value associated with `key`. O(1).
     *
     * Requirements:
     *
     * - `key` must be in the map.
     */
    function get(Bytes32ToUintMap storage map, bytes32 key) internal view returns (uint256) {
        return uint256(get(map._inner, key));
    }

    /**
     * @dev Same as {get}, with a custom error message when `key` is not in the map.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryGet}.
     */
    function get(
        Bytes32ToUintMap storage map,
        bytes32 key,
        string memory errorMessage
    ) internal view returns (uint256) {
        return uint256(get(map._inner, key, errorMessage));
    }
}

library EnumerableSet {
  // To implement this library for multiple types with as little code
  // repetition as possible, we write it in terms of a generic Set type with
  // bytes32 values.
  // The Set implementation uses private functions, and user-facing
  // implementations (such as AddressSet) are just wrappers around the
  // underlying Set.
  // This means that we can only create new EnumerableSets for types that fit
  // in bytes32.

  struct Set {
    // Storage of set values
    bytes32[] _values;
    // Position of the value in the `values` array, plus 1 because index 0
    // means a value is not in the set.
    mapping(bytes32 => uint256) _indexes;
  }

  /**
   * @dev Add a value to a set. O(1).
   *
   * Returns true if the value was added to the set, that is if it was not
   * already present.
   */
  function _add(Set storage set, bytes32 value) private returns (bool) {
    if (!_contains(set, value)) {
      set._values.push(value);
      // The value is stored at length-1, but we add 1 to all indexes
      // and use 0 as a sentinel value
      set._indexes[value] = set._values.length;
      return true;
    } else {
      return false;
    }
  }

  /**
   * @dev Removes a value from a set. O(1).
   *
   * Returns true if the value was removed from the set, that is if it was
   * present.
   */
  function _remove(Set storage set, bytes32 value) private returns (bool) {
    // We read and store the value's index to prevent multiple reads from the same storage slot
    uint256 valueIndex = set._indexes[value];

    if (valueIndex != 0) {
      // Equivalent to contains(set, value)
      // To delete an element from the _values array in O(1), we swap the element to delete with the last one in
      // the array, and then remove the last element (sometimes called as 'swap and pop').
      // This modifies the order of the array, as noted in {at}.

      uint256 toDeleteIndex = valueIndex - 1;
      uint256 lastIndex = set._values.length - 1;

      if (lastIndex != toDeleteIndex) {
        bytes32 lastValue = set._values[lastIndex];

        // Move the last value to the index where the value to delete is
        set._values[toDeleteIndex] = lastValue;
        // Update the index for the moved value
        set._indexes[lastValue] = valueIndex; // Replace lastValue's index to valueIndex
      }

      // Delete the slot where the moved value was stored
      set._values.pop();

      // Delete the index for the deleted slot
      delete set._indexes[value];

      return true;
    } else {
      return false;
    }
  }

  /**
   * @dev Returns true if the value is in the set. O(1).
   */
  function _contains(Set storage set, bytes32 value) private view returns (bool) {
    return set._indexes[value] != 0;
  }

  /**
   * @dev Returns the number of values on the set. O(1).
   */
  function _length(Set storage set) private view returns (uint256) {
    return set._values.length;
  }

  /**
   * @dev Returns the value stored at position `index` in the set. O(1).
   *
   * Note that there are no guarantees on the ordering of values inside the
   * array, and it may change when more values are added or removed.
   *
   * Requirements:
   *
   * - `index` must be strictly less than {length}.
   */
  function _at(Set storage set, uint256 index) private view returns (bytes32) {
    return set._values[index];
  }

  /**
   * @dev Return the entire set in an array
   *
   * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
   * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
   * this function has an unbounded cost, and using it as part of a state-changing function may render the function
   * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
   */
  function _values(Set storage set) private view returns (bytes32[] memory) {
    return set._values;
  }

  // Bytes32Set

  struct Bytes32Set {
    Set _inner;
  }

  /**
   * @dev Add a value to a set. O(1).
   *
   * Returns true if the value was added to the set, that is if it was not
   * already present.
   */
  function add(Bytes32Set storage set, bytes32 value) internal returns (bool) {
    return _add(set._inner, value);
  }

  /**
   * @dev Removes a value from a set. O(1).
   *
   * Returns true if the value was removed from the set, that is if it was
   * present.
   */
  function remove(Bytes32Set storage set, bytes32 value) internal returns (bool) {
    return _remove(set._inner, value);
  }

  /**
   * @dev Returns true if the value is in the set. O(1).
   */
  function contains(Bytes32Set storage set, bytes32 value) internal view returns (bool) {
    return _contains(set._inner, value);
  }

  /**
   * @dev Returns the number of values in the set. O(1).
   */
  function length(Bytes32Set storage set) internal view returns (uint256) {
    return _length(set._inner);
  }

  /**
   * @dev Returns the value stored at position `index` in the set. O(1).
   *
   * Note that there are no guarantees on the ordering of values inside the
   * array, and it may change when more values are added or removed.
   *
   * Requirements:
   *
   * - `index` must be strictly less than {length}.
   */
  function at(Bytes32Set storage set, uint256 index) internal view returns (bytes32) {
    return _at(set._inner, index);
  }

  /**
   * @dev Return the entire set in an array
   *
   * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
   * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
   * this function has an unbounded cost, and using it as part of a state-changing function may render the function
   * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
   */
  function values(Bytes32Set storage set) internal view returns (bytes32[] memory) {
    bytes32[] memory store = _values(set._inner);
    bytes32[] memory result;

    /// @solidity memory-safe-assembly
    assembly {
      result := store
    }

    return result;
  }

  // AddressSet

  struct AddressSet {
    Set _inner;
  }

  /**
   * @dev Add a value to a set. O(1).
   *
   * Returns true if the value was added to the set, that is if it was not
   * already present.
   */
  function add(AddressSet storage set, address value) internal returns (bool) {
    return _add(set._inner, bytes32(uint256(uint160(value))));
  }

  /**
   * @dev Removes a value from a set. O(1).
   *
   * Returns true if the value was removed from the set, that is if it was
   * present.
   */
  function remove(AddressSet storage set, address value) internal returns (bool) {
    return _remove(set._inner, bytes32(uint256(uint160(value))));
  }

  /**
   * @dev Returns true if the value is in the set. O(1).
   */
  function contains(AddressSet storage set, address value) internal view returns (bool) {
    return _contains(set._inner, bytes32(uint256(uint160(value))));
  }

  /**
   * @dev Returns the number of values in the set. O(1).
   */
  function length(AddressSet storage set) internal view returns (uint256) {
    return _length(set._inner);
  }

  /**
   * @dev Returns the value stored at position `index` in the set. O(1).
   *
   * Note that there are no guarantees on the ordering of values inside the
   * array, and it may change when more values are added or removed.
   *
   * Requirements:
   *
   * - `index` must be strictly less than {length}.
   */
  function at(AddressSet storage set, uint256 index) internal view returns (address) {
    return address(uint160(uint256(_at(set._inner, index))));
  }

  /**
   * @dev Return the entire set in an array
   *
   * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
   * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
   * this function has an unbounded cost, and using it as part of a state-changing function may render the function
   * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
   */
  function values(AddressSet storage set) internal view returns (address[] memory) {
    bytes32[] memory store = _values(set._inner);
    address[] memory result;

    /// @solidity memory-safe-assembly
    assembly {
      result := store
    }

    return result;
  }

  // UintSet

  struct UintSet {
    Set _inner;
  }

  /**
   * @dev Add a value to a set. O(1).
   *
   * Returns true if the value was added to the set, that is if it was not
   * already present.
   */
  function add(UintSet storage set, uint256 value) internal returns (bool) {
    return _add(set._inner, bytes32(value));
  }

  /**
   * @dev Removes a value from a set. O(1).
   *
   * Returns true if the value was removed from the set, that is if it was
   * present.
   */
  function remove(UintSet storage set, uint256 value) internal returns (bool) {
    return _remove(set._inner, bytes32(value));
  }

  /**
   * @dev Returns true if the value is in the set. O(1).
   */
  function contains(UintSet storage set, uint256 value) internal view returns (bool) {
    return _contains(set._inner, bytes32(value));
  }

  /**
   * @dev Returns the number of values in the set. O(1).
   */
  function length(UintSet storage set) internal view returns (uint256) {
    return _length(set._inner);
  }

  /**
   * @dev Returns the value stored at position `index` in the set. O(1).
   *
   * Note that there are no guarantees on the ordering of values inside the
   * array, and it may change when more values are added or removed.
   *
   * Requirements:
   *
   * - `index` must be strictly less than {length}.
   */
  function at(UintSet storage set, uint256 index) internal view returns (uint256) {
    return uint256(_at(set._inner, index));
  }

  /**
   * @dev Return the entire set in an array
   *
   * WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
   * to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
   * this function has an unbounded cost, and using it as part of a state-changing function may render the function
   * uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.
   */
  function values(UintSet storage set) internal view returns (uint256[] memory) {
    bytes32[] memory store = _values(set._inner);
    uint256[] memory result;

    /// @solidity memory-safe-assembly
    assembly {
      result := store
    }

    return result;
  }
}

library EnumerableMapBytes32 {
  using EnumerableSet for EnumerableSet.Bytes32Set;

  error NonexistentKeyError();

  struct Bytes32ToBytesMap {
    EnumerableSet.Bytes32Set _keys;
    mapping(bytes32 => bytes) _values;
  }

  /**
   * @dev Adds a key-value pair to a map, or updates the value for an existing
   * key. O(1).
   *
   * Returns true if the key was added to the map, that is if it was not
   * already present.
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function set(Bytes32ToBytesMap storage map, bytes32 key, bytes memory value) internal returns (bool) {
    map._values[key] = value;
    return map._keys.add(key);
  }

  /**
   * @dev Removes a key-value pair from a map. O(1).
   *
   * Returns true if the key was removed from the map, that is if it was present.
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function remove(Bytes32ToBytesMap storage map, bytes32 key) internal returns (bool) {
    delete map._values[key];
    return map._keys.remove(key);
  }

  /**
   * @dev Returns true if the key is in the map. O(1).
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function contains(Bytes32ToBytesMap storage map, bytes32 key) internal view returns (bool) {
    return map._keys.contains(key);
  }

  /**
   * @dev Returns the number of key-value pairs in the map. O(1).
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function length(Bytes32ToBytesMap storage map) internal view returns (uint256) {
    return map._keys.length();
  }

  /**
   * @dev Returns the key-value pair stored at position `index` in the map. O(1).
   *
   * Note that there are no guarantees on the ordering of entries inside the
   * array, and it may change when more entries are added or removed.
   *
   * Requirements:
   *
   * - `index` must be strictly less than {length}.
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function at(Bytes32ToBytesMap storage map, uint256 index) internal view returns (bytes32, bytes memory) {
    bytes32 key = map._keys.at(index);
    return (key, map._values[key]);
  }

  /**
   * @dev Tries to returns the value associated with `key`. O(1).
   * Does not revert if `key` is not in the map.
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function tryGet(Bytes32ToBytesMap storage map, bytes32 key) internal view returns (bool, bytes memory) {
    bytes memory value = map._values[key];
    if (value.length == 0) {
      return (contains(map, key), bytes(""));
    } else {
      return (true, value);
    }
  }

  /**
   * @dev Returns the value associated with `key`. O(1).
   *
   * Requirements:
   *
   * - `key` must be in the map.
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function get(Bytes32ToBytesMap storage map, bytes32 key) internal view returns (bytes memory) {
    bytes memory value = map._values[key];
    if (value.length == 0 && !contains(map, key)) {
      revert NonexistentKeyError();
    }
    return value;
  }
}

library EnumerableMapAddresses {
  using EnumerableMap for EnumerableMap.UintToAddressMap;
  using EnumerableMap for EnumerableMap.Bytes32ToBytes32Map;
  using EnumerableMapBytes32 for EnumerableMapBytes32.Bytes32ToBytesMap;

  struct AddressToAddressMap {
    EnumerableMap.UintToAddressMap _inner;
  }

  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function set(AddressToAddressMap storage map, address key, address value) internal returns (bool) {
    return map._inner.set(uint256(uint160(key)), value);
  }

  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function remove(AddressToAddressMap storage map, address key) internal returns (bool) {
    return map._inner.remove(uint256(uint160(key)));
  }

  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function contains(AddressToAddressMap storage map, address key) internal view returns (bool) {
    return map._inner.contains(uint256(uint160(key)));
  }

  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function length(AddressToAddressMap storage map) internal view returns (uint256) {
    return map._inner.length();
  }

  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function at(AddressToAddressMap storage map, uint256 index) internal view returns (address, address) {
    (uint256 key, address value) = map._inner.at(index);
    return (address(uint160(key)), value);
  }

  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function tryGet(AddressToAddressMap storage map, address key) internal view returns (bool, address) {
    return map._inner.tryGet(uint256(uint160(key)));
  }

  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function get(AddressToAddressMap storage map, address key) internal view returns (address) {
    return map._inner.get(uint256(uint160(key)));
  }

  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function get(
    AddressToAddressMap storage map,
    address key,
    string memory errorMessage
  ) internal view returns (address) {
    return map._inner.get(uint256(uint160(key)), errorMessage);
  }

  struct AddressToBytes32Map {
    EnumerableMap.Bytes32ToBytes32Map _inner;
  }

  /**
   * @dev Adds a key-value pair to a map, or updates the value for an existing
   * key. O(1).
   *
   * Returns true if the key was added to the map, that is if it was not
   * already present.
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function set(AddressToBytes32Map storage map, address key, bytes32 value) internal returns (bool) {
    return map._inner.set(bytes32(uint256(uint160(key))), value);
  }

  /**
   * @dev Removes a value from a map. O(1).
   *
   * Returns true if the key was removed from the map, that is if it was present.
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function remove(AddressToBytes32Map storage map, address key) internal returns (bool) {
    return map._inner.remove(bytes32(uint256(uint160(key))));
  }

  /**
   * @dev Returns true if the key is in the map. O(1).
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function contains(AddressToBytes32Map storage map, address key) internal view returns (bool) {
    return map._inner.contains(bytes32(uint256(uint160(key))));
  }

  /**
   * @dev Returns the number of elements in the map. O(1).
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function length(AddressToBytes32Map storage map) internal view returns (uint256) {
    return map._inner.length();
  }

  /**
   * @dev Returns the element stored at position `index` in the map. O(1).
   * Note that there are no guarantees on the ordering of values inside the
   * array, and it may change when more values are added or removed.
   *
   * Requirements:
   *
   * - `index` must be strictly less than {length}.
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function at(AddressToBytes32Map storage map, uint256 index) internal view returns (address, bytes32) {
    (bytes32 key, bytes32 value) = map._inner.at(index);
    return (address(uint160(uint256(key))), value);
  }

  /**
   * @dev Tries to returns the value associated with `key`. O(1).
   * Does not revert if `key` is not in the map.
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function tryGet(AddressToBytes32Map storage map, address key) internal view returns (bool, bytes32) {
    (bool success, bytes32 value) = map._inner.tryGet(bytes32(uint256(uint160(key))));
    return (success, value);
  }

  /**
   * @dev Returns the value associated with `key`. O(1).
   *
   * Requirements:
   *
   * - `key` must be in the map.
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function get(AddressToBytes32Map storage map, address key) internal view returns (bytes32) {
    return map._inner.get(bytes32(uint256(uint160(key))));
  }

  struct AddressToBytesMap {
    EnumerableMapBytes32.Bytes32ToBytesMap _inner;
  }

  /**
   * @dev Sets the value for `key` in the map. Returns true if the key was added to the map, that is if it was not already present.
   * @param map The map where the value will be set
   * @param key The key to set the value for
   * @param value The value to set for the key
   * @return bool indicating whether the key was added to the map
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function set(AddressToBytesMap storage map, address key, bytes memory value) internal returns (bool) {
    return map._inner.set(bytes32(uint256(uint160(key))), value);
  }

  /**
   * @dev Removes the value for `key` in the map. Returns true if the key was removed from the map, that is if it was present.
   * @param map The map where the value will be removed
   * @param key The key to remove the value for
   * @return bool indicating whether the key was removed from the map
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function remove(AddressToBytesMap storage map, address key) internal returns (bool) {
    return map._inner.remove(bytes32(uint256(uint160(key))));
  }

  /**
   * @dev Checks if the map contains the `key`. Returns true if the key is in the map.
   * @param map The map to check for the presence of the key
   * @param key The key to check for presence in the map
   * @return bool indicating whether the key is in the map
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function contains(AddressToBytesMap storage map, address key) internal view returns (bool) {
    return map._inner.contains(bytes32(uint256(uint160(key))));
  }

  /**
   * @dev Returns the number of elements in the map.
   * @param map The map to check the length of
   * @return uint256 indicating the number of elements in the map
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function length(AddressToBytesMap storage map) internal view returns (uint256) {
    return map._inner.length();
  }

  /**
   * @dev Returns the element stored at position `index` in the map. Note that there are no guarantees on the ordering of values inside the array, and it may change when more values are added or removed.
   * @param map The map to retrieve the element from
   * @param index The index to retrieve the element at
   * @return address The key of the element at the specified index
   * @return bytes The value of the element at the specified index
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function at(AddressToBytesMap storage map, uint256 index) internal view returns (address, bytes memory) {
    (bytes32 key, bytes memory value) = map._inner.at(index);
    return (address(uint160(uint256(key))), value);
  }

  /**
   * @dev Tries to return the value associated with `key`. Does not revert if `key` is not in the map.
   * @param map The map to retrieve the value from
   * @param key The key to retrieve the value for
   * @return bool indicating whether the key was in the map
   * @return bytes The value associated with the key
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function tryGet(AddressToBytesMap storage map, address key) internal view returns (bool, bytes memory) {
    return map._inner.tryGet(bytes32(uint256(uint160(key))));
  }

  /**
   * @dev Returns the value associated with `key`.
   * @param map The map to retrieve the value from
   * @param key The key to retrieve the value for
   * @return bytes The value associated with the key
   */
  // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
  function get(AddressToBytesMap storage map, address key) internal view returns (bytes memory) {
    return map._inner.get(bytes32(uint256(uint160(key))));
  }
}

library ERC165Checker {
    // As per the EIP-165 spec, no interface should ever match 0xffffffff
    bytes4 private constant INTERFACE_ID_INVALID = 0xffffffff;

    /**
     * @dev Returns true if `account` supports the {IERC165} interface.
     */
    function supportsERC165(address account) internal view returns (bool) {
        // Any contract that implements ERC165 must explicitly indicate support of
        // InterfaceId_ERC165 and explicitly indicate non-support of InterfaceId_Invalid
        return
            supportsERC165InterfaceUnchecked(account, type(IERC165).interfaceId) &&
            !supportsERC165InterfaceUnchecked(account, INTERFACE_ID_INVALID);
    }

    /**
     * @dev Returns true if `account` supports the interface defined by
     * `interfaceId`. Support for {IERC165} itself is queried automatically.
     *
     * See {IERC165-supportsInterface}.
     */
    function supportsInterface(address account, bytes4 interfaceId) internal view returns (bool) {
        // query support of both ERC165 as per the spec and support of _interfaceId
        return supportsERC165(account) && supportsERC165InterfaceUnchecked(account, interfaceId);
    }

    /**
     * @dev Returns a boolean array where each value corresponds to the
     * interfaces passed in and whether they're supported or not. This allows
     * you to batch check interfaces for a contract where your expectation
     * is that some interfaces may not be supported.
     *
     * See {IERC165-supportsInterface}.
     */
    function getSupportedInterfaces(
        address account,
        bytes4[] memory interfaceIds
    ) internal view returns (bool[] memory) {
        // an array of booleans corresponding to interfaceIds and whether they're supported or not
        bool[] memory interfaceIdsSupported = new bool[](interfaceIds.length);

        // query support of ERC165 itself
        if (supportsERC165(account)) {
            // query support of each interface in interfaceIds
            for (uint256 i = 0; i < interfaceIds.length; i++) {
                interfaceIdsSupported[i] = supportsERC165InterfaceUnchecked(account, interfaceIds[i]);
            }
        }

        return interfaceIdsSupported;
    }

    /**
     * @dev Returns true if `account` supports all the interfaces defined in
     * `interfaceIds`. Support for {IERC165} itself is queried automatically.
     *
     * Batch-querying can lead to gas savings by skipping repeated checks for
     * {IERC165} support.
     *
     * See {IERC165-supportsInterface}.
     */
    function supportsAllInterfaces(address account, bytes4[] memory interfaceIds) internal view returns (bool) {
        // query support of ERC165 itself
        if (!supportsERC165(account)) {
            return false;
        }

        // query support of each interface in interfaceIds
        for (uint256 i = 0; i < interfaceIds.length; i++) {
            if (!supportsERC165InterfaceUnchecked(account, interfaceIds[i])) {
                return false;
            }
        }

        // all interfaces supported
        return true;
    }

    /**
     * @notice Query if a contract implements an interface, does not check ERC165 support
     * @param account The address of the contract to query for support of an interface
     * @param interfaceId The interface identifier, as specified in ERC-165
     * @return true if the contract at account indicates support of the interface with
     * identifier interfaceId, false otherwise
     * @dev Assumes that account contains a contract that supports ERC165, otherwise
     * the behavior of this method is undefined. This precondition can be checked
     * with {supportsERC165}.
     *
     * Some precompiled contracts will falsely indicate support for a given interface, so caution
     * should be exercised when using this function.
     *
     * Interface identification is specified in ERC-165.
     */
    function supportsERC165InterfaceUnchecked(address account, bytes4 interfaceId) internal view returns (bool) {
        // prepare call
        bytes memory encodedParams = abi.encodeCall(IERC165.supportsInterface, (interfaceId));

        // perform static call
        bool success;
        uint256 returnSize;
        uint256 returnValue;
        assembly {
            success := staticcall(30000, account, add(encodedParams, 0x20), mload(encodedParams), 0x00, 0x20)
            returnSize := returndatasize()
            returnValue := mload(0x00)
        }

        return success && returnSize >= 0x20 && returnValue > 0;
    }
}

abstract contract OCR2Abstract is ITypeAndVersion {
  // Maximum number of oracles the offchain reporting protocol is designed for
  uint256 internal constant MAX_NUM_ORACLES = 31;

  /// @notice triggers a new run of the offchain reporting protocol
  /// @param previousConfigBlockNumber block in which the previous config was set, to simplify historic analysis
  /// @param configDigest configDigest of this configuration
  /// @param configCount ordinal number of this config setting among all config settings over the life of this contract
  /// @param signers ith element is address ith oracle uses to sign a report
  /// @param transmitters ith element is address ith oracle uses to transmit a report via the transmit method
  /// @param f maximum number of faulty/dishonest oracles the protocol can tolerate while still working correctly
  /// @param onchainConfig serialized configuration used by the contract (and possibly oracles)
  /// @param offchainConfigVersion version of the serialization format used for "offchainConfig" parameter
  /// @param offchainConfig serialized configuration used by the oracles exclusively and only passed through the contract
  event ConfigSet(
    uint32 previousConfigBlockNumber,
    bytes32 configDigest,
    uint64 configCount,
    address[] signers,
    address[] transmitters,
    uint8 f,
    bytes onchainConfig,
    uint64 offchainConfigVersion,
    bytes offchainConfig
  );

  /// @notice sets offchain reporting protocol configuration incl. participating oracles
  /// @param signers addresses with which oracles sign the reports
  /// @param transmitters addresses oracles use to transmit the reports
  /// @param f number of faulty oracles the system can tolerate
  /// @param onchainConfig serialized configuration used by the contract (and possibly oracles)
  /// @param offchainConfigVersion version number for offchainEncoding schema
  /// @param offchainConfig serialized configuration used by the oracles exclusively and only passed through the contract
  function setOCR2Config(
    address[] memory signers,
    address[] memory transmitters,
    uint8 f,
    bytes memory onchainConfig,
    uint64 offchainConfigVersion,
    bytes memory offchainConfig
  ) external virtual;

  /// @notice information about current offchain reporting protocol configuration
  /// @return configCount ordinal number of current config, out of all configs applied to this contract so far
  /// @return blockNumber block at which this config was set
  /// @return configDigest domain-separation tag for current config (see _configDigestFromConfigData)
  function latestConfigDetails()
    external
    view
    virtual
    returns (uint32 configCount, uint32 blockNumber, bytes32 configDigest);

  function _configDigestFromConfigData(
    uint256 chainId,
    address contractAddress,
    uint64 configCount,
    address[] memory signers,
    address[] memory transmitters,
    uint8 f,
    bytes memory onchainConfig,
    uint64 offchainConfigVersion,
    bytes memory offchainConfig
  ) internal pure returns (bytes32) {
    uint256 h = uint256(
      keccak256(
        abi.encode(
          chainId,
          contractAddress,
          configCount,
          signers,
          transmitters,
          f,
          onchainConfig,
          offchainConfigVersion,
          offchainConfig
        )
      )
    );
    uint256 prefixMask = type(uint256).max << (256 - 16); // 0xFFFF00..00
    uint256 prefix = 0x0001 << (256 - 16); // 0x000100..00
    return bytes32((prefix & prefixMask) | (h & ~prefixMask));
  }

  /// @notice optionally emitted to indicate the latest configDigest and epoch for
  /// which a report was successfully transmitted. Alternatively, the contract may
  /// use latestConfigDigestAndEpoch with scanLogs set to false.
  event Transmitted(bytes32 configDigest, uint32 epoch);

  /// @notice optionally returns the latest configDigest and epoch for which a
  /// report was successfully transmitted. Alternatively, the contract may return
  /// scanLogs set to true and use Transmitted events to provide this information
  /// to offchain watchers.
  /// @return scanLogs indicates whether to rely on the configDigest and epoch
  /// returned or whether to scan logs for the Transmitted event instead.
  /// @return configDigest
  /// @return epoch
  function latestConfigDigestAndEpoch()
    external
    view
    virtual
    returns (bool scanLogs, bytes32 configDigest, uint32 epoch);

  /// @notice transmit is called to post a new report to the contract
  /// @param report serialized report, which the signatures are signing.
  /// @param rs ith element is the R components of the ith signature on report. Must have at most MAX_NUM_ORACLES entries
  /// @param ss ith element is the S components of the ith signature on report. Must have at most MAX_NUM_ORACLES entries
  /// @param rawVs ith element is the the V component of the ith signature
  function transmit(
    // NOTE: If these parameters are changed, expectedMsgDataLength and/or
    // TRANSMIT_MSGDATA_CONSTANT_LENGTH_COMPONENT need to be changed accordingly
    bytes32[3] calldata reportContext,
    bytes calldata report,
    bytes32[] calldata rs,
    bytes32[] calldata ss,
    bytes32 rawVs // signatures
  ) external virtual;
}

abstract contract OCR2BaseNoChecks is OwnerIsCreator, OCR2Abstract {
  error InvalidConfig(InvalidConfigErrorType errorType);
  error WrongMessageLength(uint256 expected, uint256 actual);
  error ConfigDigestMismatch(bytes32 expected, bytes32 actual);
  error ForkedChain(uint256 expected, uint256 actual);
  error UnauthorizedTransmitter();
  error OracleCannotBeZeroAddress();

  enum InvalidConfigErrorType {
    F_MUST_BE_POSITIVE,
    TOO_MANY_TRANSMITTERS,
    REPEATED_ORACLE_ADDRESS
  }

  // Packing these fields used on the hot path in a ConfigInfo variable reduces the
  // retrieval of all of them to a minimum number of SLOADs.
  struct ConfigInfo {
    bytes32 latestConfigDigest;
    uint8 f;
    uint8 n;
  }

  // Used for s_oracles[a].role, where a is an address, to track the purpose
  // of the address, or to indicate that the address is unset.
  enum Role {
    // No oracle role has been set for address a
    Unset,
    // Unused
    Signer,
    // Transmission address for the s_oracles[a].index'th oracle. I.e., if a
    // report is received by OCR2Aggregator.transmit in which msg.sender is
    // a, it is attributed to the s_oracles[a].index'th oracle.
    Transmitter
  }

  struct Oracle {
    uint8 index; // Index of oracle in s_transmitters
    Role role; // Role of the address which mapped to this struct
  }

  // The current config
  ConfigInfo internal s_configInfo;

  // incremented each time a new config is posted. This count is incorporated
  // into the config digest, to prevent replay attacks.
  uint32 internal s_configCount;
  // makes it easier for offchain systems to extract config from logs.
  uint32 internal s_latestConfigBlockNumber;

  // Transmitter address
  mapping(address transmitter => Oracle oracle) internal s_oracles;

  // s_transmitters contains the transmission address of each oracle,
  // i.e. the address the oracle actually sends transactions to the contract from
  address[] internal s_transmitters;

  // The constant-length components of the msg.data sent to transmit.
  // See the "If we wanted to call sam" example on for example reasoning
  // https://solidity.readthedocs.io/en/v0.7.2/abi-spec.html
  uint16 private constant TRANSMIT_MSGDATA_CONSTANT_LENGTH_COMPONENT = 4 // function selector
    + 32 * 3 // 3 words containing reportContext
    + 32 // word containing start location of abiencoded report value
    + 32 // word containing location start of abiencoded rs value
    + 32 // word containing start location of abiencoded ss value
    + 32 // rawVs value
    + 32 // word containing length of report
    + 32 // word containing length rs
    + 32; // word containing length of ss

  uint256 internal immutable i_chainID;

  // Reverts transaction if config args are invalid
  modifier checkConfigValid(uint256 numTransmitters, uint256 f) {
    if (numTransmitters > MAX_NUM_ORACLES) revert InvalidConfig(InvalidConfigErrorType.TOO_MANY_TRANSMITTERS);
    if (f == 0) revert InvalidConfig(InvalidConfigErrorType.F_MUST_BE_POSITIVE);
    _;
  }

  constructor() {
    i_chainID = block.chainid;
  }

  /// @notice sets offchain reporting protocol configuration incl. participating oracles
  /// @param signers addresses with which oracles sign the reports
  /// @param transmitters addresses oracles use to transmit the reports
  /// @param f number of faulty oracles the system can tolerate
  /// @param onchainConfig encoded on-chain contract configuration
  /// @param offchainConfigVersion version number for offchainEncoding schema
  /// @param offchainConfig encoded off-chain oracle configuration
  function setOCR2Config(
    address[] memory signers,
    address[] memory transmitters,
    uint8 f,
    bytes memory onchainConfig,
    uint64 offchainConfigVersion,
    bytes memory offchainConfig
  ) external override checkConfigValid(transmitters.length, f) onlyOwner {
    _beforeSetConfig(onchainConfig);
    // Scoped to reduce contract size
    {
      uint256 oldTransmitterLength = s_transmitters.length;
      for (uint256 i = 0; i < oldTransmitterLength; ++i) {
        delete s_oracles[s_transmitters[i]];
      }
    }
    uint256 newTransmitterLength = transmitters.length;
    for (uint256 i = 0; i < newTransmitterLength; ++i) {
      address transmitter = transmitters[i];
      if (s_oracles[transmitter].role != Role.Unset) {
        revert InvalidConfig(InvalidConfigErrorType.REPEATED_ORACLE_ADDRESS);
      }
      if (transmitter == address(0)) revert OracleCannotBeZeroAddress();
      s_oracles[transmitter] = Oracle(uint8(i), Role.Transmitter);
    }

    s_transmitters = transmitters;

    s_configInfo.f = f;
    s_configInfo.n = uint8(newTransmitterLength);
    s_configInfo.latestConfigDigest = _configDigestFromConfigData(
      block.chainid,
      address(this),
      ++s_configCount,
      signers,
      transmitters,
      f,
      onchainConfig,
      offchainConfigVersion,
      offchainConfig
    );

    uint32 previousConfigBlockNumber = s_latestConfigBlockNumber;
    s_latestConfigBlockNumber = uint32(block.number);

    emit ConfigSet(
      previousConfigBlockNumber,
      s_configInfo.latestConfigDigest,
      s_configCount,
      signers,
      transmitters,
      f,
      onchainConfig,
      offchainConfigVersion,
      offchainConfig
    );
  }

  /// @dev Hook that is run from setOCR2Config() right after validating configuration.
  /// Empty by default, please provide an implementation in a child contract if you need additional configuration processing
  function _beforeSetConfig(bytes memory _onchainConfig) internal virtual;

  /// @return list of addresses permitted to transmit reports to this contract
  /// @dev The list will match the order used to specify the transmitter during setConfig
  function getTransmitters() external view returns (address[] memory) {
    return s_transmitters;
  }

  /// @notice transmit is called to post a new report to the contract
  /// @param report serialized report, which the signatures are signing.
  /// @param rs ith element is the R components of the ith signature on report. Must have at most MAX_NUM_ORACLES entries
  /// @param ss ith element is the S components of the ith signature on report. Must have at most MAX_NUM_ORACLES entries
  function transmit(
    // NOTE: If these parameters are changed, expectedMsgDataLength and/or
    // TRANSMIT_MSGDATA_CONSTANT_LENGTH_COMPONENT need to be changed accordingly
    bytes32[3] calldata reportContext,
    bytes calldata report,
    bytes32[] calldata rs,
    bytes32[] calldata ss,
    bytes32 // signatures
  ) external override {
    _report(report);

    // reportContext consists of:
    // reportContext[0]: ConfigDigest
    // reportContext[1]: 27 byte padding, 4-byte epoch and 1-byte round
    // reportContext[2]: ExtraHash
    bytes32 configDigest = reportContext[0];
    bytes32 latestConfigDigest = s_configInfo.latestConfigDigest;
    if (latestConfigDigest != configDigest) revert ConfigDigestMismatch(latestConfigDigest, configDigest);
    _checkChainForked();

    emit Transmitted(configDigest, uint32(uint256(reportContext[1]) >> 8));

    // Scoping this reduces stack pressure and gas usage
    {
      Oracle memory transmitter = s_oracles[msg.sender];
      // Check that sender is authorized to report
      if (!(transmitter.role == Role.Transmitter && msg.sender == s_transmitters[transmitter.index])) {
        revert UnauthorizedTransmitter();
      }
    }

    uint256 expectedDataLength = uint256(TRANSMIT_MSGDATA_CONSTANT_LENGTH_COMPONENT) + report.length // one byte pure entry in _report
      + rs.length * 32 // 32 bytes per entry in _rs
      + ss.length * 32; // 32 bytes per entry in _ss)
    if (msg.data.length != expectedDataLength) revert WrongMessageLength(expectedDataLength, msg.data.length);
  }

  function _checkChainForked() internal view {
    // If the cached chainID at time of deployment doesn't match the current chainID, we reject all signed reports.
    // This avoids a (rare) scenario where chain A forks into chain A and A', A' still has configDigest
    // calculated from chain A and so OCR reports will be valid on both forks.
    if (i_chainID != block.chainid) revert ForkedChain(i_chainID, block.chainid);
  }

  /// @notice information about current offchain reporting protocol configuration
  /// @return configCount ordinal number of current config, out of all configs applied to this contract so far
  /// @return blockNumber block at which this config was set
  /// @return configDigest domain-separation tag for current config (see _configDigestFromConfigData)
  function latestConfigDetails()
    external
    view
    override
    returns (uint32 configCount, uint32 blockNumber, bytes32 configDigest)
  {
    return (s_configCount, s_latestConfigBlockNumber, s_configInfo.latestConfigDigest);
  }

  /// @inheritdoc OCR2Abstract
  function latestConfigDigestAndEpoch()
    external
    view
    virtual
    override
    returns (bool scanLogs, bytes32 configDigest, uint32 epoch)
  {
    return (true, bytes32(0), uint32(0));
  }

  function _report(bytes calldata report) internal virtual;
}

interface ITypeAndVersion {
  function typeAndVersion() external pure returns (string memory);
}

interface IOwnable {
  function owner() external returns (address);

  function transferOwnership(address recipient) external;

  function acceptOwnership() external;
}

contract ConfirmedOwnerWithProposal is IOwnable {
  address private s_owner;
  address private s_pendingOwner;

  event OwnershipTransferRequested(address indexed from, address indexed to);
  event OwnershipTransferred(address indexed from, address indexed to);

  constructor(address newOwner, address pendingOwner) {
    // solhint-disable-next-line gas-custom-errors
    require(newOwner != address(0), "Cannot set owner to zero");

    s_owner = newOwner;
    if (pendingOwner != address(0)) {
      _transferOwnership(pendingOwner);
    }
  }

  /// @notice Allows an owner to begin transferring ownership to a new address.
  function transferOwnership(address to) public override onlyOwner {
    _transferOwnership(to);
  }

  /// @notice Allows an ownership transfer to be completed by the recipient.
  function acceptOwnership() external override {
    // solhint-disable-next-line gas-custom-errors
    require(msg.sender == s_pendingOwner, "Must be proposed owner");

    address oldOwner = s_owner;
    s_owner = msg.sender;
    s_pendingOwner = address(0);

    emit OwnershipTransferred(oldOwner, msg.sender);
  }

  /// @notice Get the current owner
  function owner() public view override returns (address) {
    return s_owner;
  }

  /// @notice validate, transfer ownership, and emit relevant events
  function _transferOwnership(address to) private {
    // solhint-disable-next-line gas-custom-errors
    require(to != msg.sender, "Cannot transfer to self");

    s_pendingOwner = to;

    emit OwnershipTransferRequested(s_owner, to);
  }

  /// @notice validate access
  function _validateOwnership() internal view {
    // solhint-disable-next-line gas-custom-errors
    require(msg.sender == s_owner, "Only callable by owner");
  }

  /// @notice Reverts if called by anyone other than the contract owner.
  modifier onlyOwner() {
    _validateOwnership();
    _;
  }
}

contract ConfirmedOwner is ConfirmedOwnerWithProposal {
  constructor(address newOwner) ConfirmedOwnerWithProposal(newOwner, address(0)) {}
}

contract OwnerIsCreator is ConfirmedOwner {
  constructor() ConfirmedOwner(msg.sender) {}
}

library RateLimiter {
  error BucketOverfilled();
  error OnlyCallableByAdminOrOwner();
  error TokenMaxCapacityExceeded(uint256 capacity, uint256 requested, address tokenAddress);
  error TokenRateLimitReached(uint256 minWaitInSeconds, uint256 available, address tokenAddress);
  error AggregateValueMaxCapacityExceeded(uint256 capacity, uint256 requested);
  error AggregateValueRateLimitReached(uint256 minWaitInSeconds, uint256 available);
  error InvalidRateLimitRate(Config rateLimiterConfig);
  error DisabledNonZeroRateLimit(Config config);
  error RateLimitMustBeDisabled();

  event TokensConsumed(uint256 tokens);
  event ConfigChanged(Config config);

  struct TokenBucket {
    uint128 tokens; // ──────╮ Current number of tokens that are in the bucket.
    uint32 lastUpdated; //   │ Timestamp in seconds of the last token refill, good for 100+ years.
    bool isEnabled; // ──────╯ Indication whether the rate limiting is enabled or not
    uint128 capacity; // ────╮ Maximum number of tokens that can be in the bucket.
    uint128 rate; // ────────╯ Number of tokens per second that the bucket is refilled.
  }

  struct Config {
    bool isEnabled; // Indication whether the rate limiting should be enabled
    uint128 capacity; // ────╮ Specifies the capacity of the rate limiter
    uint128 rate; //  ───────╯ Specifies the rate of the rate limiter
  }

  /// @notice _consume removes the given tokens from the pool, lowering the
  /// rate tokens allowed to be consumed for subsequent calls.
  /// @param requestTokens The total tokens to be consumed from the bucket.
  /// @param tokenAddress The token to consume capacity for, use 0x0 to indicate aggregate value capacity.
  /// @dev Reverts when requestTokens exceeds bucket capacity or available tokens in the bucket
  /// @dev emits removal of requestTokens if requestTokens is > 0
  function _consume(TokenBucket storage s_bucket, uint256 requestTokens, address tokenAddress) internal {
    // If there is no value to remove or rate limiting is turned off, skip this step to reduce gas usage
    if (!s_bucket.isEnabled || requestTokens == 0) {
      return;
    }

    uint256 tokens = s_bucket.tokens;
    uint256 capacity = s_bucket.capacity;
    uint256 timeDiff = block.timestamp - s_bucket.lastUpdated;

    if (timeDiff != 0) {
      if (tokens > capacity) revert BucketOverfilled();

      // Refill tokens when arriving at a new block time
      tokens = _calculateRefill(capacity, tokens, timeDiff, s_bucket.rate);

      s_bucket.lastUpdated = uint32(block.timestamp);
    }

    if (capacity < requestTokens) {
      // Token address 0 indicates consuming aggregate value rate limit capacity.
      if (tokenAddress == address(0)) revert AggregateValueMaxCapacityExceeded(capacity, requestTokens);
      revert TokenMaxCapacityExceeded(capacity, requestTokens, tokenAddress);
    }
    if (tokens < requestTokens) {
      uint256 rate = s_bucket.rate;
      // Wait required until the bucket is refilled enough to accept this value, round up to next higher second
      // Consume is not guaranteed to succeed after wait time passes if there is competing traffic.
      // This acts as a lower bound of wait time.
      uint256 minWaitInSeconds = ((requestTokens - tokens) + (rate - 1)) / rate;

      if (tokenAddress == address(0)) revert AggregateValueRateLimitReached(minWaitInSeconds, tokens);
      revert TokenRateLimitReached(minWaitInSeconds, tokens, tokenAddress);
    }
    tokens -= requestTokens;

    // Downcast is safe here, as tokens is not larger than capacity
    s_bucket.tokens = uint128(tokens);
    emit TokensConsumed(requestTokens);
  }

  /// @notice Gets the token bucket with its values for the block it was requested at.
  /// @return The token bucket.
  function _currentTokenBucketState(TokenBucket memory bucket) internal view returns (TokenBucket memory) {
    // We update the bucket to reflect the status at the exact time of the
    // call. This means we might need to refill a part of the bucket based
    // on the time that has passed since the last update.
    bucket.tokens =
      uint128(_calculateRefill(bucket.capacity, bucket.tokens, block.timestamp - bucket.lastUpdated, bucket.rate));
    bucket.lastUpdated = uint32(block.timestamp);
    return bucket;
  }

  /// @notice Sets the rate limited config.
  /// @param s_bucket The token bucket
  /// @param config The new config
  function _setTokenBucketConfig(TokenBucket storage s_bucket, Config memory config) internal {
    // First update the bucket to make sure the proper rate is used for all the time
    // up until the config change.
    uint256 timeDiff = block.timestamp - s_bucket.lastUpdated;
    if (timeDiff != 0) {
      s_bucket.tokens = uint128(_calculateRefill(s_bucket.capacity, s_bucket.tokens, timeDiff, s_bucket.rate));

      s_bucket.lastUpdated = uint32(block.timestamp);
    }

    s_bucket.tokens = uint128(_min(config.capacity, s_bucket.tokens));
    s_bucket.isEnabled = config.isEnabled;
    s_bucket.capacity = config.capacity;
    s_bucket.rate = config.rate;

    emit ConfigChanged(config);
  }

  /// @notice Validates the token bucket config
  function _validateTokenBucketConfig(Config memory config, bool mustBeDisabled) internal pure {
    if (config.isEnabled) {
      if (config.rate >= config.capacity || config.rate == 0) {
        revert InvalidRateLimitRate(config);
      }
      if (mustBeDisabled) {
        revert RateLimitMustBeDisabled();
      }
    } else {
      if (config.rate != 0 || config.capacity != 0) {
        revert DisabledNonZeroRateLimit(config);
      }
    }
  }

  /// @notice Calculate refilled tokens
  /// @param capacity bucket capacity
  /// @param tokens current bucket tokens
  /// @param timeDiff block time difference since last refill
  /// @param rate bucket refill rate
  /// @return the value of tokens after refill
  function _calculateRefill(
    uint256 capacity,
    uint256 tokens,
    uint256 timeDiff,
    uint256 rate
  ) private pure returns (uint256) {
    return _min(capacity, tokens + timeDiff * rate);
  }

  /// @notice Return the smallest of two integers
  /// @param a first int
  /// @param b second int
  /// @return smallest
  function _min(uint256 a, uint256 b) internal pure returns (uint256) {
    return a < b ? a : b;
  }
}

library USDPriceWith18Decimals {
  /// @notice Takes a price in USD, with 18 decimals per 1e18 token amount,
  /// and amount of the smallest token denomination,
  /// calculates the value in USD with 18 decimals.
  /// @param tokenPrice The USD price of the token.
  /// @param tokenAmount Amount of the smallest token denomination.
  /// @return USD value with 18 decimals.
  /// @dev this function assumes that no more than 1e59 US dollar worth of token is passed in.
  /// If more is sent, this function will overflow and revert.
  /// Since there isn't even close to 1e59 dollars, this is ok for all legit tokens.
  function _calcUSDValueFromTokenAmount(uint224 tokenPrice, uint256 tokenAmount) internal pure returns (uint256) {
    /// LINK Example:
    /// tokenPrice:         8e18 -> $8/LINK, as 1e18 token amount is 1 LINK, worth 8 USD, or 8e18 with 18 decimals
    /// tokenAmount:        2e18 -> 2 LINK
    /// result:             8e18 * 2e18 / 1e18 -> 16e18 with 18 decimals = $16

    /// USDC Example:
    /// tokenPrice:         1e30 -> $1/USDC, as 1e18 token amount is 1e12 USDC, worth 1e12 USD, or 1e30 with 18 decimals
    /// tokenAmount:        5e6  -> 5 USDC
    /// result:             1e30 * 5e6 / 1e18 -> 5e18 with 18 decimals = $5
    return (tokenPrice * tokenAmount) / 1e18;
  }

  /// @notice Takes a price in USD, with 18 decimals per 1e18 token amount,
  /// and USD value with 18 decimals,
  /// calculates amount of the smallest token denomination.
  /// @param tokenPrice The USD price of the token.
  /// @param usdValue USD value with 18 decimals.
  /// @return Amount of the smallest token denomination.
  function _calcTokenAmountFromUSDValue(uint224 tokenPrice, uint256 usdValue) internal pure returns (uint256) {
    /// LINK Example:
    /// tokenPrice:          8e18 -> $8/LINK, as 1e18 token amount is 1 LINK, worth 8 USD, or 8e18 with 18 decimals
    /// usdValue:           16e18 -> $16
    /// result:             16e18 * 1e18 / 8e18 -> 2e18 = 2 LINK

    /// USDC Example:
    /// tokenPrice:         1e30 -> $1/USDC, as 1e18 token amount is 1e12 USDC, worth 1e12 USD, or 1e30 with 18 decimals
    /// usdValue:           5e18 -> $5
    /// result:             5e18 * 1e18 / 1e30 -> 5e6 = 5 USDC
    return (usdValue * 1e18) / tokenPrice;
  }
}

library Client {
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  struct EVMTokenAmount {
    address token; // token address on the local chain.
    uint256 amount; // Amount of tokens.
  }

  struct Any2EVMMessage {
    bytes32 messageId; // MessageId corresponding to ccipSend on source.
    uint64 sourceChainSelector; // Source chain selector.
    bytes sender; // abi.decode(sender) if coming from an EVM chain.
    bytes data; // payload sent in original message.
    EVMTokenAmount[] destTokenAmounts; // Tokens and their amounts in their destination chain representation.
  }

  // If extraArgs is empty bytes, the default is 200k gas limit.
  struct EVM2AnyMessage {
    bytes receiver; // abi.encode(receiver address) for dest EVM chains
    bytes data; // Data payload
    EVMTokenAmount[] tokenAmounts; // Token transfers
    address feeToken; // Address of feeToken. address(0) means you will send msg.value.
    bytes extraArgs; // Populate this with _argsToBytes(EVMExtraArgsV2)
  }

  // bytes4(keccak256("CCIP EVMExtraArgsV1"));
  bytes4 public constant EVM_EXTRA_ARGS_V1_TAG = 0x97a657c9;

  struct EVMExtraArgsV1 {
    uint256 gasLimit;
  }

  function _argsToBytes(EVMExtraArgsV1 memory extraArgs) internal pure returns (bytes memory bts) {
    return abi.encodeWithSelector(EVM_EXTRA_ARGS_V1_TAG, extraArgs);
  }

  // bytes4(keccak256("CCIP EVMExtraArgsV2"));
  bytes4 public constant EVM_EXTRA_ARGS_V2_TAG = 0x181dcf10;

  /// @param gasLimit: gas limit for the callback on the destination chain.
  /// @param allowOutOfOrderExecution: if true, it indicates that the message can be executed in any order relative to other messages from the same sender.
  /// This value's default varies by chain. On some chains, a particular value is enforced, meaning if the expected value
  /// is not set, the message request will revert.
  struct EVMExtraArgsV2 {
    uint256 gasLimit;
    bool allowOutOfOrderExecution;
  }

  function _argsToBytes(EVMExtraArgsV2 memory extraArgs) internal pure returns (bytes memory bts) {
    return abi.encodeWithSelector(EVM_EXTRA_ARGS_V2_TAG, extraArgs);
  }
}

contract AggregateRateLimiter is OwnerIsCreator {
  using RateLimiter for RateLimiter.TokenBucket;
  using USDPriceWith18Decimals for uint224;

  error PriceNotFoundForToken(address token);

  event AdminSet(address newAdmin);

  // The address of the token limit admin that has the same permissions as the owner.
  address internal s_admin;

  // The token bucket object that contains the bucket state.
  RateLimiter.TokenBucket private s_rateLimiter;

  /// @param config The RateLimiter.Config
  constructor(RateLimiter.Config memory config) {
    s_rateLimiter = RateLimiter.TokenBucket({
      rate: config.rate,
      capacity: config.capacity,
      tokens: config.capacity,
      lastUpdated: uint32(block.timestamp),
      isEnabled: config.isEnabled
    });
  }

  /// @notice Consumes value from the rate limiter bucket based on the token value given.
  function _rateLimitValue(uint256 value) internal {
    s_rateLimiter._consume(value, address(0));
  }

  function _getTokenValue(
    Client.EVMTokenAmount memory tokenAmount,
    IPriceRegistry priceRegistry
  ) internal view returns (uint256) {
    // not fetching validated price, as price staleness is not important for value-based rate limiting
    // we only need to verify the price is not 0
    uint224 pricePerToken = priceRegistry.getTokenPrice(tokenAmount.token).value;
    if (pricePerToken == 0) revert PriceNotFoundForToken(tokenAmount.token);
    return pricePerToken._calcUSDValueFromTokenAmount(tokenAmount.amount);
  }

  /// @notice Gets the token bucket with its values for the block it was requested at.
  /// @return The token bucket.
  function currentRateLimiterState() external view returns (RateLimiter.TokenBucket memory) {
    return s_rateLimiter._currentTokenBucketState();
  }

  /// @notice Sets the rate limited config.
  /// @param config The new rate limiter config.
  /// @dev should only be callable by the owner or token limit admin.
  function setRateLimiterConfig(RateLimiter.Config memory config) external onlyAdminOrOwner {
    s_rateLimiter._setTokenBucketConfig(config);
  }

  // ================================================================
  // │                           Access                             │
  // ================================================================

  /// @notice Gets the token limit admin address.
  /// @return the token limit admin address.
  function getTokenLimitAdmin() external view returns (address) {
    return s_admin;
  }

  /// @notice Sets the token limit admin address.
  /// @param newAdmin the address of the new admin.
  /// @dev setting this to address(0) indicates there is no active admin.
  function setAdmin(address newAdmin) external onlyAdminOrOwner {
    s_admin = newAdmin;
    emit AdminSet(newAdmin);
  }

  /// @notice a modifier that allows the owner or the s_tokenLimitAdmin call the functions
  /// it is applied to.
  modifier onlyAdminOrOwner() {
    if (msg.sender != owner() && msg.sender != s_admin) revert RateLimiter.OnlyCallableByAdminOrOwner();
    _;
  }
}

interface IAny2EVMOffRamp {
  /// @notice Returns the the current nonce for a receiver.
  /// @param sender The sender address
  /// @return nonce The nonce value belonging to the sender address.
  function getSenderNonce(address sender) external view returns (uint64 nonce);
}

contract EVM2EVMOffRamp is IAny2EVMOffRamp, AggregateRateLimiter, ITypeAndVersion, OCR2BaseNoChecks {
  using ERC165Checker for address;
  using EnumerableMapAddresses for EnumerableMapAddresses.AddressToAddressMap;

  error ZeroAddressNotAllowed();
  error CommitStoreAlreadyInUse();
  error ExecutionError(bytes err);
  error InvalidSourceChain(uint64 sourceChainSelector);
  error MessageTooLarge(uint256 maxSize, uint256 actualSize);
  error TokenDataMismatch(uint64 sequenceNumber);
  error UnexpectedTokenData();
  error UnsupportedNumberOfTokens(uint64 sequenceNumber);
  error ManualExecutionNotYetEnabled();
  error ManualExecutionGasLimitMismatch();
  error DestinationGasAmountCountMismatch(bytes32 messageId, uint64 sequenceNumber);
  error InvalidManualExecutionGasLimit(bytes32 messageId, uint256 oldLimit, uint256 newLimit);
  error InvalidTokenGasOverride(bytes32 messageId, uint256 tokenIndex, uint256 oldLimit, uint256 tokenGasOverride);
  error RootNotCommitted();
  error CanOnlySelfCall();
  error ReceiverError(bytes err);
  error TokenHandlingError(bytes err);
  error ReleaseOrMintBalanceMismatch(uint256 amountReleased, uint256 balancePre, uint256 balancePost);
  error EmptyReport();
  error CursedByRMN();
  error InvalidMessageId();
  error NotACompatiblePool(address notPool);
  error InvalidDataLength(uint256 expected, uint256 got);
  error InvalidNewState(uint64 sequenceNumber, Internal.MessageExecutionState newState);

  /// @dev Atlas depends on this event, if changing, please notify Atlas.
  event ConfigSet(StaticConfig staticConfig, DynamicConfig dynamicConfig);
  event SkippedIncorrectNonce(uint64 indexed nonce, address indexed sender);
  event SkippedSenderWithPreviousRampMessageInflight(uint64 indexed nonce, address indexed sender);
  /// @dev RMN depends on this event, if changing, please notify the RMN maintainers.
  event ExecutionStateChanged(
    uint64 indexed sequenceNumber, bytes32 indexed messageId, Internal.MessageExecutionState state, bytes returnData
  );
  event TokenAggregateRateLimitAdded(address sourceToken, address destToken);
  event TokenAggregateRateLimitRemoved(address sourceToken, address destToken);
  event SkippedAlreadyExecutedMessage(uint64 indexed sequenceNumber);
  event AlreadyAttempted(uint64 sequenceNumber);

  /// @notice Static offRamp config
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
  //solhint-disable gas-struct-packing
  struct StaticConfig {
    address commitStore; // ────────╮  CommitStore address on the destination chain
    uint64 chainSelector; // ───────╯  Destination chainSelector
    uint64 sourceChainSelector; // ─╮  Source chainSelector
    address onRamp; // ─────────────╯  OnRamp address on the source chain
    address prevOffRamp; //            Address of previous-version OffRamp
    address rmnProxy; //               RMN proxy address
    address tokenAdminRegistry; //     Token admin registry address
  }

  /// @notice Dynamic offRamp config
  /// @dev since OffRampConfig is part of OffRampConfigChanged event, if changing it, we should update the ABI on Atlas
  struct DynamicConfig {
    uint32 permissionLessExecutionThresholdSeconds; // ─╮ Waiting time before manual execution is enabled
    uint32 maxDataBytes; //                             │ Maximum payload data size in bytes
    uint16 maxNumberOfTokensPerMsg; //                  │ Maximum number of ERC20 token transfers that can be included per message
    address router; // ─────────────────────────────────╯ Router address
    address priceRegistry; //                             Price registry address
  }

  /// @notice RateLimitToken struct containing both the source and destination token addresses
  struct RateLimitToken {
    address sourceToken;
    address destToken;
  }

  /// @notice Gas overrides for manual exec, the number of token overrides must match the number of tokens in the msg.
  struct GasLimitOverride {
    /// @notice Overrides EVM2EVMMessage.gasLimit. A value of zero indicates no override and is valid.
    uint256 receiverExecutionGasLimit;
    /// @notice Overrides EVM2EVMMessage.sourceTokenData.destGasAmount. Must be same length as tokenAmounts. A value
    /// of zero indicates no override and is valid.
    uint32[] tokenGasOverrides;
  }

  // STATIC CONFIG
  string public constant override typeAndVersion = "EVM2EVMOffRamp 1.5.0";

  /// @dev Commit store address on the destination chain
  address internal immutable i_commitStore;
  /// @dev ChainSelector of the source chain
  uint64 internal immutable i_sourceChainSelector;
  /// @dev ChainSelector of this chain
  uint64 internal immutable i_chainSelector;
  /// @dev OnRamp address on the source chain
  address internal immutable i_onRamp;
  /// @dev metadataHash is a lane-specific prefix for a message hash preimage which ensures global uniqueness.
  /// Ensures that 2 identical messages sent to 2 different lanes will have a distinct hash.
  /// Must match the metadataHash used in computing leaf hashes offchain for the root committed in
  /// the commitStore and i_metadataHash in the onRamp.
  bytes32 internal immutable i_metadataHash;
  /// @dev The address of previous-version OffRamp for this lane.
  /// Used to be able to provide sequencing continuity during a zero downtime upgrade.
  address internal immutable i_prevOffRamp;
  /// @dev The address of the RMN proxy
  address internal immutable i_rmnProxy;
  /// @dev The address of the token admin registry
  address internal immutable i_tokenAdminRegistry;

  // DYNAMIC CONFIG
  DynamicConfig internal s_dynamicConfig;
  /// @dev Tokens that should be included in Aggregate Rate Limiting
  /// An (address => address) map is used for backwards compatability of offchain code
  EnumerableMapAddresses.AddressToAddressMap internal s_rateLimitedTokensDestToSource;

  // STATE
  /// @dev The expected nonce for a given sender.
  /// Corresponds to s_senderNonce in the OnRamp, used to enforce that messages are
  /// executed in the same order they are sent (assuming they are DON). Note that re-execution
  /// of FAILED messages however, can be out of order.
  mapping(address sender => uint64 nonce) internal s_senderNonce;
  /// @dev A mapping of sequence numbers to execution state using a bitmap with each execution
  /// state only taking up 2 bits of the uint256, packing 128 states into a single slot.
  /// Message state is tracked to ensure message can only be executed successfully once.
  mapping(uint64 seqNum => uint256 executionStateBitmap) internal s_executionStates;

  constructor(
    StaticConfig memory staticConfig,
    RateLimiter.Config memory rateLimiterConfig
  ) OCR2BaseNoChecks() AggregateRateLimiter(rateLimiterConfig) {
    if (
      staticConfig.onRamp == address(0) || staticConfig.commitStore == address(0)
        || staticConfig.tokenAdminRegistry == address(0)
    ) revert ZeroAddressNotAllowed();
    // Ensures we can never deploy a new offRamp that points to a commitStore that
    // already has roots committed.
    if (ICommitStore(staticConfig.commitStore).getExpectedNextSequenceNumber() != 1) revert CommitStoreAlreadyInUse();

    i_commitStore = staticConfig.commitStore;
    i_sourceChainSelector = staticConfig.sourceChainSelector;
    i_chainSelector = staticConfig.chainSelector;
    i_onRamp = staticConfig.onRamp;
    i_prevOffRamp = staticConfig.prevOffRamp;
    i_rmnProxy = staticConfig.rmnProxy;
    i_tokenAdminRegistry = staticConfig.tokenAdminRegistry;

    i_metadataHash = _metadataHash(Internal.EVM_2_EVM_MESSAGE_HASH);
  }

  // ================================================================
  // │                          Messaging                           │
  // ================================================================

  // The size of the execution state in bits
  uint256 private constant MESSAGE_EXECUTION_STATE_BIT_WIDTH = 2;
  // The mask for the execution state bits
  uint256 private constant MESSAGE_EXECUTION_STATE_MASK = (1 << MESSAGE_EXECUTION_STATE_BIT_WIDTH) - 1;

  /// @notice Returns the current execution state of a message based on its sequenceNumber.
  /// @param sequenceNumber The sequence number of the message to get the execution state for.
  /// @return The current execution state of the message.
  /// @dev we use the literal number 128 because using a constant increased gas usage.
  function getExecutionState(uint64 sequenceNumber) public view returns (Internal.MessageExecutionState) {
    return Internal.MessageExecutionState(
      (s_executionStates[sequenceNumber / 128] >> ((sequenceNumber % 128) * MESSAGE_EXECUTION_STATE_BIT_WIDTH))
        & MESSAGE_EXECUTION_STATE_MASK
    );
  }

  /// @notice Sets a new execution state for a given sequence number. It will overwrite any existing state.
  /// @param sequenceNumber The sequence number for which the state will be saved.
  /// @param newState The new value the state will be in after this function is called.
  /// @dev we use the literal number 128 because using a constant increased gas usage.
  function _setExecutionState(uint64 sequenceNumber, Internal.MessageExecutionState newState) internal {
    uint256 offset = (sequenceNumber % 128) * MESSAGE_EXECUTION_STATE_BIT_WIDTH;
    uint256 bitmap = s_executionStates[sequenceNumber / 128];
    // to unset any potential existing state we zero the bits of the section the state occupies,
    // then we do an AND operation to blank out any existing state for the section.
    bitmap &= ~(MESSAGE_EXECUTION_STATE_MASK << offset);
    // Set the new state
    bitmap |= uint256(newState) << offset;

    s_executionStates[sequenceNumber / 128] = bitmap;
  }

  /// @inheritdoc IAny2EVMOffRamp
  function getSenderNonce(address sender) external view returns (uint64 nonce) {
    uint256 senderNonce = s_senderNonce[sender];

    if (senderNonce == 0) {
      if (i_prevOffRamp != address(0)) {
        // If OffRamp was upgraded, check if sender has a nonce from the previous OffRamp.
        return IAny2EVMOffRamp(i_prevOffRamp).getSenderNonce(sender);
      }
    }
    return uint64(senderNonce);
  }

  /// @notice Manually execute a message.
  /// @param report Internal.ExecutionReport.
  /// @param gasLimitOverrides New gasLimit for each message in the report.
  /// @dev We permit gas limit overrides so that users may manually execute messages which failed due to
  /// insufficient gas provided.
  function manuallyExecute(
    Internal.ExecutionReport memory report,
    GasLimitOverride[] memory gasLimitOverrides
  ) external {
    // We do this here because the other _execute path is already covered OCR2BaseXXX.
    _checkChainForked();

    uint256 numMsgs = report.messages.length;
    if (numMsgs != gasLimitOverrides.length) revert ManualExecutionGasLimitMismatch();
    for (uint256 i = 0; i < numMsgs; ++i) {
      Internal.EVM2EVMMessage memory message = report.messages[i];
      GasLimitOverride memory gasLimitOverride = gasLimitOverrides[i];

      uint256 newLimit = gasLimitOverride.receiverExecutionGasLimit;
      // Checks to ensure message cannot be executed with less gas than specified.
      if (newLimit != 0) {
        if (newLimit < message.gasLimit) {
          revert InvalidManualExecutionGasLimit(message.messageId, message.gasLimit, newLimit);
        }
      }

      if (message.tokenAmounts.length != gasLimitOverride.tokenGasOverrides.length) {
        revert DestinationGasAmountCountMismatch(message.messageId, message.sequenceNumber);
      }

      bytes[] memory encodedSourceTokenData = message.sourceTokenData;

      for (uint256 j = 0; j < message.tokenAmounts.length; ++j) {
        Internal.SourceTokenData memory sourceTokenData =
          abi.decode(encodedSourceTokenData[i], (Internal.SourceTokenData));
        uint256 tokenGasOverride = gasLimitOverride.tokenGasOverrides[j];

        // The gas limit can not be lowered as that could cause the message to fail. If manual execution is done
        // from an UNTOUCHED state and we would allow lower gas limit, anyone could grief by executing the message with
        // lower gas limit than the DON would have used. This results in the message being marked FAILURE and the DON
        // would not attempt it with the correct gas limit.
        if (tokenGasOverride != 0 && tokenGasOverride < sourceTokenData.destGasAmount) {
          revert InvalidTokenGasOverride(message.messageId, j, sourceTokenData.destGasAmount, tokenGasOverride);
        }
      }
    }

    _execute(report, gasLimitOverrides);
  }

  /// @notice Entrypoint for execution, called by the OCR network
  /// @dev Expects an encoded ExecutionReport
  /// @dev Supplies no GasLimitOverrides as the DON will only execute with the original gas limits.
  function _report(bytes calldata report) internal override {
    _execute(abi.decode(report, (Internal.ExecutionReport)), new GasLimitOverride[](0));
  }

  /// @notice Executes a report, executing each message in order.
  /// @param report The execution report containing the messages and proofs.
  /// @param manualExecGasOverrides An array of gas limits to use for manual execution.
  /// @dev If called from the DON, this array is always empty.
  /// @dev If called from manual execution, this array is always same length as messages.
  function _execute(Internal.ExecutionReport memory report, GasLimitOverride[] memory manualExecGasOverrides) internal {
    if (IRMN(i_rmnProxy).isCursed(bytes16(uint128(i_sourceChainSelector)))) revert CursedByRMN();

    uint256 numMsgs = report.messages.length;
    if (numMsgs == 0) revert EmptyReport();
    if (numMsgs != report.offchainTokenData.length) revert UnexpectedTokenData();

    bytes32[] memory hashedLeaves = new bytes32[](numMsgs);

    for (uint256 i = 0; i < numMsgs; ++i) {
      Internal.EVM2EVMMessage memory message = report.messages[i];
      // We do this hash here instead of in _verifyMessages to avoid two separate loops
      // over the same data, which increases gas cost
      hashedLeaves[i] = Internal._hash(message, i_metadataHash);
      // For EVM2EVM offramps, the messageID is the leaf hash.
      // Asserting that this is true ensures we don't accidentally commit and then execute
      // a message with an unexpected hash.
      if (hashedLeaves[i] != message.messageId) revert InvalidMessageId();
    }
    bool manualExecution = manualExecGasOverrides.length != 0;

    // SECURITY CRITICAL CHECK
    uint256 timestampCommitted = ICommitStore(i_commitStore).verify(hashedLeaves, report.proofs, report.proofFlagBits);
    if (timestampCommitted == 0) revert RootNotCommitted();

    // Execute messages
    for (uint256 i = 0; i < numMsgs; ++i) {
      Internal.EVM2EVMMessage memory message = report.messages[i];
      Internal.MessageExecutionState originalState = getExecutionState(message.sequenceNumber);
      // Two valid cases here, we either have never touched this message before, or we tried to execute
      // and failed. This check protects against reentry and re-execution because the other state is
      // IN_PROGRESS which should not be allowed to execute.
      if (
        !(
          originalState == Internal.MessageExecutionState.UNTOUCHED
            || originalState == Internal.MessageExecutionState.FAILURE
        )
      ) {
        // If the message has already been executed, we skip it.  We want to not revert on race conditions between
        // executing parties. This will allow us to open up manual exec while also attempting with the DON, without
        // reverting an entire DON batch when a user manually executes while the tx is inflight.
        emit SkippedAlreadyExecutedMessage(message.sequenceNumber);
        continue;
      }
      uint32[] memory tokenGasOverrides;

      if (manualExecution) {
        tokenGasOverrides = manualExecGasOverrides[i].tokenGasOverrides;
        bool isOldCommitReport =
          (block.timestamp - timestampCommitted) > s_dynamicConfig.permissionLessExecutionThresholdSeconds;
        // Manually execution is fine if we previously failed or if the commit report is just too old
        // Acceptable state transitions: FAILURE->SUCCESS, UNTOUCHED->SUCCESS, FAILURE->FAILURE
        if (!(isOldCommitReport || originalState == Internal.MessageExecutionState.FAILURE)) {
          revert ManualExecutionNotYetEnabled();
        }

        // Manual execution gas limit can override gas limit specified in the message. Value of 0 indicates no override.
        if (manualExecGasOverrides[i].receiverExecutionGasLimit != 0) {
          message.gasLimit = manualExecGasOverrides[i].receiverExecutionGasLimit;
        }
      } else {
        // DON can only execute a message once
        // Acceptable state transitions: UNTOUCHED->SUCCESS, UNTOUCHED->FAILURE
        if (originalState != Internal.MessageExecutionState.UNTOUCHED) {
          emit AlreadyAttempted(message.sequenceNumber);
          continue;
        }
      }

      if (message.nonce != 0) {
        // In the scenario where we upgrade offRamps, we still want to have sequential nonces.
        // Referencing the old offRamp to check the expected nonce if none is set for a
        // given sender allows us to skip the current message if it would not be the next according
        // to the old offRamp. This preserves sequencing between updates.
        uint64 prevNonce = s_senderNonce[message.sender];
        if (prevNonce == 0) {
          if (i_prevOffRamp != address(0)) {
            prevNonce = IAny2EVMOffRamp(i_prevOffRamp).getSenderNonce(message.sender);
            if (prevNonce + 1 != message.nonce) {
              // the starting v2 onramp nonce, i.e. the 1st message nonce v2 offramp is expected to receive,
              // is guaranteed to equal (largest v1 onramp nonce + 1).
              // if this message's nonce isn't (v1 offramp nonce + 1), then v1 offramp nonce != largest v1 onramp nonce,
              // it tells us there are still messages inflight for v1 offramp
              emit SkippedSenderWithPreviousRampMessageInflight(message.nonce, message.sender);
              continue;
            }
            // Otherwise this nonce is indeed the "transitional nonce", that is
            // all messages sent to v1 ramp have been executed by the DON and the sequence can resume in V2.
            // Note if first time user in V2, then prevNonce will be 0, and message.nonce = 1, so this will be a no-op.
            s_senderNonce[message.sender] = prevNonce;
          }
        }

        // UNTOUCHED messages MUST be executed in order always IF message.nonce > 0.
        if (originalState == Internal.MessageExecutionState.UNTOUCHED) {
          if (prevNonce + 1 != message.nonce) {
            // We skip the message if the nonce is incorrect, since message.nonce > 0.
            emit SkippedIncorrectNonce(message.nonce, message.sender);
            continue;
          }
        }
      }

      // Although we expect only valid messages will be committed, we check again
      // when executing as a defense in depth measure.
      bytes[] memory offchainTokenData = report.offchainTokenData[i];
      _isWellFormed(
        message.sequenceNumber,
        message.sourceChainSelector,
        message.tokenAmounts.length,
        message.data.length,
        offchainTokenData.length
      );

      _setExecutionState(message.sequenceNumber, Internal.MessageExecutionState.IN_PROGRESS);
      (Internal.MessageExecutionState newState, bytes memory returnData) =
        _trialExecute(message, offchainTokenData, tokenGasOverrides);
      _setExecutionState(message.sequenceNumber, newState);

      // Since it's hard to estimate whether manual execution will succeed, we
      // revert the entire transaction if it fails. This will show the user if
      // their manual exec will fail before they submit it.
      if (manualExecution) {
        if (newState == Internal.MessageExecutionState.FAILURE) {
          if (originalState != Internal.MessageExecutionState.UNTOUCHED) {
            // If manual execution fails, we revert the entire transaction, unless the originalState is UNTOUCHED as we
            // would still be making progress by changing the state from UNTOUCHED to FAILURE.
            revert ExecutionError(returnData);
          }
        }
      }

      // The only valid prior states are UNTOUCHED and FAILURE (checked above)
      // The only valid post states are SUCCESS and FAILURE (checked below)
      if (newState != Internal.MessageExecutionState.SUCCESS) {
        if (newState != Internal.MessageExecutionState.FAILURE) {
          revert InvalidNewState(message.sequenceNumber, newState);
        }
      }

      // Nonce changes per state transition.
      // These only apply for ordered messages.
      // UNTOUCHED -> FAILURE  nonce bump
      // UNTOUCHED -> SUCCESS  nonce bump
      // FAILURE   -> FAILURE  no nonce bump
      // FAILURE   -> SUCCESS  no nonce bump
      if (message.nonce != 0) {
        if (originalState == Internal.MessageExecutionState.UNTOUCHED) {
          s_senderNonce[message.sender]++;
        }
      }

      emit ExecutionStateChanged(message.sequenceNumber, message.messageId, newState, returnData);
    }
  }

  /// @notice Does basic message validation. Should never fail.
  /// @param sequenceNumber Sequence number of the message.
  /// @param sourceChainSelector SourceChainSelector of the message.
  /// @param numberOfTokens Length of tokenAmounts array in the message.
  /// @param dataLength Length of data field in the message.
  /// @param offchainTokenDataLength Length of offchainTokenData array.
  /// @dev reverts on validation failures.
  function _isWellFormed(
    uint64 sequenceNumber,
    uint64 sourceChainSelector,
    uint256 numberOfTokens,
    uint256 dataLength,
    uint256 offchainTokenDataLength
  ) private view {
    if (sourceChainSelector != i_sourceChainSelector) revert InvalidSourceChain(sourceChainSelector);
    if (numberOfTokens > uint256(s_dynamicConfig.maxNumberOfTokensPerMsg)) {
      revert UnsupportedNumberOfTokens(sequenceNumber);
    }
    if (numberOfTokens != offchainTokenDataLength) revert TokenDataMismatch(sequenceNumber);
    if (dataLength > uint256(s_dynamicConfig.maxDataBytes)) {
      revert MessageTooLarge(uint256(s_dynamicConfig.maxDataBytes), dataLength);
    }
  }

  /// @notice Try executing a message.
  /// @param message Internal.EVM2EVMMessage memory message.
  /// @param offchainTokenData Data provided by the DON for token transfers.
  /// @return the new state of the message, being either SUCCESS or FAILURE.
  /// @return revert data in bytes if CCIP receiver reverted during execution.
  function _trialExecute(
    Internal.EVM2EVMMessage memory message,
    bytes[] memory offchainTokenData,
    uint32[] memory tokenGasOverrides
  ) internal returns (Internal.MessageExecutionState, bytes memory) {
    try this.executeSingleMessage(message, offchainTokenData, tokenGasOverrides) {}
    catch (bytes memory err) {
      // return the message execution state as FAILURE and the revert data
      // Max length of revert data is Router.MAX_RET_BYTES, max length of err is 4 + Router.MAX_RET_BYTES
      return (Internal.MessageExecutionState.FAILURE, err);
    }
    // If message execution succeeded, no CCIP receiver return data is expected, return with empty bytes.
    return (Internal.MessageExecutionState.SUCCESS, "");
  }

  /// @notice Execute a single message.
  /// @param message The message that will be executed.
  /// @param offchainTokenData Token transfer data to be passed to TokenPool.
  /// @dev We make this external and callable by the contract itself, in order to try/catch
  /// its execution and enforce atomicity among successful message processing and token transfer.
  /// @dev We use ERC-165 to check for the ccipReceive interface to permit sending tokens to contracts
  /// (for example smart contract wallets) without an associated message.
  function executeSingleMessage(
    Internal.EVM2EVMMessage calldata message,
    bytes[] calldata offchainTokenData,
    uint32[] memory tokenGasOverrides
  ) external {
    if (msg.sender != address(this)) revert CanOnlySelfCall();
    Client.EVMTokenAmount[] memory destTokenAmounts = new Client.EVMTokenAmount[](0);
    if (message.tokenAmounts.length > 0) {
      destTokenAmounts = _releaseOrMintTokens(
        message.tokenAmounts,
        abi.encode(message.sender),
        message.receiver,
        message.sourceTokenData,
        offchainTokenData,
        tokenGasOverrides
      );
    }
    // There are three cases in which we skip calling the receiver:
    // 1. If the message data is empty AND the gas limit is 0.
    //          This indicates a message that only transfers tokens. It is valid to only send tokens to a contract
    //          that supports the IAny2EVMMessageReceiver interface, but without this first check we would call the
    //          receiver without any gas, which would revert the transaction.
    // 2. If the receiver is not a contract.
    // 3. If the receiver is a contract but it does not support the IAny2EVMMessageReceiver interface.
    //
    // The ordering of these checks is important, as the first check is the cheapest to execute.
    if (
      (message.data.length == 0 && message.gasLimit == 0) || message.receiver.code.length == 0
        || !message.receiver.supportsInterface(type(IAny2EVMMessageReceiver).interfaceId)
    ) return;

    (bool success, bytes memory returnData,) = IRouter(s_dynamicConfig.router).routeMessage(
      Client.Any2EVMMessage({
        messageId: message.messageId,
        sourceChainSelector: message.sourceChainSelector,
        sender: abi.encode(message.sender),
        data: message.data,
        destTokenAmounts: destTokenAmounts
      }),
      Internal.GAS_FOR_CALL_EXACT_CHECK,
      message.gasLimit,
      message.receiver
    );
    // If CCIP receiver execution is not successful, revert the call including token transfers
    if (!success) revert ReceiverError(returnData);
  }

  /// @notice creates a unique hash to be used in message hashing.
  function _metadataHash(bytes32 prefix) internal view returns (bytes32) {
    return keccak256(abi.encode(prefix, i_sourceChainSelector, i_chainSelector, i_onRamp));
  }

  // ================================================================
  // │                           Config                             │
  // ================================================================

  /// @notice Returns the static config.
  /// @dev This function will always return the same struct as the contents is static and can never change.
  /// RMN depends on this function, if changing, please notify the RMN maintainers.
  function getStaticConfig() external view returns (StaticConfig memory) {
    return StaticConfig({
      commitStore: i_commitStore,
      chainSelector: i_chainSelector,
      sourceChainSelector: i_sourceChainSelector,
      onRamp: i_onRamp,
      prevOffRamp: i_prevOffRamp,
      rmnProxy: i_rmnProxy,
      tokenAdminRegistry: i_tokenAdminRegistry
    });
  }

  /// @notice Returns the current dynamic config.
  /// @return The current config.
  function getDynamicConfig() external view returns (DynamicConfig memory) {
    return s_dynamicConfig;
  }

  /// @notice Sets the dynamic config. This function is called during `setOCR2Config` flow
  function _beforeSetConfig(bytes memory onchainConfig) internal override {
    DynamicConfig memory dynamicConfig = abi.decode(onchainConfig, (DynamicConfig));

    if (dynamicConfig.router == address(0)) revert ZeroAddressNotAllowed();

    s_dynamicConfig = dynamicConfig;

    emit ConfigSet(
      StaticConfig({
        commitStore: i_commitStore,
        chainSelector: i_chainSelector,
        sourceChainSelector: i_sourceChainSelector,
        onRamp: i_onRamp,
        prevOffRamp: i_prevOffRamp,
        rmnProxy: i_rmnProxy,
        tokenAdminRegistry: i_tokenAdminRegistry
      }),
      dynamicConfig
    );
  }

  /// @notice Get all tokens which are included in Aggregate Rate Limiting.
  /// @return sourceTokens The source representation of the tokens that are rate limited.
  /// @return destTokens The destination representation of the tokens that are rate limited.
  /// @dev the order of IDs in the list is **not guaranteed**, therefore, if ordering matters when
  /// making successive calls, one should keep the block height constant to ensure a consistent result.
  function getAllRateLimitTokens() external view returns (address[] memory sourceTokens, address[] memory destTokens) {
    uint256 numRateLimitedTokens = s_rateLimitedTokensDestToSource.length();
    sourceTokens = new address[](numRateLimitedTokens);
    destTokens = new address[](numRateLimitedTokens);

    for (uint256 i = 0; i < numRateLimitedTokens; ++i) {
      (address destToken, address sourceToken) = s_rateLimitedTokensDestToSource.at(i);
      sourceTokens[i] = sourceToken;
      destTokens[i] = destToken;
    }
    return (sourceTokens, destTokens);
  }

  /// @notice Adds or removes tokens from being used in Aggregate Rate Limiting.
  /// @param removes - A list of one or more tokens to be removed.
  /// @param adds - A list of one or more tokens to be added.
  function updateRateLimitTokens(RateLimitToken[] memory removes, RateLimitToken[] memory adds) external onlyOwner {
    for (uint256 i = 0; i < removes.length; ++i) {
      if (s_rateLimitedTokensDestToSource.remove(removes[i].destToken)) {
        emit TokenAggregateRateLimitRemoved(removes[i].sourceToken, removes[i].destToken);
      }
    }

    for (uint256 i = 0; i < adds.length; ++i) {
      if (s_rateLimitedTokensDestToSource.set(adds[i].destToken, adds[i].sourceToken)) {
        emit TokenAggregateRateLimitAdded(adds[i].sourceToken, adds[i].destToken);
      }
    }
  }

  // ================================================================
  // │                      Tokens and pools                        │
  // ================================================================

  /// @notice Uses a pool to release or mint a token to a receiver address, with balance checks before and after the
  /// transfer. This is done to ensure the exact number of tokens the pool claims to release are actually transferred.
  /// @dev The local token address is validated through the TokenAdminRegistry. If, due to some misconfiguration, the
  /// token is unknown to the registry, the offRamp will revert. The tx, and the tokens, can be retrieved by
  /// registering the token on this chain, and re-trying the msg.
  /// @param sourceAmount The amount of tokens to be released/minted.
  /// @param originalSender The message sender on the source chain.
  /// @param receiver The address that will receive the tokens.
  /// @param sourceTokenData A struct containing the local token address, the source pool address and optional data
  /// returned from the source pool.
  /// @param offchainTokenData Data fetched offchain by the DON.
  function _releaseOrMintToken(
    uint256 sourceAmount,
    bytes memory originalSender,
    address receiver,
    Internal.SourceTokenData memory sourceTokenData,
    bytes memory offchainTokenData
  ) internal returns (Client.EVMTokenAmount memory destTokenAmount) {
    // We need to safely decode the token address from the sourceTokenData, as it could be wrong,
    // in which case it doesn't have to be a valid EVM address.
    address localToken = Internal._validateEVMAddress(sourceTokenData.destTokenAddress);
    // We check with the token admin registry if the token has a pool on this chain.
    address localPoolAddress = ITokenAdminRegistry(i_tokenAdminRegistry).getPool(localToken);
    // This will call the supportsInterface through the ERC165Checker, and not directly on the pool address.
    // This is done to prevent a pool from reverting the entire transaction if it doesn't support the interface.
    // The call gets a max or 30k gas per instance, of which there are three. This means gas estimations should
    // account for 90k gas overhead due to the interface check.
    if (localPoolAddress == address(0) || !localPoolAddress.supportsInterface(Pool.CCIP_POOL_V1)) {
      revert NotACompatiblePool(localPoolAddress);
    }

    // We retrieve the local token balance of the receiver before the pool call.
    (uint256 balancePre, uint256 gasLeft) = _getBalanceOfReceiver(receiver, localToken, sourceTokenData.destGasAmount);

    // We determined that the pool address is a valid EVM address, but that does not mean the code at this
    // address is a (compatible) pool contract. _callWithExactGasSafeReturnData will check if the location
    // contains a contract. If it doesn't it reverts with a known error, which we catch gracefully.
    // We call the pool with exact gas to increase resistance against malicious tokens or token pools.
    // We protects against return data bombs by capping the return data size at MAX_RET_BYTES.
    (bool success, bytes memory returnData, uint256 gasUsedReleaseOrMint) = CallWithExactGas
      ._callWithExactGasSafeReturnData(
      abi.encodeCall(
        IPoolV1.releaseOrMint,
        Pool.ReleaseOrMintInV1({
          originalSender: originalSender,
          receiver: receiver,
          amount: sourceAmount,
          localToken: localToken,
          remoteChainSelector: i_sourceChainSelector,
          sourcePoolAddress: sourceTokenData.sourcePoolAddress,
          sourcePoolData: sourceTokenData.extraData,
          offchainTokenData: offchainTokenData
        })
      ),
      localPoolAddress,
      gasLeft,
      Internal.GAS_FOR_CALL_EXACT_CHECK,
      Internal.MAX_RET_BYTES
    );

    // wrap and rethrow the error so we can catch it lower in the stack
    if (!success) revert TokenHandlingError(returnData);
    // If the call was successful, the returnData should contain only the local token amount.
    if (returnData.length != Pool.CCIP_POOL_V1_RET_BYTES) {
      revert InvalidDataLength(Pool.CCIP_POOL_V1_RET_BYTES, returnData.length);
    }

    uint256 localAmount = abi.decode(returnData, (uint256));
    // We don't need to do balance checks if the pool is the receiver, as they would always fail in the case
    // of a lockRelease pool.
    if (receiver != localPoolAddress) {
      (uint256 balancePost,) = _getBalanceOfReceiver(receiver, localToken, gasLeft - gasUsedReleaseOrMint);

      // First we check if the subtraction would result in an underflow to ensure we revert with a clear error
      if (balancePost < balancePre || balancePost - balancePre != localAmount) {
        revert ReleaseOrMintBalanceMismatch(localAmount, balancePre, balancePost);
      }
    }

    return Client.EVMTokenAmount({token: localToken, amount: localAmount});
  }

  function _getBalanceOfReceiver(
    address receiver,
    address token,
    uint256 gasLimit
  ) internal returns (uint256 balance, uint256 gasLeft) {
    (bool success, bytes memory returnData, uint256 gasUsed) = CallWithExactGas._callWithExactGasSafeReturnData(
      abi.encodeCall(IERC20.balanceOf, (receiver)),
      token,
      gasLimit,
      Internal.GAS_FOR_CALL_EXACT_CHECK,
      Internal.MAX_RET_BYTES
    );
    if (!success) revert TokenHandlingError(returnData);

    // If the call was successful, the returnData should contain only the balance.
    if (returnData.length != Internal.MAX_BALANCE_OF_RET_BYTES) {
      revert InvalidDataLength(Internal.MAX_BALANCE_OF_RET_BYTES, returnData.length);
    }

    // Return the decoded balance, which cannot fail as we checked the length, and the gas that is left
    // after this call.
    return (abi.decode(returnData, (uint256)), gasLimit - gasUsed);
  }

  /// @notice Uses pools to release or mint a number of different tokens to a receiver address.
  /// @param sourceTokenAmounts List of tokens and amount values to be released/minted.
  /// @param originalSender The message sender.
  /// @param receiver The address that will receive the tokens.
  /// @param encodedSourceTokenData Array of token data returned by token pools on the source chain.
  /// @param offchainTokenData Array of token data fetched offchain by the DON.
  /// @dev This function wrappes the token pool call in a try catch block to gracefully handle
  /// any non-rate limiting errors that may occur. If we encounter a rate limiting related error
  /// we bubble it up. If we encounter a non-rate limiting error we wrap it in a TokenHandlingError.
  function _releaseOrMintTokens(
    Client.EVMTokenAmount[] calldata sourceTokenAmounts,
    bytes memory originalSender,
    address receiver,
    bytes[] calldata encodedSourceTokenData,
    bytes[] calldata offchainTokenData,
    uint32[] memory tokenGasOverrides
  ) internal returns (Client.EVMTokenAmount[] memory destTokenAmounts) {
    // Creating a copy is more gas efficient than initializing a new array.
    destTokenAmounts = sourceTokenAmounts;
    uint256 value = 0;
    for (uint256 i = 0; i < sourceTokenAmounts.length; ++i) {
      Internal.SourceTokenData memory sourceTokenData =
        abi.decode(encodedSourceTokenData[i], (Internal.SourceTokenData));
      if (tokenGasOverrides.length != 0) {
        if (tokenGasOverrides[i] != 0) {
          sourceTokenData.destGasAmount = tokenGasOverrides[i];
        }
      }
      destTokenAmounts[i] = _releaseOrMintToken(
        sourceTokenAmounts[i].amount,
        originalSender,
        receiver,
        // This should never revert as the onRamp encodes the sourceTokenData struct. Only the inner components from
        // this struct come from untrusted sources.
        sourceTokenData,
        offchainTokenData[i]
      );

      if (s_rateLimitedTokensDestToSource.contains(destTokenAmounts[i].token)) {
        value += _getTokenValue(destTokenAmounts[i], IPriceRegistry(s_dynamicConfig.priceRegistry));
      }
    }

    if (value > 0) _rateLimitValue(value);

    return destTokenAmounts;
  }

  // ================================================================
  // │                            Access                            │
  // ================================================================

  /// @notice Reverts as this contract should not access CCIP messages
  function ccipReceive(Client.Any2EVMMessage calldata) external pure {
    // solhint-disable-next-line
    revert();
  }
}