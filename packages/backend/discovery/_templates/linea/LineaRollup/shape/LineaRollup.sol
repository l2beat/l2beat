// SPDX-License-Identifier: Unknown
pragma solidity 0.8.26;

interface ILineaRollup {
  /**
   * @notice Initialization data structure for the LineaRollup contract.
   * @param initialStateRootHash The initial state root hash at initialization used for proof verification.
   * @param initialL2BlockNumber The initial block number at initialization.
   * @param genesisTimestamp The L2 genesis timestamp for first initialization.
   * @param defaultVerifier The default verifier for rollup proofs.
   * @param rateLimitPeriodInSeconds The period in which withdrawal amounts and fees will be accumulated.
   * @param rateLimitAmountInWei The limit allowed for withdrawing in the rate limit period.
   * @param roleAddresses The list of role address and roles to assign permissions to.
   * @param pauseTypeRoles The list of pause types to associate with roles.
   * @param unpauseTypeRoles The list of unpause types to associate with roles.
   * @param fallbackOperator The account to be given OPERATOR_ROLE on when the time since last finalization lapses.
   * @param defaultAdmin The account to be given DEFAULT_ADMIN_ROLE on initialization.
   */
  struct InitializationData {
    bytes32 initialStateRootHash;
    uint256 initialL2BlockNumber;
    uint256 genesisTimestamp;
    address defaultVerifier;
    uint256 rateLimitPeriodInSeconds;
    uint256 rateLimitAmountInWei;
    IPermissionsManager.RoleAddress[] roleAddresses;
    IPauseManager.PauseTypeRole[] pauseTypeRoles;
    IPauseManager.PauseTypeRole[] unpauseTypeRoles;
    address fallbackOperator;
    address defaultAdmin;
  }

  /**
   * @notice Supporting data for compressed calldata submission including compressed data.
   * @dev finalStateRootHash is used to set state root at the end of the data.
   * @dev snarkHash is the computed hash for compressed data (using a SNARK-friendly hash function) that aggregates per data submission to be used in public input.
   * @dev compressedData is the compressed transaction data. It contains ordered data for each L2 block - l2Timestamps, the encoded transaction data.
   */
  struct CompressedCalldataSubmission {
    bytes32 finalStateRootHash;
    bytes32 snarkHash;
    bytes compressedData;
  }

  /**
   * @notice Shnarf data for validating a shnarf.
   * @dev parentShnarf is the parent computed shnarf.
   * @dev snarkHash is the computed hash for compressed data (using a SNARK-friendly hash function) that aggregates per data submission to be used in public input.
   * @dev finalStateRootHash is the final state root hash.
   * @dev dataEvaluationPoint is the data evaluation point.
   * @dev dataEvaluationClaim is the data evaluation claim.
   */
  struct ShnarfData {
    bytes32 parentShnarf;
    bytes32 snarkHash;
    bytes32 finalStateRootHash;
    bytes32 dataEvaluationPoint;
    bytes32 dataEvaluationClaim;
  }

  /**
   * @notice Data stucture for compressed blob data submission.
   * @dev submissionData The supporting data for blob data submission excluding the compressed data.
   * @dev dataEvaluationClaim The data evaluation claim.
   * @dev kzgCommitment The blob KZG commitment.
   * @dev kzgProof The blob KZG point proof.
   */
  struct BlobSubmission {
    uint256 dataEvaluationClaim;
    bytes kzgCommitment;
    bytes kzgProof;
    bytes32 finalStateRootHash;
    bytes32 snarkHash;
  }

  /**
   * @notice Supporting data for finalization with proof.
   * @dev NB: the dynamic sized fields are placed last on purpose for efficient keccaking on public input.
   * @dev parentStateRootHash is the expected last state root hash finalized.
   * @dev endBlockNumber is the end block finalizing until.
   * @dev shnarfData contains data about the last data submission's shnarf used in finalization.
   * @dev lastFinalizedTimestamp is the expected last finalized block's timestamp.
   * @dev finalTimestamp is the timestamp of the last block being finalized.
   * @dev lastFinalizedL1RollingHash is the last stored L2 computed rolling hash used in finalization.
   * @dev l1RollingHash is the calculated rolling hash on L2 that is expected to match L1 at l1RollingHashMessageNumber.
   * This value will be used along with the stored last finalized L2 calculated rolling hash in the public input.
   * @dev lastFinalizedL1RollingHashMessageNumber is the last stored L2 computed message number used in finalization.
   * @dev l1RollingHashMessageNumber is the calculated message number on L2 that is expected to match the existing L1 rolling hash.
   * This value will be used along with the stored last finalized L2 calculated message number in the public input.
   * @dev l2MerkleTreesDepth is the depth of all l2MerkleRoots.
   * @dev l2MerkleRoots is an array of L2 message Merkle roots of depth l2MerkleTreesDepth between last finalized block and finalSubmissionData.finalBlockNumber.
   * @dev l2MessagingBlocksOffsets indicates by offset from currentL2BlockNumber which L2 blocks contain MessageSent events.
   */
  struct FinalizationDataV3 {
    bytes32 parentStateRootHash;
    uint256 endBlockNumber;
    ShnarfData shnarfData;
    uint256 lastFinalizedTimestamp;
    uint256 finalTimestamp;
    bytes32 lastFinalizedL1RollingHash;
    bytes32 l1RollingHash;
    uint256 lastFinalizedL1RollingHashMessageNumber;
    uint256 l1RollingHashMessageNumber;
    uint256 l2MerkleTreesDepth;
    bytes32[] l2MerkleRoots;
    bytes l2MessagingBlocksOffsets;
  }

  /**
   * @notice Emitted when the LineaRollup contract version has changed.
   * @dev All bytes8 values are string based SemVer in the format M.m - e.g. "6.0".
   * @param previousVersion The previous version.
   * @param newVersion The new version.
   */
  event LineaRollupVersionChanged(bytes8 indexed previousVersion, bytes8 indexed newVersion);

  /**
   * @notice Emitted when the fallback operator role is granted.
   * @param caller The address that called the function granting the role.
   * @param fallbackOperator The fallback operator address that received the operator role.
   */
  event FallbackOperatorRoleGranted(address indexed caller, address indexed fallbackOperator);

  /**
   * @notice Emitted when the fallback operator role is set on the contract.
   * @param caller The address that set the fallback operator address.
   * @param fallbackOperator The fallback operator address.
   */
  event FallbackOperatorAddressSet(address indexed caller, address indexed fallbackOperator);

  /**
   * @notice Emitted when a verifier is set for a particular proof type.
   * @param verifierAddress The indexed new verifier address being set.
   * @param proofType The indexed proof type/index that the verifier is mapped to.
   * @param verifierSetBy The index address who set the verifier at the mapping.
   * @param oldVerifierAddress Indicates the previous address mapped to the proof type.
   * @dev The verifier will be set by an account with the VERIFIER_SETTER_ROLE. Typically the Safe.
   * @dev The oldVerifierAddress can be the zero address.
   */
  event VerifierAddressChanged(
    address indexed verifierAddress,
    uint256 indexed proofType,
    address indexed verifierSetBy,
    address oldVerifierAddress
  );

  /**
   * @notice Emitted when compressed data is being submitted and verified succesfully on L1.
   * @dev The block range is indexed and parent shnarf included for state reconstruction simplicity.
   * @param parentShnarf The parent shnarf for the data being submitted.
   * @param shnarf The indexed shnarf for the data being submitted.
   * @param finalStateRootHash The L2 state root hash that the current blob submission ends on. NB: The last blob in the collection.
   */
  event DataSubmittedV3(bytes32 parentShnarf, bytes32 indexed shnarf, bytes32 finalStateRootHash);

  /**
   * @notice Emitted when L2 blocks have been finalized on L1.
   * @param startBlockNumber The indexed L2 block number indicating which block the finalization the data starts from.
   * @param endBlockNumber The indexed L2 block number indicating which block the finalization the data ends on.
   * @param shnarf The indexed shnarf being set as currentFinalizedShnarf in the current finalization.
   * @param parentStateRootHash The parent L2 state root hash that the current finalization starts from.
   * @param finalStateRootHash The L2 state root hash that the current finalization ends on.
   */
  event DataFinalizedV3(
    uint256 indexed startBlockNumber,
    uint256 indexed endBlockNumber,
    bytes32 indexed shnarf,
    bytes32 parentStateRootHash,
    bytes32 finalStateRootHash
  );

  /**
   * @dev Thrown when the last finalization time has not lapsed when trying to grant the OPERATOR_ROLE to the fallback operator address.
   */
  error LastFinalizationTimeNotLapsed();

  /**
   * @dev Thrown when the point evaluation precompile's call return data field(s) are wrong.
   */
  error PointEvaluationResponseInvalid(uint256 fieldElements, uint256 blsCurveModulus);

  /**
   * @dev Thrown when the point evaluation precompile's call return data length is wrong.
   */
  error PrecompileReturnDataLengthWrong(uint256 expected, uint256 actual);

  /**
   * @dev Thrown when the point evaluation precompile call returns false.
   */
  error PointEvaluationFailed();

  /**
   * @dev Thrown when the blobhash at an index equals to the zero hash.
   */
  error EmptyBlobDataAtIndex(uint256 index);

  /**
   * @dev Thrown when the data for multiple blobs submission has length zero.
   */
  error BlobSubmissionDataIsMissing();

  /**
   * @dev Thrown when a blob has been submitted but there is no data for it.
   */
  error BlobSubmissionDataEmpty(uint256 emptyBlobIndex);

  /**
   * @dev Thrown when the current data was already submitted.
   */
  error DataAlreadySubmitted(bytes32 currentDataHash);

  /**
   * @dev Thrown when submissionData is empty.
   */
  error EmptySubmissionData();

  /**
   * @dev Thrown when finalizationData.l1RollingHash does not exist on L1 (Feedback loop).
   */
  error L1RollingHashDoesNotExistOnL1(uint256 messageNumber, bytes32 rollingHash);

  /**
   * @dev Thrown when finalization state does not match.
   */
  error FinalizationStateIncorrect(bytes32 expected, bytes32 value);

  /**
   * @dev Thrown when the final block number in finalization data is less than or equal to the last finalized block during finalization.
   */
  error FinalBlockNumberLessThanOrEqualToLastFinalizedBlock(uint256 finalBlockNumber, uint256 lastFinalizedBlock);

  /**
   * @dev Thrown when the final block state equals the zero hash during finalization.
   */
  error FinalBlockStateEqualsZeroHash();

  /**
   * @dev Thrown when final l2 block timestamp higher than current block.timestamp during finalization.
   */
  error FinalizationInTheFuture(uint256 l2BlockTimestamp, uint256 currentBlockTimestamp);

  /**
   * @dev Thrown when a rolling hash is provided without a corresponding message number.
   */
  error MissingMessageNumberForRollingHash(bytes32 rollingHash);

  /**
   * @dev Thrown when a message number is provided without a corresponding rolling hash.
   */
  error MissingRollingHashForMessageNumber(uint256 messageNumber);

  /**
   * @dev Thrown when the first byte is not zero.
   * @dev This is used explicitly with the four bytes in assembly 0x729eebce.
   */
  error FirstByteIsNotZero();

  /**
   * @dev Thrown when bytes length is not a multiple of 32.
   */
  error BytesLengthNotMultipleOf32();

  /**
   * @dev Thrown when the computed shnarf does not match what is expected.
   */
  error FinalShnarfWrong(bytes32 expected, bytes32 value);

  /**
   * @dev Thrown when a shnarf does not exist for a parent blob.
   */
  error ParentBlobNotSubmitted(bytes32 shnarf);

  /**
   * @dev Thrown when a shnarf does not exist for the final blob being finalized.
   */
  error FinalBlobNotSubmitted(bytes32 shnarf);

  /**
   * @dev Thrown when the fallback operator tries to renounce their operator role.
   */
  error OnlyNonFallbackOperator();

  /**
   * @notice Adds or updates the verifier contract address for a proof type.
   * @dev VERIFIER_SETTER_ROLE is required to execute.
   * @param _newVerifierAddress The address for the verifier contract.
   * @param _proofType The proof type being set/updated.
   */
  function setVerifierAddress(address _newVerifierAddress, uint256 _proofType) external;

  /**
   * @notice Sets the fallback operator role to the specified address if six months have passed since the last finalization.
   * @dev Reverts if six months have not passed since the last finalization.
   * @param _messageNumber Last finalized L1 message number as part of the feedback loop.
   * @param _rollingHash Last finalized L1 rolling hash as part of the feedback loop.
   * @param _lastFinalizedTimestamp Last finalized L2 block timestamp.
   */
  function setFallbackOperator(uint256 _messageNumber, bytes32 _rollingHash, uint256 _lastFinalizedTimestamp) external;

  /**
   * @notice Unsets the verifier contract address for a proof type.
   * @dev VERIFIER_UNSETTER_ROLE is required to execute.
   * @param _proofType The proof type being set/updated.
   */
  function unsetVerifierAddress(uint256 _proofType) external;

  /**
   * @notice Submit one or more EIP-4844 blobs.
   * @dev OPERATOR_ROLE is required to execute.
   * @dev This should be a blob carrying transaction.
   * @param _blobSubmissions The data for blob submission including proofs and required polynomials.
   * @param _parentShnarf The parent shnarf used in continuity checks as it includes the parentStateRootHash in its computation.
   * @param _finalBlobShnarf The expected final shnarf post computation of all the blob shnarfs.
   */
  function submitBlobs(
    BlobSubmission[] calldata _blobSubmissions,
    bytes32 _parentShnarf,
    bytes32 _finalBlobShnarf
  ) external;

  /**
   * @notice Submit blobs using compressed data via calldata.
   * @dev OPERATOR_ROLE is required to execute.
   * @param _submission The supporting data for compressed data submission including compressed data.
   * @param _parentShnarf The parent shnarf used in continuity checks as it includes the parentStateRootHash in its computation.
   * @param _expectedShnarf The expected shnarf post computation of all the submission.
   */
  function submitDataAsCalldata(
    CompressedCalldataSubmission calldata _submission,
    bytes32 _parentShnarf,
    bytes32 _expectedShnarf
  ) external;

  /**
   * @notice Finalize compressed blocks with proof.
   * @dev OPERATOR_ROLE is required to execute.
   * @param _aggregatedProof The aggregated proof.
   * @param _proofType The proof type.
   * @param _finalizationData The full finalization data.
   */
  function finalizeBlocks(
    bytes calldata _aggregatedProof,
    uint256 _proofType,
    FinalizationDataV3 calldata _finalizationData
  ) external;
}

interface IPermissionsManager {
  /**
   * @notice Structure defining a role and its associated address.
   * @param addressWithRole The address with the role.
   * @param role The role associated with the address.
   */
  struct RoleAddress {
    address addressWithRole;
    bytes32 role;
  }
}

abstract contract PermissionsManager is Initializable, AccessControlUpgradeable, IPermissionsManager, IGenericErrors {
  /**
   * @notice Sets permissions for a list of addresses and their roles.
   * @param _roleAddresses The list of addresses and roles to assign permissions to.
   */
  function __Permissions_init(RoleAddress[] calldata _roleAddresses) internal onlyInitializing {
    for (uint256 i; i < _roleAddresses.length; i++) {
      if (_roleAddresses[i].addressWithRole == address(0)) {
        revert ZeroAddressNotAllowed();
      }

      if (_roleAddresses[i].role == 0x0) {
        revert ZeroHashNotAllowed();
      }

      _grantRole(_roleAddresses[i].role, _roleAddresses[i].addressWithRole);
    }
  }
}

interface IL1MessageManager {
  /**
   * @notice Emitted when a new message is sent and the rolling hash updated.
   * @param messageNumber The unique indexed message number for the message.
   * @param rollingHash The indexed rolling hash computed for the current message number.
   * @param messageHash The indexed hash of the message parameters.
   */
  event RollingHashUpdated(uint256 indexed messageNumber, bytes32 indexed rollingHash, bytes32 indexed messageHash);

  /**
   * @notice Emitted when the L2 Merkle root has been anchored on L1.
   * @param l2MerkleRoot The indexed L2 Merkle root that has been anchored on L1 Ethereum.
   * @param treeDepth The indexed tree depth of the Merkle root.
   * @dev There may be more than one of these in a finalization depending on the amount of L2->L1 messages in the finalization.
   */
  event L2MerkleRootAdded(bytes32 indexed l2MerkleRoot, uint256 indexed treeDepth);

  /**
   * @notice Emitted when the L2 block contains L2 messages during finalization.
   * @param l2Block The indexed L2 block containing L2 to L1 messages.
   * @dev This is used externally in the logic for determining which messages belong to which Merkle root when claiming.
   */
  event L2MessagingBlockAnchored(uint256 indexed l2Block);

  /**
   * @dev Thrown when the message has already been claimed.
   */
  error MessageAlreadyClaimed(uint256 messageIndex);

  /**
   * @dev Thrown when the L2 Merkle root has already been anchored on L1.
   */
  error L2MerkleRootAlreadyAnchored(bytes32 merkleRoot);

  /**
   * @dev Thrown when the L2 messaging blocks offsets bytes length is not a multiple of 2.
   */
  error BytesLengthNotMultipleOfTwo(uint256 bytesLength);

  /**
   * @notice Checks if the L2->L1 message is claimed or not.
   * @param _messageNumber The message number on L2.
   * @return isClaimed Returns whether or not the message with _messageNumber has been claimed.
   */
  function isMessageClaimed(uint256 _messageNumber) external view returns (bool isClaimed);
}

library BitMaps {
    struct BitMap {
        mapping(uint256 => uint256) _data;
    }

    /**
     * @dev Returns whether the bit at `index` is set.
     */
    function get(BitMap storage bitmap, uint256 index) internal view returns (bool) {
        uint256 bucket = index >> 8;
        uint256 mask = 1 << (index & 0xff);
        return bitmap._data[bucket] & mask != 0;
    }

    /**
     * @dev Sets the bit at `index` to the boolean `value`.
     */
    function setTo(BitMap storage bitmap, uint256 index, bool value) internal {
        if (value) {
            set(bitmap, index);
        } else {
            unset(bitmap, index);
        }
    }

    /**
     * @dev Sets the bit at `index`.
     */
    function set(BitMap storage bitmap, uint256 index) internal {
        uint256 bucket = index >> 8;
        uint256 mask = 1 << (index & 0xff);
        bitmap._data[bucket] |= mask;
    }

    /**
     * @dev Unsets the bit at `index`.
     */
    function unset(BitMap storage bitmap, uint256 index) internal {
        uint256 bucket = index >> 8;
        uint256 mask = 1 << (index & 0xff);
        bitmap._data[bucket] &= ~mask;
    }
}

abstract contract L1MessageManager is L1MessageManagerV1, IL1MessageManager {
  using BitMaps for BitMaps.BitMap;
  using Utils for *;

  /// @notice Contains the L1 to L2 messaging rolling hashes mapped to message number computed on L1.
  mapping(uint256 messageNumber => bytes32 rollingHash) public rollingHashes;

  /// @notice This maps which message numbers have been claimed to prevent duplicate claiming.
  BitMaps.BitMap internal _messageClaimedBitMap;

  /// @notice Contains the L2 messages Merkle roots mapped to their tree depth.
  mapping(bytes32 merkleRoot => uint256 treeDepth) public l2MerkleRootsDepths;

  /// @dev Total contract storage is 53 slots including the gap below.
  /// @dev Keep 50 free storage slots for future implementation updates to avoid storage collision.
  uint256[50] private __gap_L1MessageManager;

  /**
   * @notice Take an existing message hash, calculates the rolling hash and stores at the message number.
   * @param _messageNumber The current message number being sent.
   * @param _messageHash The hash of the message being sent.
   */
  function _addRollingHash(uint256 _messageNumber, bytes32 _messageHash) internal {
    unchecked {
      bytes32 newRollingHash = Utils._efficientKeccak(rollingHashes[_messageNumber - 1], _messageHash);

      rollingHashes[_messageNumber] = newRollingHash;
      emit RollingHashUpdated(_messageNumber, newRollingHash, _messageHash);
    }
  }

  /**
   * @notice Set the L2->L1 message as claimed when a user claims a message on L1.
   * @param  _messageNumber The message number on L2.
   */
  function _setL2L1MessageToClaimed(uint256 _messageNumber) internal {
    if (_messageClaimedBitMap.get(_messageNumber)) {
      revert MessageAlreadyClaimed(_messageNumber);
    }
    _messageClaimedBitMap.set(_messageNumber);
  }

  /**
   * @notice Add the L2 Merkle roots to the storage.
   * @dev This function is called during block finalization.
   * @dev The _treeDepth does not need to be checked to be non-zero as it is,
   * already enforced to be non-zero in the circuit, and used in the proof's public input.
   * @param _newRoots New L2 Merkle roots.
   */
  function _addL2MerkleRoots(bytes32[] calldata _newRoots, uint256 _treeDepth) internal {
    for (uint256 i; i < _newRoots.length; ++i) {
      if (l2MerkleRootsDepths[_newRoots[i]] != 0) {
        revert L2MerkleRootAlreadyAnchored(_newRoots[i]);
      }

      l2MerkleRootsDepths[_newRoots[i]] = _treeDepth;

      emit L2MerkleRootAdded(_newRoots[i], _treeDepth);
    }
  }

  /**
   * @notice Emit an event for each L2 block containing L2->L1 messages.
   * @dev This function is called during block finalization.
   * @param _l2MessagingBlocksOffsets Is a sequence of uint16 values, where each value plus the last finalized L2 block number.
   * indicates which L2 blocks have L2->L1 messages.
   * @param _currentL2BlockNumber Last L2 block number finalized on L1.
   */
  function _anchorL2MessagingBlocks(bytes calldata _l2MessagingBlocksOffsets, uint256 _currentL2BlockNumber) internal {
    if (_l2MessagingBlocksOffsets.length % 2 != 0) {
      revert BytesLengthNotMultipleOfTwo(_l2MessagingBlocksOffsets.length);
    }

    uint256 l2BlockOffset;
    unchecked {
      for (uint256 i; i < _l2MessagingBlocksOffsets.length; ) {
        assembly {
          l2BlockOffset := shr(240, calldataload(add(_l2MessagingBlocksOffsets.offset, i)))
        }
        emit L2MessagingBlockAnchored(_currentL2BlockNumber + l2BlockOffset);
        i += 2;
      }
    }
  }

  /**
   * @notice Checks if the L2->L1 message is claimed or not.
   * @param _messageNumber The message number on L2.
   * @return isClaimed Returns whether or not the message with _messageNumber has been claimed.
   */
  function isMessageClaimed(uint256 _messageNumber) external view returns (bool isClaimed) {
    isClaimed = _messageClaimedBitMap.get(_messageNumber);
  }
}

interface IL1MessageService {
  /**
   * @param proof The Merkle proof array related to the claimed message.
   * @param messageNumber The message number of the claimed message.
   * @param leafIndex The leaf index related to the Merkle proof of the message.
   * @param from The address of the original sender.
   * @param to The address the message is intended for.
   * @param fee The fee being paid for the message delivery.
   * @param value The value to be transferred to the destination address.
   * @param feeRecipient The recipient for the fee.
   * @param merkleRoot The Merkle root of the claimed message.
   * @param data The calldata to pass to the recipient.
   */
  struct ClaimMessageWithProofParams {
    bytes32[] proof;
    uint256 messageNumber;
    uint32 leafIndex;
    address from;
    address to;
    uint256 fee;
    uint256 value;
    address payable feeRecipient;
    bytes32 merkleRoot;
    bytes data;
  }

  /**
   * @dev Thrown when L2 Merkle root does not exist.
   */
  error L2MerkleRootDoesNotExist();

  /**
   * @dev Thrown when the Merkle proof is invalid.
   */
  error InvalidMerkleProof();

  /**
   * @dev Thrown when Merkle depth doesn't match proof length.
   */
  error ProofLengthDifferentThanMerkleDepth(uint256 actual, uint256 expected);

  /**
   * @notice Claims and delivers a cross-chain message using a Merkle proof.
   * @dev if tree depth is empty, it will revert with L2MerkleRootDoesNotExist.
   * @dev if tree depth is different than proof size, it will revert with ProofLengthDifferentThanMerkleDepth.
   * @param _params Collection of claim data with proof and supporting data.
   */
  function claimMessageWithProof(ClaimMessageWithProofParams calldata _params) external;
}

interface IGenericErrors {
  /**
   * @dev Thrown when a parameter is the zero address.
   */
  error ZeroAddressNotAllowed();

  /**
   * @dev Thrown when a parameter is the zero hash.
   */
  error ZeroHashNotAllowed();

  /**
   * @dev Thrown when array lengths are mismatched.
   */
  error ArrayLengthsDoNotMatch();
}

library Utils {
  /**
   * @notice Performs a gas optimized keccak hash for two bytes32 values.
   * @param _left Left value.
   * @param _right Right value.
   */
  function _efficientKeccak(bytes32 _left, bytes32 _right) internal pure returns (bytes32 value) {
    /// @solidity memory-safe-assembly
    assembly {
      mstore(0x00, _left)
      mstore(0x20, _right)
      value := keccak256(0x00, 0x40)
    }
  }

  /**
   * @notice Performs a gas optimized keccak hash for uint256 and address.
   * @param _left Left value.
   * @param _right Right value.
   */
  function _efficientKeccak(uint256 _left, address _right) internal pure returns (bytes32 value) {
    /// @solidity memory-safe-assembly
    assembly {
      mstore(0x00, _left)
      mstore(0x20, _right)
      value := keccak256(0x00, 0x40)
    }
  }
}

library SparseMerkleTreeVerifier {
  using Utils for *;

  /**
   * @dev Value doesn't fit in a uint of `bits` size.
   * @dev This is based on OpenZeppelin's SafeCast library.
   */
  error SafeCastOverflowedUintDowncast(uint8 bits, uint256 value);

  /**
   * @dev Custom error for when the leaf index is out of bounds.
   */
  error LeafIndexOutOfBounds(uint32 leafIndex, uint32 maxAllowedIndex);

  /**
   * @notice Verify merkle proof
   * @param _leafHash Leaf hash.
   * @param _proof Sparse merkle tree proof.
   * @param _leafIndex Index of the leaf.
   * @param _root Merkle root.
   * @dev The depth of the tree is expected to be validated elsewhere beforehand.
   * @return proofIsValid Returns if the proof is valid or not.
   */
  function _verifyMerkleProof(
    bytes32 _leafHash,
    bytes32[] calldata _proof,
    uint32 _leafIndex,
    bytes32 _root
  ) internal pure returns (bool proofIsValid) {
    uint32 maxAllowedIndex = safeCastToUint32((2 ** _proof.length) - 1);

    if (_leafIndex > maxAllowedIndex) {
      revert LeafIndexOutOfBounds(_leafIndex, maxAllowedIndex);
    }

    bytes32 node = _leafHash;

    for (uint256 height; height < _proof.length; ++height) {
      if (((_leafIndex >> height) & 1) == 1) {
        node = Utils._efficientKeccak(_proof[height], node);
      } else {
        node = Utils._efficientKeccak(node, _proof[height]);
      }
    }
    proofIsValid = node == _root;
  }

  /**
   * @notice Tries to safely cast to uint32.
   * @param _value The value being cast to uint32.
   * @return castUint32 Returns a uint32 safely cast.
   * @dev This is based on OpenZeppelin's SafeCast library.
   */
  function safeCastToUint32(uint256 _value) internal pure returns (uint32 castUint32) {
    if (_value > type(uint32).max) {
      revert SafeCastOverflowedUintDowncast(32, _value);
    }
    castUint32 = uint32(_value);
  }
}

abstract contract L1MessageService is
  AccessControlUpgradeable,
  L1MessageServiceV1,
  L1MessageManager,
  IL1MessageService,
  IGenericErrors
{
  using SparseMerkleTreeVerifier for *;
  using MessageHashing for *;
  using TransientStorageHelpers for *;

  /// @dev This is currently not in use, but is reserved for future upgrades.
  uint256 public systemMigrationBlock;

  /// @dev Total contract storage is 51 slots including the gap below.
  /// @dev Keep 50 free storage slots for future implementation updates to avoid storage collision.
  uint256[50] private __gap_L1MessageService;

  /**
   * @notice Initialises underlying message service dependencies.
   * @param _rateLimitPeriod The period to rate limit against.
   * @param _rateLimitAmount The limit allowed for withdrawing the period.
   */
  function __MessageService_init(uint256 _rateLimitPeriod, uint256 _rateLimitAmount) internal onlyInitializing {
    __ERC165_init();
    __Context_init();
    __AccessControl_init();
    __RateLimiter_init(_rateLimitPeriod, _rateLimitAmount);

    nextMessageNumber = 1;
  }

  /**
   * @notice Adds a message for sending cross-chain and emits MessageSent.
   * @dev The message number is preset (nextMessageNumber) and only incremented at the end if successful for the next caller.
   * @dev This function should be called with a msg.value = _value + _fee. The fee will be paid on the destination chain.
   * @param _to The address the message is intended for.
   * @param _fee The fee being paid for the message delivery.
   * @param _calldata The calldata to pass to the recipient.
   */
  function sendMessage(
    address _to,
    uint256 _fee,
    bytes calldata _calldata
  ) external payable whenTypeAndGeneralNotPaused(PauseType.L1_L2) {
    if (_to == address(0)) {
      revert ZeroAddressNotAllowed();
    }

    if (_fee > msg.value) {
      revert ValueSentTooLow();
    }

    uint256 messageNumber = nextMessageNumber++;
    uint256 valueSent = msg.value - _fee;

    bytes32 messageHash = MessageHashing._hashMessage(msg.sender, _to, _fee, valueSent, messageNumber, _calldata);

    _addRollingHash(messageNumber, messageHash);

    emit MessageSent(msg.sender, _to, _fee, valueSent, messageNumber, _calldata, messageHash);
  }

  /**
   * @notice Claims and delivers a cross-chain message using a Merkle proof.
   * @dev if tree depth is empty, it will revert with L2MerkleRootDoesNotExist.
   * @dev if tree depth is different than proof size, it will revert with ProofLengthDifferentThanMerkleDepth.
   * @param _params Collection of claim data with proof and supporting data.
   */
  function claimMessageWithProof(
    ClaimMessageWithProofParams calldata _params
  ) external nonReentrant distributeFees(_params.fee, _params.to, _params.data, _params.feeRecipient) {
    _requireTypeAndGeneralNotPaused(PauseType.L2_L1);

    uint256 merkleDepth = l2MerkleRootsDepths[_params.merkleRoot];

    if (merkleDepth == 0) {
      revert L2MerkleRootDoesNotExist();
    }

    if (merkleDepth != _params.proof.length) {
      revert ProofLengthDifferentThanMerkleDepth(merkleDepth, _params.proof.length);
    }

    _setL2L1MessageToClaimed(_params.messageNumber);

    _addUsedAmount(_params.fee + _params.value);

    bytes32 messageLeafHash = MessageHashing._hashMessage(
      _params.from,
      _params.to,
      _params.fee,
      _params.value,
      _params.messageNumber,
      _params.data
    );
    if (
      !SparseMerkleTreeVerifier._verifyMerkleProof(
        messageLeafHash,
        _params.proof,
        _params.leafIndex,
        _params.merkleRoot
      )
    ) {
      revert InvalidMerkleProof();
    }

    TransientStorageHelpers.tstoreAddress(MESSAGE_SENDER_TRANSIENT_KEY, _params.from);

    (bool callSuccess, bytes memory returnData) = _params.to.call{ value: _params.value }(_params.data);
    if (!callSuccess) {
      if (returnData.length > 0) {
        assembly {
          let data_size := mload(returnData)
          revert(add(0x20, returnData), data_size)
        }
      } else {
        revert MessageSendingFailed(_params.to);
      }
    }

    TransientStorageHelpers.tstoreAddress(MESSAGE_SENDER_TRANSIENT_KEY, DEFAULT_MESSAGE_SENDER_TRANSIENT_VALUE);

    emit MessageClaimed(messageLeafHash);
  }

  /**
   * @notice Claims and delivers a cross-chain message.
   * @dev The message sender address is set temporarily in the transient storage when claiming.
   * @return originalSender The message sender address that is stored temporarily in the transient storage when claiming.
   */
  function sender() external view returns (address originalSender) {
    originalSender = TransientStorageHelpers.tloadAddress(MESSAGE_SENDER_TRANSIENT_KEY);
  }
}

interface IRateLimiter {
  /**
   * @notice Emitted when the Rate Limit is initialized.
   * @param periodInSeconds The time period in seconds the rate limiter has been initialized to.
   * @param limitInWei The limit in Wei the rate limiter has been initialized to.
   * @param currentPeriodEnd The time the current rate limit period will end.
   */
  event RateLimitInitialized(uint256 periodInSeconds, uint256 limitInWei, uint256 currentPeriodEnd);

  /**
   * @notice Emitted when the amount in the period is reset to zero.
   * @param resettingAddress The indexed address of who reset the used amount back to zero.
   */
  event AmountUsedInPeriodReset(address indexed resettingAddress);

  /**
   * @notice Emitted when the limit is changed.
   * @param amountChangeBy The indexed address of who changed the rate limit.
   * @param amount The rate limited amount in Wei that was set.
   * @param amountUsedLoweredToLimit Indicates if the amount used was lowered to the limit to avoid confusion.
   * @param usedAmountResetToZero Indicates if the amount used was set to zero because of the current period expiring.
   * @dev If the current used amount is higher than the new limit, the used amount is lowered to the limit.
   * @dev amountUsedLoweredToLimit and usedAmountResetToZero cannot be true at the same time.
   */
  event LimitAmountChanged(
    address indexed amountChangeBy,
    uint256 amount,
    bool amountUsedLoweredToLimit,
    bool usedAmountResetToZero
  );

  /**
   * @dev Thrown when an amount breaches the limit in the period.
   */
  error RateLimitExceeded();

  /**
   * @dev Thrown when the period is initialised to zero.
   */
  error PeriodIsZero();

  /**
   * @dev Thrown when the limit is initialised to zero.
   */
  error LimitIsZero();

  /**
   * @notice Resets the rate limit amount.
   * @dev If the used amount is higher, it is set to the limit to avoid confusion/issues.
   * @dev Only the RATE_LIMIT_SETTER_ROLE is allowed to execute this function.
   * @dev Emits the LimitAmountChanged event.
   * @dev usedLimitAmountToSet will use the default value of zero if period has expired.
   * @param _amount The amount to reset the limit to.
   */
  function resetRateLimitAmount(uint256 _amount) external;

  /**
   * @notice Resets the amount used to zero.
   * @dev Only the USED_RATE_LIMIT_RESETTER_ROLE is allowed to execute this function.
   * @dev Emits the AmountUsedInPeriodReset event.
   */
  function resetAmountUsedInPeriod() external;
}

contract RateLimiter is Initializable, IRateLimiter, AccessControlUpgradeable {
  bytes32 public constant RATE_LIMIT_SETTER_ROLE = keccak256("RATE_LIMIT_SETTER_ROLE");
  bytes32 public constant USED_RATE_LIMIT_RESETTER_ROLE = keccak256("USED_RATE_LIMIT_RESETTER_ROLE");

  uint256 public periodInSeconds; // how much time before limit resets.
  uint256 public limitInWei; // max ether to withdraw per period.

  /// @dev Public for ease of consumption.
  /// @notice The time at which the current period ends at.
  uint256 public currentPeriodEnd;

  /// @dev Public for ease of consumption.
  /// @notice Amounts already withdrawn this period.
  uint256 public currentPeriodAmountInWei;

  /// @dev Total contract storage is 14 slots with the gap below.
  /// @dev Keep 10 free storage slots for future implementation updates to avoid storage collision.
  uint256[10] private __gap;

  /**
   * @notice Initialises the limits and period for the rate limiter.
   * @param _periodInSeconds The length of the period in seconds.
   * @param _limitInWei The limit allowed in the period in Wei.
   */
  function __RateLimiter_init(uint256 _periodInSeconds, uint256 _limitInWei) internal onlyInitializing {
    if (_periodInSeconds == 0) {
      revert PeriodIsZero();
    }

    if (_limitInWei == 0) {
      revert LimitIsZero();
    }

    periodInSeconds = _periodInSeconds;
    limitInWei = _limitInWei;
    currentPeriodEnd = block.timestamp + _periodInSeconds;

    emit RateLimitInitialized(periodInSeconds, limitInWei, currentPeriodEnd);
  }

  /**
   * @notice Increments the amount used in the period.
   * @dev The amount determining logic is external to this (e.g. fees are included when calling here).
   * @dev Ignores the calculation if _usedAmount is zero.
   * @dev Reverts if the limit is breached.
   * @param _usedAmount The amount used to be added.
   */
  function _addUsedAmount(uint256 _usedAmount) internal {
    if (_usedAmount != 0) {
      if (currentPeriodEnd < block.timestamp) {
        currentPeriodEnd = block.timestamp + periodInSeconds;
      } else {
        _usedAmount += currentPeriodAmountInWei;
      }

      if (_usedAmount > limitInWei) {
        revert RateLimitExceeded();
      }

      currentPeriodAmountInWei = _usedAmount;
    }
  }

  /**
   * @notice Resets the rate limit amount.
   * @dev If the used amount is higher, it is set to the limit to avoid confusion/issues.
   * @dev Only the RATE_LIMIT_SETTER_ROLE is allowed to execute this function.
   * @dev Emits the LimitAmountChanged event.
   * @dev usedLimitAmountToSet will use the default value of zero if period has expired.
   * @param _amount The amount to reset the limit to.
   */
  function resetRateLimitAmount(uint256 _amount) external onlyRole(RATE_LIMIT_SETTER_ROLE) {
    uint256 usedLimitAmountToSet;
    bool amountUsedLoweredToLimit;
    bool usedAmountResetToZero;

    if (currentPeriodEnd < block.timestamp) {
      currentPeriodEnd = block.timestamp + periodInSeconds;
      usedAmountResetToZero = true;
    } else {
      if (_amount < currentPeriodAmountInWei) {
        usedLimitAmountToSet = _amount;
        amountUsedLoweredToLimit = true;
      }
    }

    limitInWei = _amount;

    if (usedAmountResetToZero || amountUsedLoweredToLimit) {
      currentPeriodAmountInWei = usedLimitAmountToSet;
    }

    emit LimitAmountChanged(_msgSender(), _amount, amountUsedLoweredToLimit, usedAmountResetToZero);
  }

  /**
   * @notice Resets the amount used to zero.
   * @dev Only the USED_RATE_LIMIT_RESETTER_ROLE is allowed to execute this function.
   * @dev Emits the AmountUsedInPeriodReset event.
   */
  function resetAmountUsedInPeriod() external onlyRole(USED_RATE_LIMIT_RESETTER_ROLE) {
    currentPeriodAmountInWei = 0;

    emit AmountUsedInPeriodReset(_msgSender());
  }
}

interface IL1MessageManagerV1 {
  /**
   * @dev Thrown when the message has already been claimed.
   */
  error MessageDoesNotExistOrHasAlreadyBeenClaimed(bytes32 messageHash);
}

abstract contract L1MessageManagerV1 is IL1MessageManagerV1 {
  /// @notice The 2 legacy status constants for message statuses.
  uint8 public constant INBOX_STATUS_UNKNOWN = 0;
  uint8 public constant INBOX_STATUS_RECEIVED = 1;

  /// @notice The 3 legacy status constants for message statuses.
  uint8 public constant OUTBOX_STATUS_UNKNOWN = 0;
  uint8 public constant OUTBOX_STATUS_SENT = 1;
  uint8 public constant OUTBOX_STATUS_RECEIVED = 2;

  /// @dev DEPRECATED in favor of the rollingHashes mapping on the L1MessageManager for L1 to L2 messaging.
  mapping(bytes32 messageHash => uint256 messageStatus) public outboxL1L2MessageStatus;

  /**
   * @dev Mapping to store L2->L1 message hashes status.
   * @dev messageHash => messageStatus (0: unknown, 1: received).
   * @dev For the most part this has been deprecated. This is only used for messages received pre-AlphaV2.
   */
  mapping(bytes32 messageHash => uint256 messageStatus) public inboxL2L1MessageStatus;

  /// @dev Keep free storage slots for future implementation updates to avoid storage collision.
  // *******************************************************************************************
  // NB: THIS GAP HAS BEEN PUSHED OUT IN FAVOUR OF THE GAP INSIDE THE REENTRANCY CODE
  //uint256[50] private __gap;
  // NB: DO NOT USE THIS GAP
  // *******************************************************************************************

  /// @dev Total contract storage is 2 slots.

  /**
   * @notice Update the status of L2->L1 message when a user claims a message on L1.
   * @dev The L2->L1 message is removed from storage.
   * @dev Due to the nature of the rollup, we should not get a second entry of this.
   * @param  _messageHash Hash of the message.
   */
  function _updateL2L1MessageStatusToClaimed(bytes32 _messageHash) internal {
    if (inboxL2L1MessageStatus[_messageHash] != INBOX_STATUS_RECEIVED) {
      revert MessageDoesNotExistOrHasAlreadyBeenClaimed(_messageHash);
    }

    delete inboxL2L1MessageStatus[_messageHash];
  }
}

abstract contract TransientStorageReentrancyGuardUpgradeable {
  using TransientStorageHelpers for *;

  bytes32 private constant REENTRANCY_GUARD_TRANSIENT_KEY =
    bytes32(uint256(keccak256("eip1967.reentrancy.guard.transient.key")) - 1);

  uint256 private constant NOT_ENTERED = 0;
  uint256 private constant ENTERED = 1;

  error ReentrantCall();

  /// @dev This gap is used to not shift down the storage layout after removing the OpenZeppelin ReentrancyGuardUpgradeable contract.
  uint256[50] private __gap_ReentrancyGuardUpgradeable;

  modifier nonReentrant() {
    _nonReentrantBefore();
    _;
    _nonReentrantAfter();
  }

  /**
   * @notice Checks reentrancy and if not reentrant sets the transient reentry flag.
   * @dev This uses the TransientStorageHelpers library and REENTRANCY_GUARD_TRANSIENT_KEY.
   */
  function _nonReentrantBefore() private {
    if (TransientStorageHelpers.tloadUint256(REENTRANCY_GUARD_TRANSIENT_KEY) != NOT_ENTERED) {
      revert ReentrantCall();
    }

    TransientStorageHelpers.tstoreUint256(REENTRANCY_GUARD_TRANSIENT_KEY, ENTERED);
  }

  /**
   * @notice Clears reentry transient storage flag.
   * @dev This uses the TransientStorageHelpers library and REENTRANCY_GUARD_TRANSIENT_KEY.
   */
  function _nonReentrantAfter() private {
    TransientStorageHelpers.tstoreUint256(REENTRANCY_GUARD_TRANSIENT_KEY, NOT_ENTERED);
  }
}

interface IPauseManager {
  /**
   * @notice Structure defining a pause type and its associated role.
   * @dev This struct is used for both the `_pauseTypeRoles` and `_unPauseTypeRoles` mappings.
   * @param pauseType The type of pause.
   * @param role The role associated with the pause type.
   */
  struct PauseTypeRole {
    PauseType pauseType;
    bytes32 role;
  }

  /**
   * @notice Enum defining the different types of pausing.
   * @dev The pause types are used to pause and unpause specific functionality.
   * @dev The UNUSED pause type is used as a default value to avoid accidental general pausing.
   * @dev Enums are uint8 by default.
   */
  enum PauseType {
    UNUSED,
    GENERAL,
    L1_L2,
    L2_L1,
    BLOB_SUBMISSION,
    CALLDATA_SUBMISSION,
    FINALIZATION,
    INITIATE_TOKEN_BRIDGING,
    COMPLETE_TOKEN_BRIDGING
  }

  /**
   * @notice Emitted when a pause type is paused.
   * @param messageSender The address performing the pause.
   * @param pauseType The indexed pause type that was paused.
   */
  event Paused(address messageSender, PauseType indexed pauseType);

  /**
   * @notice Emitted when a pause type is unpaused.
   * @param messageSender The address performing the unpause.
   * @param pauseType The indexed pause type that was unpaused.
   */
  event UnPaused(address messageSender, PauseType indexed pauseType);

  /**
   * @notice Emitted when a pause type and its associated role are set in the `_pauseTypeRoles` mapping.
   * @param pauseType The indexed type of pause.
   * @param role The indexed role associated with the pause type.
   */
  event PauseTypeRoleSet(PauseType indexed pauseType, bytes32 indexed role);

  /**
   * @notice Emitted when an unpause type and its associated role are set in the `_unPauseTypeRoles` mapping.
   * @param unPauseType The indexed type of unpause.
   * @param role The indexed role associated with the unpause type.
   */
  event UnPauseTypeRoleSet(PauseType indexed unPauseType, bytes32 indexed role);

  /**
   * @dev Thrown when a specific pause type is paused.
   */
  error IsPaused(PauseType pauseType);

  /**
   * @dev Thrown when a specific pause type is not paused and expected to be.
   */
  error IsNotPaused(PauseType pauseType);

  /**
   * @notice Pauses functionality by specific type.
   * @dev Requires the role mapped in pauseTypeRoles for the pauseType.
   * @param _pauseType The pause type value.
   */
  function pauseByType(PauseType _pauseType) external;

  /**
   * @notice Unpauses functionality by specific type.
   * @dev Requires the role mapped in unPauseTypeRoles for the pauseType.
   * @param _pauseType The pause type value.
   */
  function unPauseByType(PauseType _pauseType) external;

  /**
   * @notice Check if a pause type is enabled.
   * @param _pauseType The pause type value.
   * @return pauseTypeIsPaused Returns true if the pause type if paused, false otherwise.
   */
  function isPaused(PauseType _pauseType) external view returns (bool pauseTypeIsPaused);
}

abstract contract PauseManager is Initializable, IPauseManager, AccessControlUpgradeable {
  /// @notice This is used to pause all pausable functions.
  bytes32 public constant PAUSE_ALL_ROLE = keccak256("PAUSE_ALL_ROLE");

  /// @notice This is used to unpause all unpausable functions.
  bytes32 public constant UNPAUSE_ALL_ROLE = keccak256("UNPAUSE_ALL_ROLE");

  // @dev DEPRECATED. USE _pauseTypeStatusesBitMap INSTEAD
  mapping(bytes32 pauseType => bool pauseStatus) public pauseTypeStatuses;

  /// @dev The bitmap containing the pause statuses mapped by type.
  uint256 private _pauseTypeStatusesBitMap;

  /// @dev This maps the pause type to the role that is allowed to pause it.
  mapping(PauseType pauseType => bytes32 role) private _pauseTypeRoles;

  /// @dev This maps the unpause type to the role that is allowed to unpause it.
  mapping(PauseType unPauseType => bytes32 role) private _unPauseTypeRoles;

  /// @dev Total contract storage is 11 slots with the gap below.
  /// @dev Keep 7 free storage slots for future implementation updates to avoid storage collision.
  /// @dev Note: This was reduced previously to cater for new functionality.
  uint256[7] private __gap;

  /**
   * @dev Modifier to make a function callable only when the specific and general types are not paused.
   * @param _pauseType The pause type value being checked.
   * Requirements:
   *
   * - The type must not be paused.
   */
  modifier whenTypeAndGeneralNotPaused(PauseType _pauseType) {
    _requireTypeAndGeneralNotPaused(_pauseType);
    _;
  }

  /**
   * @dev Modifier to make a function callable only when the type is not paused.
   * @param _pauseType The pause type value being checked.
   * Requirements:
   *
   * - The type must not be paused.
   */
  modifier whenTypeNotPaused(PauseType _pauseType) {
    _requireTypeNotPaused(_pauseType);
    _;
  }

  /**
   * @notice Initializes the pause manager with the given pause and unpause roles.
   * @dev This function is called during contract initialization to set up the pause and unpause roles.
   * @param _pauseTypeRoleAssignments An array of PauseTypeRole structs defining the pause types and their associated roles.
   * @param _unpauseTypeRoleAssignments An array of PauseTypeRole structs defining the unpause types and their associated roles.
   */
  function __PauseManager_init(
    PauseTypeRole[] calldata _pauseTypeRoleAssignments,
    PauseTypeRole[] calldata _unpauseTypeRoleAssignments
  ) internal onlyInitializing {
    for (uint256 i; i < _pauseTypeRoleAssignments.length; i++) {
      _pauseTypeRoles[_pauseTypeRoleAssignments[i].pauseType] = _pauseTypeRoleAssignments[i].role;
      emit PauseTypeRoleSet(_pauseTypeRoleAssignments[i].pauseType, _pauseTypeRoleAssignments[i].role);
    }

    for (uint256 i; i < _unpauseTypeRoleAssignments.length; i++) {
      _unPauseTypeRoles[_unpauseTypeRoleAssignments[i].pauseType] = _unpauseTypeRoleAssignments[i].role;
      emit UnPauseTypeRoleSet(_unpauseTypeRoleAssignments[i].pauseType, _unpauseTypeRoleAssignments[i].role);
    }
  }

  /**
   * @dev Throws if the specific or general types are paused.
   * @dev Checks the specific and general pause types.
   * @param _pauseType The pause type value being checked.
   */
  function _requireTypeAndGeneralNotPaused(PauseType _pauseType) internal view virtual {
    uint256 pauseBitMap = _pauseTypeStatusesBitMap;

    if (pauseBitMap & (1 << uint256(_pauseType)) != 0) {
      revert IsPaused(_pauseType);
    }

    if (pauseBitMap & (1 << uint256(PauseType.GENERAL)) != 0) {
      revert IsPaused(PauseType.GENERAL);
    }
  }

  /**
   * @dev Throws if the type is paused.
   * @dev Checks the specific pause type.
   * @param _pauseType The pause type value being checked.
   */
  function _requireTypeNotPaused(PauseType _pauseType) internal view virtual {
    if (isPaused(_pauseType)) {
      revert IsPaused(_pauseType);
    }
  }

  /**
   * @notice Pauses functionality by specific type.
   * @dev Requires the role mapped in `_pauseTypeRoles` for the pauseType.
   * @param _pauseType The pause type value.
   */
  function pauseByType(PauseType _pauseType) external onlyRole(_pauseTypeRoles[_pauseType]) {
    if (isPaused(_pauseType)) {
      revert IsPaused(_pauseType);
    }

    _pauseTypeStatusesBitMap |= 1 << uint256(_pauseType);
    emit Paused(_msgSender(), _pauseType);
  }

  /**
   * @notice Unpauses functionality by specific type.
   * @dev Requires the role mapped in `_unPauseTypeRoles` for the pauseType.
   * @param _pauseType The pause type value.
   */
  function unPauseByType(PauseType _pauseType) external onlyRole(_unPauseTypeRoles[_pauseType]) {
    if (!isPaused(_pauseType)) {
      revert IsNotPaused(_pauseType);
    }

    _pauseTypeStatusesBitMap &= ~(1 << uint256(_pauseType));
    emit UnPaused(_msgSender(), _pauseType);
  }

  /**
   * @notice Check if a pause type is enabled.
   * @param _pauseType The pause type value.
   * @return pauseTypeIsPaused Returns true if the pause type if paused, false otherwise.
   */
  function isPaused(PauseType _pauseType) public view returns (bool pauseTypeIsPaused) {
    pauseTypeIsPaused = (_pauseTypeStatusesBitMap & (1 << uint256(_pauseType))) != 0;
  }
}

abstract contract LineaRollupPauseManager is PauseManager {
  /// @notice This is used to pause L1 to L2 communication.
  bytes32 public constant PAUSE_L1_L2_ROLE = keccak256("PAUSE_L1_L2_ROLE");

  /// @notice This is used to unpause L1 to L2 communication.
  bytes32 public constant UNPAUSE_L1_L2_ROLE = keccak256("UNPAUSE_L1_L2_ROLE");

  /// @notice This is used to pause L2 to L1 communication.
  bytes32 public constant PAUSE_L2_L1_ROLE = keccak256("PAUSE_L2_L1_ROLE");

  /// @notice This is used to unpause L2 to L1 communication.
  bytes32 public constant UNPAUSE_L2_L1_ROLE = keccak256("UNPAUSE_L2_L1_ROLE");

  /// @notice This is used to pause blob submission.
  bytes32 public constant PAUSE_BLOB_SUBMISSION_ROLE = keccak256("PAUSE_BLOB_SUBMISSION_ROLE");

  /// @notice This is used to unpause blob submission.
  bytes32 public constant UNPAUSE_BLOB_SUBMISSION_ROLE = keccak256("UNPAUSE_BLOB_SUBMISSION_ROLE");

  /// @notice This is used to pause finalization submission.
  bytes32 public constant PAUSE_FINALIZATION_ROLE = keccak256("PAUSE_FINALIZATION_ROLE");

  /// @notice This is used to unpause finalization submission.
  bytes32 public constant UNPAUSE_FINALIZATION_ROLE = keccak256("UNPAUSE_FINALIZATION_ROLE");
}

interface IMessageService {
  /**
   * @notice Emitted when a message is sent.
   * @param _from The indexed sender address of the message (msg.sender).
   * @param _to The indexed intended recipient address of the message on the other layer.
   * @param _fee The fee being being paid to deliver the message to the recipient in Wei.
   * @param _value The value being sent to the recipient in Wei.
   * @param _nonce The unique message number.
   * @param _calldata The calldata being passed to the intended recipient when being called on claiming.
   * @param _messageHash The indexed hash of the message parameters.
   * @dev _calldata has the _ because calldata is a reserved word.
   * @dev We include the message hash to save hashing costs on the rollup.
   * @dev This event is used on both L1 and L2.
   */
  event MessageSent(
    address indexed _from,
    address indexed _to,
    uint256 _fee,
    uint256 _value,
    uint256 _nonce,
    bytes _calldata,
    bytes32 indexed _messageHash
  );

  /**
   * @notice Emitted when a message is claimed.
   * @param _messageHash The indexed hash of the message that was claimed.
   */
  event MessageClaimed(bytes32 indexed _messageHash);

  /**
   * @dev Thrown when fees are lower than the minimum fee.
   */
  error FeeTooLow();

  /**
   * @dev Thrown when the value sent is less than the fee.
   * @dev Value to forward on is msg.value - _fee.
   */
  error ValueSentTooLow();

  /**
   * @dev Thrown when the destination address reverts.
   */
  error MessageSendingFailed(address destination);

  /**
   * @dev Thrown when the recipient address reverts.
   */
  error FeePaymentFailed(address recipient);

  /**
   * @notice Sends a message for transporting from the given chain.
   * @dev This function should be called with a msg.value = _value + _fee. The fee will be paid on the destination chain.
   * @param _to The destination address on the destination chain.
   * @param _fee The message service fee on the origin chain.
   * @param _calldata The calldata used by the destination message service to call the destination contract.
   */
  function sendMessage(address _to, uint256 _fee, bytes calldata _calldata) external payable;

  /**
   * @notice Deliver a message to the destination chain.
   * @notice Is called by the Postman, dApp or end user.
   * @param _from The msg.sender calling the origin message service.
   * @param _to The destination address on the destination chain.
   * @param _value The value to be transferred to the destination address.
   * @param _fee The message service fee on the origin chain.
   * @param _feeRecipient Address that will receive the fees.
   * @param _calldata The calldata used by the destination message service to call/forward to the destination contract.
   * @param _nonce Unique message number.
   */
  function claimMessage(
    address _from,
    address _to,
    uint256 _fee,
    uint256 _value,
    address payable _feeRecipient,
    bytes calldata _calldata,
    uint256 _nonce
  ) external;

  /**
   * @notice Returns the original sender of the message on the origin layer.
   * @return originalSender The original sender of the message on the origin layer.
   */
  function sender() external view returns (address originalSender);
}

library MessageHashing {
  /**
   * @notice Hashes messages using assembly for efficiency.
   * @dev Adding 0xc0 is to indicate the calldata offset relative to the memory being added to.
   * @dev If the calldata is not modulus 32, the extra bit needs to be added on at the end else the hash is wrong.
   * @param _from The from address.
   * @param _to The to address.
   * @param _fee The fee paid for delivery.
   * @param _valueSent The value to be sent when delivering.
   * @param _messageNumber The unique message number.
   * @param _calldata The calldata to be passed to the destination address.
   */
  function _hashMessage(
    address _from,
    address _to,
    uint256 _fee,
    uint256 _valueSent,
    uint256 _messageNumber,
    bytes calldata _calldata
  ) internal pure returns (bytes32 messageHash) {
    assembly {
      let mPtr := mload(0x40)
      mstore(mPtr, _from)
      mstore(add(mPtr, 0x20), _to)
      mstore(add(mPtr, 0x40), _fee)
      mstore(add(mPtr, 0x60), _valueSent)
      mstore(add(mPtr, 0x80), _messageNumber)
      mstore(add(mPtr, 0xa0), 0xc0)
      mstore(add(mPtr, 0xc0), _calldata.length)
      let rem := mod(_calldata.length, 0x20)
      let extra := 0
      if iszero(iszero(rem)) {
        extra := sub(0x20, rem)
      }

      calldatacopy(add(mPtr, 0xe0), _calldata.offset, _calldata.length)
      messageHash := keccak256(mPtr, add(0xe0, add(_calldata.length, extra)))
    }
  }
}

library TransientStorageHelpers {
  /**
   * @notice Internal function that stores a uint256 value at a given key in the EVM's transient storage using the `tstore` opcode.
   * @param _key The key in the EVM transient storage where the value should be stored.
   * @param _value The uint256 value to be stored at the specified key in the EVM transient storage.
   */
  function tstoreUint256(bytes32 _key, uint256 _value) internal {
    assembly {
      tstore(_key, _value)
    }
  }

  /**
   * @notice Internal function that retrieves a uint256 value from the EVM's transient storage using the `tload` opcode.
   * @param _key The key in the EVM transient storage from which the value should be retrieved.
   * @return value The uint256 value retrieved from the specified key in the EVM transient storage.
   */
  function tloadUint256(bytes32 _key) internal view returns (uint256 value) {
    assembly {
      value := tload(_key)
    }
  }

  /**
   * @notice Internal function that stores an address at a given key in the EVM's transient storage using the `tstore` opcode.
   * @param _key The key in the EVM transient storage where the value should be stored.
   * @param _addr The address to be stored at the specified key in the EVM transient storage.
   */
  function tstoreAddress(bytes32 _key, address _addr) internal {
    assembly {
      tstore(_key, _addr)
    }
  }

  /**
   * @notice Internal function that retrieves an address from the EVM's transient storage using the `tload` opcode.
   * @param _key The key in the EVM transient storage from which the value should be retrieved.
   * @return addr The address retrieved from the specified key in the EVM transient storage.
   */
  function tloadAddress(bytes32 _key) internal view returns (address addr) {
    assembly {
      addr := tload(_key)
    }
  }
}

abstract contract L1MessageServiceV1 is
  Initializable,
  RateLimiter,
  L1MessageManagerV1,
  TransientStorageReentrancyGuardUpgradeable,
  LineaRollupPauseManager,
  IMessageService
{
  using MessageHashing for *;

  // @dev This is initialised to save user cost with existing slot.
  uint256 public nextMessageNumber;

  /// @dev DEPRECATED in favor of new transient storage with `MESSAGE_SENDER_TRANSIENT_KEY` key.
  address internal _messageSender;

  /// @dev Total contract storage is 52 slots including the gap below.
  /// @dev Keep 50 free storage slots for future implementation updates to avoid storage collision.
  uint256[50] private __gap;

  /// @dev adding these should not affect storage as they are constants and are stored in bytecode.
  uint256 internal constant REFUND_OVERHEAD_IN_GAS = 48252;

  /// @dev The transient storage key to set the message sender against while claiming.
  bytes32 internal constant MESSAGE_SENDER_TRANSIENT_KEY =
    bytes32(uint256(keccak256("eip1967.message.sender.transient.key")) - 1);

  /// @notice The default value for the message sender reset to post claiming using the MESSAGE_SENDER_TRANSIENT_KEY.
  address internal constant DEFAULT_MESSAGE_SENDER_TRANSIENT_VALUE = address(0);

  /**
   * @notice The unspent fee is refunded if applicable.
   * @param _feeInWei The fee paid for delivery in Wei.
   * @param _to The recipient of the message and gas refund.
   * @param _calldata The calldata of the message.
   */
  modifier distributeFees(
    uint256 _feeInWei,
    address _to,
    bytes calldata _calldata,
    address _feeRecipient
  ) {
    //pre-execution
    uint256 startingGas = gasleft();
    _;
    //post-execution

    // we have a fee
    if (_feeInWei > 0) {
      // default postman fee
      uint256 deliveryFee = _feeInWei;

      // do we have empty calldata?
      if (_calldata.length == 0) {
        bool isDestinationEOA;

        assembly {
          isDestinationEOA := iszero(extcodesize(_to))
        }

        // are we calling an EOA
        if (isDestinationEOA) {
          // initial + cost to call and refund minus gasleft
          deliveryFee = (startingGas + REFUND_OVERHEAD_IN_GAS - gasleft()) * tx.gasprice;

          if (_feeInWei > deliveryFee) {
            payable(_to).send(_feeInWei - deliveryFee);
          } else {
            deliveryFee = _feeInWei;
          }
        }
      }

      address feeReceiver = _feeRecipient == address(0) ? msg.sender : _feeRecipient;

      bool callSuccess = payable(feeReceiver).send(deliveryFee);
      if (!callSuccess) {
        revert FeePaymentFailed(feeReceiver);
      }
    }
  }

  /**
   * @notice Claims and delivers a cross-chain message.
   * @dev _feeRecipient can be set to address(0) to receive as msg.sender.
   * @dev The original message sender address is temporarily set in transient storage,
   * while claiming. This address is used in sender().
   * @param _from The address of the original sender.
   * @param _to The address the message is intended for.
   * @param _fee The fee being paid for the message delivery.
   * @param _value The value to be transferred to the destination address.
   * @param _feeRecipient The recipient for the fee.
   * @param _calldata The calldata to pass to the recipient.
   * @param _nonce The unique auto generated nonce used when sending the message.
   */
  function claimMessage(
    address _from,
    address _to,
    uint256 _fee,
    uint256 _value,
    address payable _feeRecipient,
    bytes calldata _calldata,
    uint256 _nonce
  ) external nonReentrant distributeFees(_fee, _to, _calldata, _feeRecipient) {
    _requireTypeAndGeneralNotPaused(PauseType.L2_L1);

    /// @dev This is placed earlier to fix the stack issue by using these two earlier on.
    TransientStorageHelpers.tstoreAddress(MESSAGE_SENDER_TRANSIENT_KEY, _from);

    bytes32 messageHash = MessageHashing._hashMessage(_from, _to, _fee, _value, _nonce, _calldata);

    // @dev Status check and revert is in the message manager.
    _updateL2L1MessageStatusToClaimed(messageHash);

    _addUsedAmount(_fee + _value);

    (bool callSuccess, bytes memory returnData) = _to.call{ value: _value }(_calldata);
    if (!callSuccess) {
      if (returnData.length > 0) {
        assembly {
          let data_size := mload(returnData)
          revert(add(32, returnData), data_size)
        }
      } else {
        revert MessageSendingFailed(_to);
      }
    }

    TransientStorageHelpers.tstoreAddress(MESSAGE_SENDER_TRANSIENT_KEY, DEFAULT_MESSAGE_SENDER_TRANSIENT_VALUE);

    emit MessageClaimed(messageHash);
  }
}

interface IZkEvmV2 {
  /**
   * @dev Thrown when the starting rootHash does not match the existing state.
   */
  error StartingRootHashDoesNotMatch();

  /**
   * @dev Thrown when zk proof is empty bytes.
   */
  error ProofIsEmpty();

  /**
   * @dev Thrown when zk proof type is invalid.
   */
  error InvalidProofType();

  /**
   * @dev Thrown when zk proof is invalid.
   */
  error InvalidProof();

  /**
   * @dev Thrown when the call to the verifier runs out of gas or reverts internally.
   */
  error InvalidProofOrProofVerificationRanOutOfGas(string errorReason);
}

abstract contract ZkEvmV2 is Initializable, AccessControlUpgradeable, L1MessageServiceV1, IZkEvmV2 {
  uint256 internal constant MODULO_R = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

  /// @dev DEPRECATED in favor of currentFinalizedState hash.
  uint256 public currentTimestamp;

  /// @notice The most recent finalized L2 block number.
  uint256 public currentL2BlockNumber;

  /// @notice The most recent L2 state root hash mapped by block number.
  mapping(uint256 blockNumber => bytes32 stateRootHash) public stateRootHashes;

  /// @notice The verifier address to use for a proof type when proving.
  mapping(uint256 proofType => address verifierAddress) public verifiers;

  /// @dev Total contract storage is 54 slots with the gap below.
  /// @dev Keep 50 free storage slots for future implementation updates to avoid storage collision.
  uint256[50] private __gap;

  /**
   * @notice Verifies the proof with locally computed public inputs.
   * @dev If the verifier based on proof type is not found, it reverts with InvalidProofType.
   * @param _publicInput The computed public input hash cast as uint256.
   * @param _proofType The proof type to determine which verifier contract to use.
   * @param _proof The proof to be verified with the proof type verifier contract.
   */
  function _verifyProof(uint256 _publicInput, uint256 _proofType, bytes calldata _proof) internal {
    uint256[] memory publicInput = new uint256[](1);
    publicInput[0] = _publicInput;

    address verifierToUse = verifiers[_proofType];

    if (verifierToUse == address(0)) {
      revert InvalidProofType();
    }

    (bool callSuccess, bytes memory result) = verifierToUse.call(
      abi.encodeWithSelector(IPlonkVerifier.Verify.selector, _proof, publicInput)
    );

    if (!callSuccess) {
      if (result.length > 0) {
        assembly {
          let dataOffset := add(result, 0x20)

          // Store the modified first 32 bytes back into memory overwriting the location after having swapped out the selector.
          mstore(
            dataOffset,
            or(
              // InvalidProofOrProofVerificationRanOutOfGas(string) = 0xca389c44bf373a5a506ab5a7d8a53cb0ea12ba7c5872fd2bc4a0e31614c00a85.
              shl(224, 0xca389c44),
              and(mload(dataOffset), 0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff)
            )
          )

          revert(dataOffset, mload(result))
        }
      } else {
        revert InvalidProofOrProofVerificationRanOutOfGas("Unknown");
      }
    }

    bool proofSucceeded = abi.decode(result, (bool));
    if (!proofSucceeded) {
      revert InvalidProof();
    }
  }
}

abstract contract ContextUpgradeable is Initializable {
    function __Context_init() internal onlyInitializing {
    }

    function __Context_init_unchained() internal onlyInitializing {
    }
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}

interface IAccessControlUpgradeable {
    /**
     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
     *
     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
     * {RoleAdminChanged} not being emitted signaling this.
     *
     * _Available since v3.1._
     */
    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);

    /**
     * @dev Emitted when `account` is granted `role`.
     *
     * `sender` is the account that originated the contract call, an admin role
     * bearer except when using {AccessControl-_setupRole}.
     */
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);

    /**
     * @dev Emitted when `account` is revoked `role`.
     *
     * `sender` is the account that originated the contract call:
     *   - if using `revokeRole`, it is the admin role bearer
     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
     */
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) external view returns (bool);

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
     */
    function getRoleAdmin(bytes32 role) external view returns (bytes32);

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function grantRole(bytes32 role, address account) external;

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function revokeRole(bytes32 role, address account) external;

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been granted `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `account`.
     */
    function renounceRole(bytes32 role, address account) external;
}

interface IERC165Upgradeable {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

abstract contract ERC165Upgradeable is Initializable, IERC165Upgradeable {
    function __ERC165_init() internal onlyInitializing {
    }

    function __ERC165_init_unchained() internal onlyInitializing {
    }
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC165Upgradeable).interfaceId;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}

library MathUpgradeable {
    enum Rounding {
        Down, // Toward negative infinity
        Up, // Toward infinity
        Zero // Toward zero
    }

    /**
     * @dev Returns the largest of two numbers.
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow.
        return (a & b) + (a ^ b) / 2;
    }

    /**
     * @dev Returns the ceiling of the division of two numbers.
     *
     * This differs from standard division with `/` in that it rounds up instead
     * of rounding down.
     */
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b - 1) / b can overflow on addition, so we distribute.
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    /**
     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or denominator == 0
     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv)
     * with further edits by Uniswap Labs also under MIT license.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
        unchecked {
            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
            // variables such that product = prod1 * 2^256 + prod0.
            uint256 prod0; // Least significant 256 bits of the product
            uint256 prod1; // Most significant 256 bits of the product
            assembly {
                let mm := mulmod(x, y, not(0))
                prod0 := mul(x, y)
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }

            // Handle non-overflow cases, 256 by 256 division.
            if (prod1 == 0) {
                // Solidity will revert if denominator == 0, unlike the div opcode on its own.
                // The surrounding unchecked block does not change this fact.
                // See https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic.
                return prod0 / denominator;
            }

            // Make sure the result is less than 2^256. Also prevents denominator == 0.
            require(denominator > prod1, "Math: mulDiv overflow");

            ///////////////////////////////////////////////
            // 512 by 256 division.
            ///////////////////////////////////////////////

            // Make division exact by subtracting the remainder from [prod1 prod0].
            uint256 remainder;
            assembly {
                // Compute remainder using mulmod.
                remainder := mulmod(x, y, denominator)

                // Subtract 256 bit number from 512 bit number.
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }

            // Factor powers of two out of denominator and compute largest power of two divisor of denominator. Always >= 1.
            // See https://cs.stackexchange.com/q/138556/92363.

            // Does not overflow because the denominator cannot be zero at this stage in the function.
            uint256 twos = denominator & (~denominator + 1);
            assembly {
                // Divide denominator by twos.
                denominator := div(denominator, twos)

                // Divide [prod1 prod0] by twos.
                prod0 := div(prod0, twos)

                // Flip twos such that it is 2^256 / twos. If twos is zero, then it becomes one.
                twos := add(div(sub(0, twos), twos), 1)
            }

            // Shift in bits from prod1 into prod0.
            prod0 |= prod1 * twos;

            // Invert denominator mod 2^256. Now that denominator is an odd number, it has an inverse modulo 2^256 such
            // that denominator * inv = 1 mod 2^256. Compute the inverse by starting with a seed that is correct for
            // four bits. That is, denominator * inv = 1 mod 2^4.
            uint256 inverse = (3 * denominator) ^ 2;

            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also works
            // in modular arithmetic, doubling the correct bits in each step.
            inverse *= 2 - denominator * inverse; // inverse mod 2^8
            inverse *= 2 - denominator * inverse; // inverse mod 2^16
            inverse *= 2 - denominator * inverse; // inverse mod 2^32
            inverse *= 2 - denominator * inverse; // inverse mod 2^64
            inverse *= 2 - denominator * inverse; // inverse mod 2^128
            inverse *= 2 - denominator * inverse; // inverse mod 2^256

            // Because the division is now exact we can divide by multiplying with the modular inverse of denominator.
            // This will give us the correct result modulo 2^256. Since the preconditions guarantee that the outcome is
            // less than 2^256, this is the final result. We don't need to compute the high bits of the result and prod1
            // is no longer required.
            result = prod0 * inverse;
            return result;
        }
    }

    /**
     * @notice Calculates x * y / denominator with full precision, following the selected rounding direction.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
        uint256 result = mulDiv(x, y, denominator);
        if (rounding == Rounding.Up && mulmod(x, y, denominator) > 0) {
            result += 1;
        }
        return result;
    }

    /**
     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded down.
     *
     * Inspired by Henry S. Warren, Jr.'s "Hacker's Delight" (Chapter 11).
     */
    function sqrt(uint256 a) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        // For our first guess, we get the biggest power of 2 which is smaller than the square root of the target.
        //
        // We know that the "msb" (most significant bit) of our target number `a` is a power of 2 such that we have
        // `msb(a) <= a < 2*msb(a)`. This value can be written `msb(a)=2**k` with `k=log2(a)`.
        //
        // This can be rewritten `2**log2(a) <= a < 2**(log2(a) + 1)`
        // → `sqrt(2**k) <= sqrt(a) < sqrt(2**(k+1))`
        // → `2**(k/2) <= sqrt(a) < 2**((k+1)/2) <= 2**(k/2 + 1)`
        //
        // Consequently, `2**(log2(a) / 2)` is a good first approximation of `sqrt(a)` with at least 1 correct bit.
        uint256 result = 1 << (log2(a) >> 1);

        // At this point `result` is an estimation with one bit of precision. We know the true value is a uint128,
        // since it is the square root of a uint256. Newton's method converges quadratically (precision doubles at
        // every iteration). We thus need at most 7 iteration to turn our partial result with one bit of precision
        // into the expected uint128 result.
        unchecked {
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            return min(result, a / result);
        }
    }

    /**
     * @notice Calculates sqrt(a), following the selected rounding direction.
     */
    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = sqrt(a);
            return result + (rounding == Rounding.Up && result * result < a ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 2, rounded down, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 128;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 64;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 32;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 16;
            }
            if (value >> 8 > 0) {
                value >>= 8;
                result += 8;
            }
            if (value >> 4 > 0) {
                value >>= 4;
                result += 4;
            }
            if (value >> 2 > 0) {
                value >>= 2;
                result += 2;
            }
            if (value >> 1 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 2, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log2(value);
            return result + (rounding == Rounding.Up && 1 << result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 10, rounded down, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >= 10 ** 64) {
                value /= 10 ** 64;
                result += 64;
            }
            if (value >= 10 ** 32) {
                value /= 10 ** 32;
                result += 32;
            }
            if (value >= 10 ** 16) {
                value /= 10 ** 16;
                result += 16;
            }
            if (value >= 10 ** 8) {
                value /= 10 ** 8;
                result += 8;
            }
            if (value >= 10 ** 4) {
                value /= 10 ** 4;
                result += 4;
            }
            if (value >= 10 ** 2) {
                value /= 10 ** 2;
                result += 2;
            }
            if (value >= 10 ** 1) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 10, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log10(value);
            return result + (rounding == Rounding.Up && 10 ** result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 256, rounded down, of a positive value.
     * Returns 0 if given 0.
     *
     * Adding one to the result gives the number of pairs of hex symbols needed to represent `value` as a hex string.
     */
    function log256(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 16;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 8;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 4;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 2;
            }
            if (value >> 8 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 256, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log256(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log256(value);
            return result + (rounding == Rounding.Up && 1 << (result << 3) < value ? 1 : 0);
        }
    }
}

library SignedMathUpgradeable {
    /**
     * @dev Returns the largest of two signed numbers.
     */
    function max(int256 a, int256 b) internal pure returns (int256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two signed numbers.
     */
    function min(int256 a, int256 b) internal pure returns (int256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two signed numbers without overflow.
     * The result is rounded towards zero.
     */
    function average(int256 a, int256 b) internal pure returns (int256) {
        // Formula from the book "Hacker's Delight"
        int256 x = (a & b) + ((a ^ b) >> 1);
        return x + (int256(uint256(x) >> 255) & (a ^ b));
    }

    /**
     * @dev Returns the absolute unsigned value of a signed value.
     */
    function abs(int256 n) internal pure returns (uint256) {
        unchecked {
            // must be unchecked in order to support `n = type(int256).min`
            return uint256(n >= 0 ? n : -n);
        }
    }
}

library StringsUpgradeable {
    bytes16 private constant _SYMBOLS = "0123456789abcdef";
    uint8 private constant _ADDRESS_LENGTH = 20;

    /**
     * @dev Converts a `uint256` to its ASCII `string` decimal representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        unchecked {
            uint256 length = MathUpgradeable.log10(value) + 1;
            string memory buffer = new string(length);
            uint256 ptr;
            /// @solidity memory-safe-assembly
            assembly {
                ptr := add(buffer, add(32, length))
            }
            while (true) {
                ptr--;
                /// @solidity memory-safe-assembly
                assembly {
                    mstore8(ptr, byte(mod(value, 10), _SYMBOLS))
                }
                value /= 10;
                if (value == 0) break;
            }
            return buffer;
        }
    }

    /**
     * @dev Converts a `int256` to its ASCII `string` decimal representation.
     */
    function toString(int256 value) internal pure returns (string memory) {
        return string(abi.encodePacked(value < 0 ? "-" : "", toString(SignedMathUpgradeable.abs(value))));
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation.
     */
    function toHexString(uint256 value) internal pure returns (string memory) {
        unchecked {
            return toHexString(value, MathUpgradeable.log256(value) + 1);
        }
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }

    /**
     * @dev Converts an `address` with fixed length of 20 bytes to its not checksummed ASCII `string` hexadecimal representation.
     */
    function toHexString(address addr) internal pure returns (string memory) {
        return toHexString(uint256(uint160(addr)), _ADDRESS_LENGTH);
    }

    /**
     * @dev Returns true if the two strings are equal.
     */
    function equal(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }
}

abstract contract AccessControlUpgradeable is Initializable, ContextUpgradeable, IAccessControlUpgradeable, ERC165Upgradeable {
    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    mapping(bytes32 => RoleData) private _roles;

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    /**
     * @dev Modifier that checks that an account has a specific role. Reverts
     * with a standardized message including the required role.
     *
     * The format of the revert reason is given by the following regular expression:
     *
     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
     *
     * _Available since v4.1._
     */
    modifier onlyRole(bytes32 role) {
        _checkRole(role);
        _;
    }

    function __AccessControl_init() internal onlyInitializing {
    }

    function __AccessControl_init_unchained() internal onlyInitializing {
    }
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
        return _roles[role].members[account];
    }

    /**
     * @dev Revert with a standard message if `_msgSender()` is missing `role`.
     * Overriding this function changes the behavior of the {onlyRole} modifier.
     *
     * Format of the revert message is described in {_checkRole}.
     *
     * _Available since v4.6._
     */
    function _checkRole(bytes32 role) internal view virtual {
        _checkRole(role, _msgSender());
    }

    /**
     * @dev Revert with a standard message if `account` is missing `role`.
     *
     * The format of the revert reason is given by the following regular expression:
     *
     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
     */
    function _checkRole(bytes32 role, address account) internal view virtual {
        if (!hasRole(role, account)) {
            revert(
                string(
                    abi.encodePacked(
                        "AccessControl: account ",
                        StringsUpgradeable.toHexString(account),
                        " is missing role ",
                        StringsUpgradeable.toHexString(uint256(role), 32)
                    )
                )
            );
        }
    }

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {_setRoleAdmin}.
     */
    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
        return _roles[role].adminRole;
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleGranted} event.
     */
    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
        _grantRole(role, account);
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleRevoked} event.
     */
    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, account);
    }

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been revoked `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `account`.
     *
     * May emit a {RoleRevoked} event.
     */
    function renounceRole(bytes32 role, address account) public virtual override {
        require(account == _msgSender(), "AccessControl: can only renounce roles for self");

        _revokeRole(role, account);
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event. Note that unlike {grantRole}, this function doesn't perform any
     * checks on the calling account.
     *
     * May emit a {RoleGranted} event.
     *
     * [WARNING]
     * ====
     * This function should only be called from the constructor when setting
     * up the initial roles for the system.
     *
     * Using this function in any other way is effectively circumventing the admin
     * system imposed by {AccessControl}.
     * ====
     *
     * NOTE: This function is deprecated in favor of {_grantRole}.
     */
    function _setupRole(bytes32 role, address account) internal virtual {
        _grantRole(role, account);
    }

    /**
     * @dev Sets `adminRole` as ``role``'s admin role.
     *
     * Emits a {RoleAdminChanged} event.
     */
    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
        bytes32 previousAdminRole = getRoleAdmin(role);
        _roles[role].adminRole = adminRole;
        emit RoleAdminChanged(role, previousAdminRole, adminRole);
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleGranted} event.
     */
    function _grantRole(bytes32 role, address account) internal virtual {
        if (!hasRole(role, account)) {
            _roles[role].members[account] = true;
            emit RoleGranted(role, account, _msgSender());
        }
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleRevoked} event.
     */
    function _revokeRole(bytes32 role, address account) internal virtual {
        if (hasRole(role, account)) {
            _roles[role].members[account] = false;
            emit RoleRevoked(role, account, _msgSender());
        }
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}

library AddressUpgradeable {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     *
     * Furthermore, `isContract` will also return true if the target contract within
     * the same transaction is already scheduled for destruction by `SELFDESTRUCT`,
     * which only has an effect at the end of a transaction.
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.0/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
     *
     * _Available since v4.8._
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                // only check isContract if the call was successful and the return data is empty
                // otherwise we already know that it was a contract
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason or using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    function _revert(bytes memory returndata, string memory errorMessage) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert(errorMessage);
        }
    }
}

abstract contract Initializable {
    /**
     * @dev Indicates that the contract has been initialized.
     * @custom:oz-retyped-from bool
     */
    uint8 private _initialized;

    /**
     * @dev Indicates that the contract is in the process of being initialized.
     */
    bool private _initializing;

    /**
     * @dev Triggered when the contract has been initialized or reinitialized.
     */
    event Initialized(uint8 version);

    /**
     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
     * `onlyInitializing` functions can be used to initialize parent contracts.
     *
     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
     * constructor.
     *
     * Emits an {Initialized} event.
     */
    modifier initializer() {
        bool isTopLevelCall = !_initializing;
        require(
            (isTopLevelCall && _initialized < 1) || (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
            "Initializable: contract is already initialized"
        );
        _initialized = 1;
        if (isTopLevelCall) {
            _initializing = true;
        }
        _;
        if (isTopLevelCall) {
            _initializing = false;
            emit Initialized(1);
        }
    }

    /**
     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
     * used to initialize parent contracts.
     *
     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
     * are added through upgrades and that require initialization.
     *
     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
     * cannot be nested. If one is invoked in the context of another, execution will revert.
     *
     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
     * a contract, executing them in the right order is up to the developer or operator.
     *
     * WARNING: setting the version to 255 will prevent any future reinitialization.
     *
     * Emits an {Initialized} event.
     */
    modifier reinitializer(uint8 version) {
        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
        _initialized = version;
        _initializing = true;
        _;
        _initializing = false;
        emit Initialized(version);
    }

    /**
     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
     * {initializer} and {reinitializer} modifiers, directly or indirectly.
     */
    modifier onlyInitializing() {
        require(_initializing, "Initializable: contract is not initializing");
        _;
    }

    /**
     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
     * through proxies.
     *
     * Emits an {Initialized} event the first time it is successfully executed.
     */
    function _disableInitializers() internal virtual {
        require(!_initializing, "Initializable: contract is initializing");
        if (_initialized != type(uint8).max) {
            _initialized = type(uint8).max;
            emit Initialized(type(uint8).max);
        }
    }

    /**
     * @dev Returns the highest version that has been initialized. See {reinitializer}.
     */
    function _getInitializedVersion() internal view returns (uint8) {
        return _initialized;
    }

    /**
     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
     */
    function _isInitializing() internal view returns (bool) {
        return _initializing;
    }
}

contract LineaRollup is
  Initializable,
  AccessControlUpgradeable,
  ZkEvmV2,
  L1MessageService,
  PermissionsManager,
  ILineaRollup
{
  using Utils for *;

  /// @notice This is the ABI version and not the reinitialize version.
  string public constant CONTRACT_VERSION = "6.0";

  /// @notice The role required to set/add  proof verifiers by type.
  bytes32 public constant VERIFIER_SETTER_ROLE = keccak256("VERIFIER_SETTER_ROLE");

  /// @notice The role required to set/remove  proof verifiers by type.
  bytes32 public constant VERIFIER_UNSETTER_ROLE = keccak256("VERIFIER_UNSETTER_ROLE");

  /// @notice The default genesis shnarf using empty/default hashes and a default state.
  bytes32 public constant GENESIS_SHNARF =
    keccak256(
      abi.encode(
        EMPTY_HASH,
        EMPTY_HASH,
        0x072ead6777750dc20232d1cee8dc9a395c2d350df4bbaa5096c6f59b214dcecd,
        EMPTY_HASH,
        EMPTY_HASH
      )
    );

  /// @dev Value indicating a shnarf exists.
  uint256 internal constant SHNARF_EXISTS_DEFAULT_VALUE = 1;

  /// @dev The default hash value.
  bytes32 internal constant EMPTY_HASH = 0x0;

  /// @dev The BLS Curve modulus value used.
  uint256 internal constant BLS_CURVE_MODULUS =
    52435875175126190479447740508185965837690552500527637822603658699938581184513;

  /// @dev The well-known precompile address for point evaluation.
  address internal constant POINT_EVALUATION_PRECOMPILE_ADDRESS = address(0x0a);

  /// @dev The expected point evaluation return data length.
  uint256 internal constant POINT_EVALUATION_RETURN_DATA_LENGTH = 64;

  /// @dev The expected point evaluation field element length returned.
  uint256 internal constant POINT_EVALUATION_FIELD_ELEMENTS_LENGTH = 4096;

  /// @dev In practice, when used, this is expected to be a close approximation to 6 months, and is intentional.
  uint256 internal constant SIX_MONTHS_IN_SECONDS = (365 / 2) * 24 * 60 * 60;

  /// @dev DEPRECATED in favor of the single blobShnarfExists mapping.
  mapping(bytes32 dataHash => bytes32 finalStateRootHash) public dataFinalStateRootHashes;
  /// @dev DEPRECATED in favor of the single blobShnarfExists mapping.
  mapping(bytes32 dataHash => bytes32 parentHash) public dataParents;
  /// @dev DEPRECATED in favor of the single blobShnarfExists mapping.
  mapping(bytes32 dataHash => bytes32 shnarfHash) public dataShnarfHashes;
  /// @dev DEPRECATED in favor of the single blobShnarfExists mapping.
  mapping(bytes32 dataHash => uint256 startingBlock) public dataStartingBlock;
  /// @dev DEPRECATED in favor of the single blobShnarfExists mapping.
  mapping(bytes32 dataHash => uint256 endingBlock) public dataEndingBlock;

  /// @dev DEPRECATED in favor of currentFinalizedState hash.
  uint256 public currentL2StoredL1MessageNumber;
  /// @dev DEPRECATED in favor of currentFinalizedState hash.
  bytes32 public currentL2StoredL1RollingHash;

  /// @notice Contains the most recent finalized shnarf.
  bytes32 public currentFinalizedShnarf;

  /**
   * @dev NB: THIS IS THE ONLY MAPPING BEING USED FOR DATA SUBMISSION TRACKING.
   * @dev NB: This was shnarfFinalBlockNumbers and is replaced to indicate only that a shnarf exists with a value of 1.
   */
  mapping(bytes32 shnarf => uint256 exists) public blobShnarfExists;

  /// @notice Hash of the L2 computed L1 message number, rolling hash and finalized timestamp.
  bytes32 public currentFinalizedState;

  /// @notice The address of the fallback operator.
  /// @dev This address is granted the OPERATOR_ROLE after six months of finalization inactivity by the current operators.
  address public fallbackOperator;

  /// @dev Total contract storage is 11 slots.

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /**
   * @notice Initializes LineaRollup and underlying service dependencies - used for new networks only.
   * @dev DEFAULT_ADMIN_ROLE is set for the security council.
   * @dev OPERATOR_ROLE is set for operators.
   * @dev Note: This is used for new testnets and local/CI testing, and will not replace existing proxy based contracts.
   * @param _initializationData The initial data used for proof verification.
   */
  function initialize(InitializationData calldata _initializationData) external initializer {
    if (_initializationData.defaultVerifier == address(0)) {
      revert ZeroAddressNotAllowed();
    }

    __PauseManager_init(_initializationData.pauseTypeRoles, _initializationData.unpauseTypeRoles);

    __MessageService_init(_initializationData.rateLimitPeriodInSeconds, _initializationData.rateLimitAmountInWei);

    /**
     * @dev DEFAULT_ADMIN_ROLE is set for the security council explicitly,
     * as the permissions init purposefully does not allow DEFAULT_ADMIN_ROLE to be set.
     */
    _grantRole(DEFAULT_ADMIN_ROLE, _initializationData.defaultAdmin);

    __Permissions_init(_initializationData.roleAddresses);

    verifiers[0] = _initializationData.defaultVerifier;

    fallbackOperator = _initializationData.fallbackOperator;
    emit FallbackOperatorAddressSet(msg.sender, _initializationData.fallbackOperator);

    currentL2BlockNumber = _initializationData.initialL2BlockNumber;
    stateRootHashes[_initializationData.initialL2BlockNumber] = _initializationData.initialStateRootHash;

    blobShnarfExists[GENESIS_SHNARF] = SHNARF_EXISTS_DEFAULT_VALUE;

    currentFinalizedShnarf = GENESIS_SHNARF;
    currentFinalizedState = _computeLastFinalizedState(0, EMPTY_HASH, _initializationData.genesisTimestamp);
  }

  /**
   * @notice Sets permissions for a list of addresses and their roles as well as initialises the PauseManager pauseType:role mappings and fallback operator.
   * @dev This function is a reinitializer and can only be called once per version. Should be called using an upgradeAndCall transaction to the ProxyAdmin.
   * @param _roleAddresses The list of addresses and roles to assign permissions to.
   * @param _pauseTypeRoles The list of pause types to associate with roles.
   * @param _unpauseTypeRoles The list of unpause types to associate with roles.
   * @param _fallbackOperator The address of the fallback operator.
   */
  function reinitializeLineaRollupV6(
    RoleAddress[] calldata _roleAddresses,
    PauseTypeRole[] calldata _pauseTypeRoles,
    PauseTypeRole[] calldata _unpauseTypeRoles,
    address _fallbackOperator
  ) external reinitializer(6) {
    __Permissions_init(_roleAddresses);
    __PauseManager_init(_pauseTypeRoles, _unpauseTypeRoles);

    if (_fallbackOperator == address(0)) {
      revert ZeroAddressNotAllowed();
    }

    fallbackOperator = _fallbackOperator;
    emit FallbackOperatorAddressSet(msg.sender, _fallbackOperator);

    /// @dev using the constants requires string memory and more complex code.
    emit LineaRollupVersionChanged(bytes8("5.0"), bytes8("6.0"));
  }

  /**
   * @notice Revokes `role` from the calling account.
   * @dev Fallback operator cannot renounce role. Reverts with OnlyNonFallbackOperator.
   * @param _role The role to renounce.
   * @param _account The account to renounce - can only be the _msgSender().
   */
  function renounceRole(bytes32 _role, address _account) public override {
    if (_account == fallbackOperator) {
      revert OnlyNonFallbackOperator();
    }

    super.renounceRole(_role, _account);
  }

  /**
   * @notice Adds or updates the verifier contract address for a proof type.
   * @dev VERIFIER_SETTER_ROLE is required to execute.
   * @param _newVerifierAddress The address for the verifier contract.
   * @param _proofType The proof type being set/updated.
   */
  function setVerifierAddress(address _newVerifierAddress, uint256 _proofType) external onlyRole(VERIFIER_SETTER_ROLE) {
    if (_newVerifierAddress == address(0)) {
      revert ZeroAddressNotAllowed();
    }

    emit VerifierAddressChanged(_newVerifierAddress, _proofType, msg.sender, verifiers[_proofType]);

    verifiers[_proofType] = _newVerifierAddress;
  }

  /**
   * @notice Sets the fallback operator role to the specified address if six months have passed since the last finalization.
   * @dev Reverts if six months have not passed since the last finalization.
   * @param _messageNumber Last finalized L1 message number as part of the feedback loop.
   * @param _rollingHash Last finalized L1 rolling hash as part of the feedback loop.
   * @param _lastFinalizedTimestamp Last finalized L2 block timestamp.
   */
  function setFallbackOperator(uint256 _messageNumber, bytes32 _rollingHash, uint256 _lastFinalizedTimestamp) external {
    if (block.timestamp < _lastFinalizedTimestamp + SIX_MONTHS_IN_SECONDS) {
      revert LastFinalizationTimeNotLapsed();
    }
    if (currentFinalizedState != _computeLastFinalizedState(_messageNumber, _rollingHash, _lastFinalizedTimestamp)) {
      revert FinalizationStateIncorrect(
        currentFinalizedState,
        _computeLastFinalizedState(_messageNumber, _rollingHash, _lastFinalizedTimestamp)
      );
    }

    address fallbackOperatorAddress = fallbackOperator;

    _grantRole(OPERATOR_ROLE, fallbackOperatorAddress);
    emit FallbackOperatorRoleGranted(msg.sender, fallbackOperatorAddress);
  }

  /**
   * @notice Unset the verifier contract address for a proof type.
   * @dev VERIFIER_UNSETTER_ROLE is required to execute.
   * @param _proofType The proof type being set/updated.
   */
  function unsetVerifierAddress(uint256 _proofType) external onlyRole(VERIFIER_UNSETTER_ROLE) {
    emit VerifierAddressChanged(address(0), _proofType, msg.sender, verifiers[_proofType]);

    delete verifiers[_proofType];
  }

  /**
   * @notice Submit one or more EIP-4844 blobs.
   * @dev OPERATOR_ROLE is required to execute.
   * @dev This should be a blob carrying transaction.
   * @param _blobSubmissions The data for blob submission including proofs and required polynomials.
   * @param _parentShnarf The parent shnarf used in continuity checks as it includes the parentStateRootHash in its computation.
   * @param _finalBlobShnarf The expected final shnarf post computation of all the blob shnarfs.
   */
  function submitBlobs(
    BlobSubmission[] calldata _blobSubmissions,
    bytes32 _parentShnarf,
    bytes32 _finalBlobShnarf
  ) external whenTypeAndGeneralNotPaused(PauseType.BLOB_SUBMISSION) onlyRole(OPERATOR_ROLE) {
    if (_blobSubmissions.length == 0) {
      revert BlobSubmissionDataIsMissing();
    }

    if (blobhash(_blobSubmissions.length) != EMPTY_HASH) {
      revert BlobSubmissionDataEmpty(_blobSubmissions.length);
    }

    if (blobShnarfExists[_parentShnarf] == 0) {
      revert ParentBlobNotSubmitted(_parentShnarf);
    }

    /**
     * @dev validate we haven't submitted the last shnarf. There is a final check at the end of the function verifying,
     * that _finalBlobShnarf was computed correctly.
     * Note: As only the last shnarf is stored, we don't need to validate shnarfs,
     * computed for any previous blobs in the submission (if multiple are submitted).
     */
    if (blobShnarfExists[_finalBlobShnarf] != 0) {
      revert DataAlreadySubmitted(_finalBlobShnarf);
    }

    bytes32 currentDataEvaluationPoint;
    bytes32 currentDataHash;

    /// @dev Assigning in memory saves a lot of gas vs. calldata reading.
    BlobSubmission memory blobSubmission;

    bytes32 computedShnarf = _parentShnarf;

    for (uint256 i; i < _blobSubmissions.length; i++) {
      blobSubmission = _blobSubmissions[i];

      currentDataHash = blobhash(i);

      if (currentDataHash == EMPTY_HASH) {
        revert EmptyBlobDataAtIndex(i);
      }

      bytes32 snarkHash = blobSubmission.snarkHash;

      currentDataEvaluationPoint = Utils._efficientKeccak(snarkHash, currentDataHash);

      _verifyPointEvaluation(
        currentDataHash,
        uint256(currentDataEvaluationPoint),
        blobSubmission.dataEvaluationClaim,
        blobSubmission.kzgCommitment,
        blobSubmission.kzgProof
      );

      computedShnarf = _computeShnarf(
        computedShnarf,
        snarkHash,
        blobSubmission.finalStateRootHash,
        currentDataEvaluationPoint,
        bytes32(blobSubmission.dataEvaluationClaim)
      );
    }

    if (_finalBlobShnarf != computedShnarf) {
      revert FinalShnarfWrong(_finalBlobShnarf, computedShnarf);
    }

    /// @dev use the last shnarf as the submission to store as technically it becomes the next parent shnarf.
    blobShnarfExists[computedShnarf] = SHNARF_EXISTS_DEFAULT_VALUE;

    emit DataSubmittedV3(_parentShnarf, computedShnarf, blobSubmission.finalStateRootHash);
  }

  /**
   * @notice Submit blobs using compressed data via calldata.
   * @dev OPERATOR_ROLE is required to execute.
   * @param _submission The supporting data for compressed data submission including compressed data.
   * @param _parentShnarf The parent shnarf used in continuity checks as it includes the parentStateRootHash in its computation.
   * @param _expectedShnarf The expected shnarf post computation of all the submission.
   */
  function submitDataAsCalldata(
    CompressedCalldataSubmission calldata _submission,
    bytes32 _parentShnarf,
    bytes32 _expectedShnarf
  ) external whenTypeAndGeneralNotPaused(PauseType.CALLDATA_SUBMISSION) onlyRole(OPERATOR_ROLE) {
    if (_submission.compressedData.length == 0) {
      revert EmptySubmissionData();
    }

    if (blobShnarfExists[_expectedShnarf] != 0) {
      revert DataAlreadySubmitted(_expectedShnarf);
    }

    if (blobShnarfExists[_parentShnarf] == 0) {
      revert ParentBlobNotSubmitted(_parentShnarf);
    }

    bytes32 currentDataHash = keccak256(_submission.compressedData);

    bytes32 dataEvaluationPoint = Utils._efficientKeccak(_submission.snarkHash, currentDataHash);

    bytes32 computedShnarf = _computeShnarf(
      _parentShnarf,
      _submission.snarkHash,
      _submission.finalStateRootHash,
      dataEvaluationPoint,
      _calculateY(_submission.compressedData, dataEvaluationPoint)
    );

    if (_expectedShnarf != computedShnarf) {
      revert FinalShnarfWrong(_expectedShnarf, computedShnarf);
    }

    blobShnarfExists[computedShnarf] = SHNARF_EXISTS_DEFAULT_VALUE;

    emit DataSubmittedV3(_parentShnarf, computedShnarf, _submission.finalStateRootHash);
  }

  /**
   * @notice Internal function to compute and save the finalization state.
   * @dev Using assembly this way is cheaper gas wise.
   * @param _messageNumber Is the last L2 computed L1 message number in the finalization.
   * @param _rollingHash Is the last L2 computed L1 rolling hash in the finalization.
   * @param _timestamp The final timestamp in the finalization.
   */
  function _computeLastFinalizedState(
    uint256 _messageNumber,
    bytes32 _rollingHash,
    uint256 _timestamp
  ) internal pure returns (bytes32 hashedFinalizationState) {
    assembly {
      let mPtr := mload(0x40)
      mstore(mPtr, _messageNumber)
      mstore(add(mPtr, 0x20), _rollingHash)
      mstore(add(mPtr, 0x40), _timestamp)
      hashedFinalizationState := keccak256(mPtr, 0x60)
    }
  }

  /**
   * @notice Internal function to compute the shnarf more efficiently.
   * @dev Using assembly this way is cheaper gas wise.
   * @param _parentShnarf The shnarf of the parent data item.
   * @param _snarkHash Is the computed hash for compressed data (using a SNARK-friendly hash function) that aggregates per data submission to be used in public input.
   * @param _finalStateRootHash The final state root hash of the data being submitted.
   * @param _dataEvaluationPoint The data evaluation point.
   * @param _dataEvaluationClaim The data evaluation claim.
   */
  function _computeShnarf(
    bytes32 _parentShnarf,
    bytes32 _snarkHash,
    bytes32 _finalStateRootHash,
    bytes32 _dataEvaluationPoint,
    bytes32 _dataEvaluationClaim
  ) internal pure returns (bytes32 shnarf) {
    assembly {
      let mPtr := mload(0x40)
      mstore(mPtr, _parentShnarf)
      mstore(add(mPtr, 0x20), _snarkHash)
      mstore(add(mPtr, 0x40), _finalStateRootHash)
      mstore(add(mPtr, 0x60), _dataEvaluationPoint)
      mstore(add(mPtr, 0x80), _dataEvaluationClaim)
      shnarf := keccak256(mPtr, 0xA0)
    }
  }

  /**
   * @notice Performs point evaluation for the compressed blob.
   * @dev _dataEvaluationPoint is modular reduced to be lower than the BLS_CURVE_MODULUS for precompile checks.
   * @param _currentDataHash The current blob versioned hash.
   * @param _dataEvaluationPoint The data evaluation point.
   * @param _dataEvaluationClaim The data evaluation claim.
   * @param _kzgCommitment The blob KZG commitment.
   * @param _kzgProof The blob KZG point proof.
   */
  function _verifyPointEvaluation(
    bytes32 _currentDataHash,
    uint256 _dataEvaluationPoint,
    uint256 _dataEvaluationClaim,
    bytes memory _kzgCommitment,
    bytes memory _kzgProof
  ) internal view {
    assembly {
      _dataEvaluationPoint := mod(_dataEvaluationPoint, BLS_CURVE_MODULUS)
    }

    (bool success, bytes memory returnData) = POINT_EVALUATION_PRECOMPILE_ADDRESS.staticcall(
      abi.encodePacked(_currentDataHash, _dataEvaluationPoint, _dataEvaluationClaim, _kzgCommitment, _kzgProof)
    );

    if (!success) {
      revert PointEvaluationFailed();
    }

    if (returnData.length != POINT_EVALUATION_RETURN_DATA_LENGTH) {
      revert PrecompileReturnDataLengthWrong(POINT_EVALUATION_RETURN_DATA_LENGTH, returnData.length);
    }

    uint256 fieldElements;
    uint256 blsCurveModulus;
    assembly {
      fieldElements := mload(add(returnData, 0x20))
      blsCurveModulus := mload(add(returnData, POINT_EVALUATION_RETURN_DATA_LENGTH))
    }
    if (fieldElements != POINT_EVALUATION_FIELD_ELEMENTS_LENGTH || blsCurveModulus != BLS_CURVE_MODULUS) {
      revert PointEvaluationResponseInvalid(fieldElements, blsCurveModulus);
    }
  }

  /**
   * @notice Finalize compressed blocks with proof.
   * @dev OPERATOR_ROLE is required to execute.
   * @param _aggregatedProof The aggregated proof.
   * @param _proofType The proof type.
   * @param _finalizationData The full finalization data.
   */
  function finalizeBlocks(
    bytes calldata _aggregatedProof,
    uint256 _proofType,
    FinalizationDataV3 calldata _finalizationData
  ) external whenTypeAndGeneralNotPaused(PauseType.FINALIZATION) onlyRole(OPERATOR_ROLE) {
    if (_aggregatedProof.length == 0) {
      revert ProofIsEmpty();
    }

    uint256 lastFinalizedBlockNumber = currentL2BlockNumber;

    if (stateRootHashes[lastFinalizedBlockNumber] != _finalizationData.parentStateRootHash) {
      revert StartingRootHashDoesNotMatch();
    }

    /// @dev currentFinalizedShnarf is updated in _finalizeBlocks and lastFinalizedShnarf MUST be set beforehand for the transition.
    bytes32 lastFinalizedShnarf = currentFinalizedShnarf;

    bytes32 finalShnarf = _finalizeBlocks(_finalizationData, lastFinalizedBlockNumber);

    uint256 publicInput = _computePublicInput(
      _finalizationData,
      lastFinalizedShnarf,
      finalShnarf,
      lastFinalizedBlockNumber,
      _finalizationData.endBlockNumber
    );

    _verifyProof(publicInput, _proofType, _aggregatedProof);
  }

  /**
   * @notice Internal function to finalize compressed blocks.
   * @param _finalizationData The full finalization data.
   * @param _lastFinalizedBlock The last finalized block.
   * @return finalShnarf The final computed shnarf in finalizing.
   */
  function _finalizeBlocks(
    FinalizationDataV3 calldata _finalizationData,
    uint256 _lastFinalizedBlock
  ) internal returns (bytes32 finalShnarf) {
    if (_finalizationData.endBlockNumber <= _lastFinalizedBlock) {
      revert FinalBlockNumberLessThanOrEqualToLastFinalizedBlock(_finalizationData.endBlockNumber, _lastFinalizedBlock);
    }

    _validateL2ComputedRollingHash(_finalizationData.l1RollingHashMessageNumber, _finalizationData.l1RollingHash);

    if (
      _computeLastFinalizedState(
        _finalizationData.lastFinalizedL1RollingHashMessageNumber,
        _finalizationData.lastFinalizedL1RollingHash,
        _finalizationData.lastFinalizedTimestamp
      ) != currentFinalizedState
    ) {
      revert FinalizationStateIncorrect(
        _computeLastFinalizedState(
          _finalizationData.lastFinalizedL1RollingHashMessageNumber,
          _finalizationData.lastFinalizedL1RollingHash,
          _finalizationData.lastFinalizedTimestamp
        ),
        currentFinalizedState
      );
    }

    if (_finalizationData.finalTimestamp >= block.timestamp) {
      revert FinalizationInTheFuture(_finalizationData.finalTimestamp, block.timestamp);
    }

    if (_finalizationData.shnarfData.finalStateRootHash == EMPTY_HASH) {
      revert FinalBlockStateEqualsZeroHash();
    }

    finalShnarf = _computeShnarf(
      _finalizationData.shnarfData.parentShnarf,
      _finalizationData.shnarfData.snarkHash,
      _finalizationData.shnarfData.finalStateRootHash,
      _finalizationData.shnarfData.dataEvaluationPoint,
      _finalizationData.shnarfData.dataEvaluationClaim
    );

    if (blobShnarfExists[finalShnarf] == 0) {
      revert FinalBlobNotSubmitted(finalShnarf);
    }

    _addL2MerkleRoots(_finalizationData.l2MerkleRoots, _finalizationData.l2MerkleTreesDepth);
    _anchorL2MessagingBlocks(_finalizationData.l2MessagingBlocksOffsets, _lastFinalizedBlock);

    stateRootHashes[_finalizationData.endBlockNumber] = _finalizationData.shnarfData.finalStateRootHash;

    currentL2BlockNumber = _finalizationData.endBlockNumber;

    currentFinalizedShnarf = finalShnarf;

    currentFinalizedState = _computeLastFinalizedState(
      _finalizationData.l1RollingHashMessageNumber,
      _finalizationData.l1RollingHash,
      _finalizationData.finalTimestamp
    );

    emit DataFinalizedV3(
      ++_lastFinalizedBlock,
      _finalizationData.endBlockNumber,
      finalShnarf,
      _finalizationData.parentStateRootHash,
      _finalizationData.shnarfData.finalStateRootHash
    );
  }

  /**
   * @notice Internal function to validate l1 rolling hash.
   * @param _rollingHashMessageNumber Message number associated with the rolling hash as computed on L2.
   * @param _rollingHash L1 rolling hash as computed on L2.
   */
  function _validateL2ComputedRollingHash(uint256 _rollingHashMessageNumber, bytes32 _rollingHash) internal view {
    if (_rollingHashMessageNumber == 0) {
      if (_rollingHash != EMPTY_HASH) {
        revert MissingMessageNumberForRollingHash(_rollingHash);
      }
    } else {
      if (_rollingHash == EMPTY_HASH) {
        revert MissingRollingHashForMessageNumber(_rollingHashMessageNumber);
      }
      if (rollingHashes[_rollingHashMessageNumber] != _rollingHash) {
        revert L1RollingHashDoesNotExistOnL1(_rollingHashMessageNumber, _rollingHash);
      }
    }
  }

  /**
   * @notice Internal function to calculate Y for public input generation.
   * @param _data Compressed data from submission data.
   * @param _dataEvaluationPoint The data evaluation point.
   * @dev Each chunk of 32 bytes must start with a 0 byte.
   * @dev The dataEvaluationPoint value is modulo-ed down during the computation and scalar field checking is not needed.
   * @dev There is a hard constraint in the circuit to enforce the polynomial degree limit (4096), which will also be enforced with EIP-4844.
   * @return compressedDataComputedY The Y calculated value using the Horner method.
   */
  function _calculateY(
    bytes calldata _data,
    bytes32 _dataEvaluationPoint
  ) internal pure returns (bytes32 compressedDataComputedY) {
    if (_data.length % 0x20 != 0) {
      revert BytesLengthNotMultipleOf32();
    }

    bytes4 errorSelector = ILineaRollup.FirstByteIsNotZero.selector;
    assembly {
      for {
        let i := _data.length
      } gt(i, 0) {

      } {
        i := sub(i, 0x20)
        let chunk := calldataload(add(_data.offset, i))
        if iszero(iszero(and(chunk, 0xFF00000000000000000000000000000000000000000000000000000000000000))) {
          let ptr := mload(0x40)
          mstore(ptr, errorSelector)
          revert(ptr, 0x4)
        }
        compressedDataComputedY := addmod(
          mulmod(compressedDataComputedY, _dataEvaluationPoint, BLS_CURVE_MODULUS),
          chunk,
          BLS_CURVE_MODULUS
        )
      }
    }
  }

  /**
   * @notice Compute the public input.
   * @dev Using assembly this way is cheaper gas wise.
   * @dev NB: the dynamic sized fields are placed last in _finalizationData on purpose to optimise hashing ranges.
   * @dev Computing the public input as the following:
   * keccak256(
   *  abi.encode(
   *     _lastFinalizedShnarf,
   *     _finalShnarf,
   *     _finalizationData.lastFinalizedTimestamp,
   *     _finalizationData.finalTimestamp,
   *     _lastFinalizedBlockNumber,
   *     _finalizationData.endBlockNumber,
   *     _finalizationData.lastFinalizedL1RollingHash,
   *     _finalizationData.l1RollingHash,
   *     _finalizationData.lastFinalizedL1RollingHashMessageNumber,
   *     _finalizationData.l1RollingHashMessageNumber,
   *     _finalizationData.l2MerkleTreesDepth,
   *     keccak256(
   *         abi.encodePacked(_finalizationData.l2MerkleRoots)
   *     )
   *   )
   * )
   * Data is found at the following offsets:
   * 0x00    parentStateRootHash
   * 0x20    endBlockNumber
   * 0x40    shnarfData.parentShnarf
   * 0x60    shnarfData.snarkHash
   * 0x80    shnarfData.finalStateRootHash
   * 0xa0    shnarfData.dataEvaluationPoint
   * 0xc0    shnarfData.dataEvaluationClaim
   * 0xe0    lastFinalizedTimestamp
   * 0x100   finalTimestamp
   * 0x120   lastFinalizedL1RollingHash
   * 0x140   l1RollingHash
   * 0x160   lastFinalizedL1RollingHashMessageNumber
   * 0x180   l1RollingHashMessageNumber
   * 0x1a0   l2MerkleTreesDepth
   * 0x1c0   l2MerkleRootsLengthLocation
   * 0x1e0   l2MessagingBlocksOffsetsLengthLocation
   * Dynamic l2MerkleRootsLength
   * Dynamic l2MerkleRoots
   * Dynamic l2MessagingBlocksOffsetsLength (location depends on where l2MerkleRoots ends)
   * Dynamic l2MessagingBlocksOffsets (location depends on where l2MerkleRoots ends)
   * @param _finalizationData The full finalization data.
   * @param _finalShnarf The final shnarf in the finalization.
   * @param _lastFinalizedBlockNumber The last finalized block number.
   * @param _endBlockNumber End block number being finalized.
   */
  function _computePublicInput(
    FinalizationDataV3 calldata _finalizationData,
    bytes32 _lastFinalizedShnarf,
    bytes32 _finalShnarf,
    uint256 _lastFinalizedBlockNumber,
    uint256 _endBlockNumber
  ) private pure returns (uint256 publicInput) {
    assembly {
      let mPtr := mload(0x40)
      mstore(mPtr, _lastFinalizedShnarf)
      mstore(add(mPtr, 0x20), _finalShnarf)

      /**
       * _finalizationData.lastFinalizedTimestamp
       * _finalizationData.finalTimestamp
       */
      calldatacopy(add(mPtr, 0x40), add(_finalizationData, 0xe0), 0x40)

      mstore(add(mPtr, 0x80), _lastFinalizedBlockNumber)

      // _finalizationData.endBlockNumber
      mstore(add(mPtr, 0xA0), _endBlockNumber)

      /**
       * _finalizationData.lastFinalizedL1RollingHash
       * _finalizationData.l1RollingHash
       * _finalizationData.lastFinalizedL1RollingHashMessageNumber
       * _finalizationData.l1RollingHashMessageNumber
       * _finalizationData.l2MerkleTreesDepth
       */
      calldatacopy(add(mPtr, 0xC0), add(_finalizationData, 0x120), 0xA0)

      /**
       * @dev Note the following in hashing the _finalizationData.l2MerkleRoots array:
       * The second memory pointer and free pointer are offset by 0x20 to temporarily hash the array outside the scope of working memory,
       * as we need the space left for the array hash to be stored at 0x160.
       */
      let mPtrMerkleRoot := add(mPtr, 0x180)
      let merkleRootsLengthLocation := add(_finalizationData, calldataload(add(_finalizationData, 0x1c0)))
      let merkleRootsLen := calldataload(merkleRootsLengthLocation)
      calldatacopy(mPtrMerkleRoot, add(merkleRootsLengthLocation, 0x20), mul(merkleRootsLen, 0x20))
      let l2MerkleRootsHash := keccak256(mPtrMerkleRoot, mul(merkleRootsLen, 0x20))
      mstore(add(mPtr, 0x160), l2MerkleRootsHash)

      publicInput := mod(keccak256(mPtr, 0x180), MODULO_R)
    }
  }
}